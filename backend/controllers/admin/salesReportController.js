
const Order = require("../../models/OrderModel");
const moment = require("moment");
const ExcelJS = require("exceljs");
const PDFDocument = require("pdfkit");

const formatCurrency = (amount) => amount.toFixed(2);

const validateQueryParams = (period, startDate, endDate) => {
  if (!period || !startDate || !endDate) {
    throw new Error("Missing required query parameters");
  }
  if (!["day", "week", "month", "year", "custom"].includes(period)) {
    throw new Error("Invalid period");
  }
  return {
    start: moment(startDate).startOf("day").toDate(),
    end: moment(endDate).endOf("day").toDate(),
  };
};

const generateLabels = (period, startDate, endDate) => {
  const labels = [];
  if (period === "day") {
    for (let i = 0; i < 24; i++) {
      labels.push(`${i}:00`);
    }
  } else if (period === "week") {
    labels.push(
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday"
    );
  } else if (period === "month") {
    const daysInMonth = moment(endDate).diff(moment(startDate), "days") + 1;
    for (let i = 0; i < daysInMonth; i++) {
      labels.push(`Day ${i + 1}`);
    }
  } else if (period === "year") {
    labels.push(
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec"
    );
  } else if (period === "custom") {
    const diffDays = moment(endDate).diff(moment(startDate), "days") + 1;
    for (let i = 0; i < diffDays; i++) {
      const date = moment(startDate).add(i, "days");
      labels.push(date.format("MMM D"));
    }
  }
  return labels;
};

const aggregateSalesData = async (period, start, end) => {
  let groupBy;
  if (period === "day") {
    groupBy = { $hour: "$orderDate" };
  } else if (period === "week") {
    groupBy = { $dayOfWeek: "$orderDate" };
  } else if (period === "month") {
    groupBy = { $dayOfMonth: "$orderDate" };
  } else if (period === "year") {
    groupBy = { $month: "$orderDate" };
  } else if (period === "custom") {
    groupBy = {
      $dateToString: { format: "%Y-%m-%d", date: "$orderDate" },
    };
  }

  const aggregation = [
    {
      $match: {
        orderDate: {
          $gte: start,
          $lte: end,
        },
        status: { $in: ["Confirmed", "Delivered"] },
      },
    },
    {
      $group: {
        _id: groupBy,
        sales: { $sum: "$totalAmount" },
        discount: { $sum: "$totalDiscount" },
        couponDiscount: { $sum: "$couponDiscount" },
        orders: { $sum: 1 },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ];

  return await Order.aggregate(aggregation);
};

const mapResultsToDataArrays = (results, period, labels) => {
  const salesData = new Array(labels.length).fill(0);
  const discountData = new Array(labels.length).fill(0);
  const couponData = new Array(labels.length).fill(0);
  const ordersData = new Array(labels.length).fill(0);

  results.forEach((result) => {
    let index;
    if (period === "day") {
      index = result._id;
    } else if (period === "week") {
      index = result._id - 1;
    } else if (period === "month") {
      index = result._id - 1;
    } else if (period === "year") {
      index = result._id - 1;
    } else if (period === "custom") {
      const date = moment(result._id, "YYYY-MM-DD").format("MMM D");
      index = labels.indexOf(date);
    }

    if (index >= 0 && index < labels.length) {
      salesData[index] = result.sales;
      discountData[index] = result.discount;
      couponData[index] = result.couponDiscount;
      ordersData[index] = result.orders;
    }
  });

  return { salesData, discountData, couponData, ordersData };
};

const calculateSummary = (salesData, discountData, couponData, ordersData) => {
  const totalSales = salesData.reduce((sum, val) => sum + val, 0);
  const totalDiscount = discountData.reduce((sum, val) => sum + val, 0);
  const totalCouponDiscount = couponData.reduce((sum, val) => sum + val, 0);
  const totalOrders = ordersData.reduce((sum, val) => sum + val, 0);
  const netSales = totalSales - totalDiscount - totalCouponDiscount;
  const averageOrderValue = totalOrders ? netSales / totalOrders : 0;

  return {
    totalSales,
    totalDiscount,
    totalCouponDiscount,
    totalOrders,
    netSales,
    averageOrderValue,
  };
};

const generateTableData = (labels, salesData, discountData, couponData, ordersData) => {
  return labels.map((label, index) => ({
    period: label,
    sales: salesData[index],
    discount: discountData[index],
    couponDiscount: couponData[index],
    netSales: salesData[index] - discountData[index] - couponData[index],
    orders: ordersData[index],
  }));
};



const getSalesReport = async (req, res, next) => {
  try {
    const { period, startDate, endDate } = req.query;

    const { start, end } = validateQueryParams(period, startDate, endDate);
    const labels = generateLabels(period, start, end);
    const results = await aggregateSalesData(period, start, end);
    const { salesData, discountData, couponData, ordersData } = mapResultsToDataArrays(results, period, labels);
    const summary = calculateSummary(salesData, discountData, couponData, ordersData);
    const tableData = generateTableData(labels, salesData, discountData, couponData, ordersData);

    const response = {
      chartData: {
        labels,
        datasets: [
          {
            label: "Sales",
            data: salesData,
            backgroundColor: "rgba(60, 115, 168, 0.7)",
            borderColor: "rgba(60, 115, 168, 1)",
            borderWidth: 1,
          },
          {
            label: "Discounts",
            data: discountData,
            backgroundColor: "rgba(255, 99, 132, 0.7)",
            borderColor: "rgba(255, 99, 132, 1)",
            borderWidth: 1,
          },
          {
            label: "Coupon Discounts",
            data: couponData,
            backgroundColor: "rgba(255, 206, 86, 0.7)",
            borderColor: "rgba(255, 206, 86, 1)",
            borderWidth: 1,
          },
        ],
      },
      summary: {
        totalSales: formatCurrency(summary.totalSales),
        totalDiscount: formatCurrency(summary.totalDiscount),
        totalCouponDiscount: formatCurrency(summary.totalCouponDiscount),
        totalOrders: summary.totalOrders,
        netSales: formatCurrency(summary.netSales),
        averageOrderValue: formatCurrency(summary.averageOrderValue),
      },
      tableData,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching sales report:", error);
    res.status(500).json({ error: error.message || "Internal server error" });
  }
};


const downloadExcelReport = async (req, res, next) => {
  try {
    const { period, startDate, endDate } = req.query;

    const { start, end } = validateQueryParams(period, startDate, endDate);
    const labels = generateLabels(period, start, end);
    const results = await aggregateSalesData(period, start, end);
    const { salesData, discountData, couponData, ordersData } = mapResultsToDataArrays(results, period, labels);
    const summary = calculateSummary(salesData, discountData, couponData, ordersData);
    const tableData = generateTableData(labels, salesData, discountData, couponData, ordersData);

    const workbook = new ExcelJS.Workbook();
    workbook.creator = "Sales Report System";
    workbook.created = new Date();
    
    const worksheet = workbook.addWorksheet("Sales Report", {
      properties: { tabColor: { argb: "4F81BD" } }
    });

    // Add title and date range
    worksheet.mergeCells('A1:F1');
    const titleCell = worksheet.getCell('A1');
    titleCell.value = 'SALES REPORT';
    titleCell.font = {
      name: 'Arial',
      size: 16,
      bold: true,
      color: { argb: '000000' }
    };
    titleCell.alignment = { horizontal: 'center' };
    
    worksheet.mergeCells('A2:F2');
    const periodCell = worksheet.getCell('A2');
    periodCell.value = `Period: ${period.toUpperCase()} | Date Range: ${moment(startDate).format("MMM D, YYYY")} - ${moment(endDate).format("MMM D, YYYY")}`;
    periodCell.font = {
      name: 'Arial',
      size: 10,
      italic: true
    };
    periodCell.alignment = { horizontal: 'center' };
    
    // Add space before table
    worksheet.addRow([]);

    // Set headers with styling
    const headerRow = worksheet.addRow([
      "Period", 
      "Sales ($)", 
      "Discounts ($)", 
      "Coupon Discounts ($)", 
      "Net Sales ($)", 
      "Orders"
    ]);
    
    headerRow.eachCell((cell) => {
      cell.font = {
        bold: true,
        color: { argb: 'FFFFFF' }
      };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '4F81BD' }
      };
      cell.alignment = { horizontal: 'center' };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
    });

    // Set column widths
    worksheet.columns = [
      { key: 'period', width: 15 },
      { key: 'sales', width: 15, style: { numFmt: '$#,##0.00' } },
      { key: 'discount', width: 15, style: { numFmt: '$#,##0.00' } },
      { key: 'couponDiscount', width: 18, style: { numFmt: '$#,##0.00' } },
      { key: 'netSales', width: 15, style: { numFmt: '$#,##0.00' } },
      { key: 'orders', width: 10 }
    ];

    // Add data rows with alternating colors
    tableData.forEach((row, i) => {
      const dataRow = worksheet.addRow({
        period: row.period,
        sales: row.sales,
        discount: row.discount,
        couponDiscount: row.couponDiscount,
        netSales: row.netSales,
        orders: row.orders,
      });
      
      dataRow.eachCell((cell) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
        if (i % 2) {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'F2F2F2' }
          };
        }
      });
    });

    // Add space before summary
    worksheet.addRow([]);
    worksheet.addRow([]);

    // Add summary section with styling
    const summaryHeaderRow = worksheet.addRow(['Summary']);
    summaryHeaderRow.getCell(1).font = {
      bold: true,
      size: 14
    };
    worksheet.mergeCells(`A${summaryHeaderRow.number}:F${summaryHeaderRow.number}`);
    
    // Add styled summary data
    const summaryData = [
      ["Total Sales", summary.totalSales],
      ["Total Discounts", summary.totalDiscount],
      ["Total Coupon Discounts", summary.totalCouponDiscount],
      ["Total Orders", summary.totalOrders],
      ["Net Sales", summary.netSales],
      ["Average Order Value", summary.averageOrderValue]
    ];
    
    summaryData.forEach((item) => {
      const row = worksheet.addRow([item[0], item[0] === "Total Orders" ? item[1] : formatCurrency(item[1])]);
      
      row.getCell(1).font = { bold: true };
      
      // Format numbers as currency except for order count
      if (item[0] !== "Total Orders") {
        row.getCell(2).numFmt = '$#,##0.00';
      }
      
      // Highlight key metrics with fill
      row.getCell(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'E6F0FF' }
      };
      row.getCell(2).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'E6F0FF' }
      };
      
      // Add borders
      row.eachCell((cell) => {
        cell.border = {
          outline: { style: 'thin' }
        };
      });
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=sales-report-${moment().format("YYYYMMDD")}.xlsx`
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error("Error generating Excel report:", error);
    res.status(500).json({ error: error.message || "Internal server error" });
  }
};

const downloadPdfReport = async (req, res, next) => {
  try {
    const { period, startDate, endDate } = req.query;

    const { start, end } = validateQueryParams(period, startDate, endDate);
    const labels = generateLabels(period, start, end);
    const results = await aggregateSalesData(period, start, end);
    const { salesData, discountData, couponData, ordersData } = mapResultsToDataArrays(results, period, labels);
    const summary = calculateSummary(salesData, discountData, couponData, ordersData);
    const tableData = generateTableData(labels, salesData, discountData, couponData, ordersData);

    const doc = new PDFDocument({
      margins: { top: 50, bottom: 50, left: 50, right: 50 },
      size: 'A4'
    });
    
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=sales-report-${moment().format("YYYYMMDD")}.pdf`
    );

    doc.pipe(res);

    // Helper functions for PDF rendering
    const drawRect = (x, y, w, h, fillColor = '#f6f6f6', strokeColor = '#dddddd') => {
      doc.rect(x, y, w, h)
        .fillAndStroke(fillColor, strokeColor);
    };
    
    const drawTableHeader = (x, y, headers, colWidths) => {
      doc.fillColor('#ffffff')
         .rect(x, y, colWidths.reduce((a, b) => a + b, 0), 25)
         .fill('#4477aa');
      
      let xPos = x;
      headers.forEach((header, i) => {
        doc.fillColor('#ffffff')
           .font('Helvetica-Bold')
           .fontSize(10)
           .text(header, xPos + 5, y + 8, { width: colWidths[i] - 10, align: 'center' });
        xPos += colWidths[i];
      });
      
      return y + 25;
    };
    
    // Add logo/title
    doc.fontSize(24)
       .font('Helvetica-Bold')
       .fillColor('#333333')
       .text('SALES REPORT', { align: 'center' });
    
    // Add report metadata
    doc.moveDown();
    doc.fontSize(12)
       .font('Helvetica')
       .fillColor('#666666')
       .text(`Period: ${period.toUpperCase()}`, { align: 'center' });
    
    doc.fontSize(12)
       .text(`Date Range: ${moment(startDate).format("MMM D, YYYY")} - ${moment(endDate).format("MMM D, YYYY")}`, { align: 'center' });
    
    // Summary section with highlight boxes
    doc.moveDown(2);
    doc.fontSize(16)
       .font('Helvetica-Bold')
       .fillColor('#333333')
       .text('Summary', { underline: true });
    
    doc.moveDown();
    
    // Create highlighted summary boxes
    const summaryStartY = doc.y;
    const boxWidth = 250;
    const boxHeight = 40;
    const boxGap = 20;
    const boxesPerRow = 2;
    const margin = 20;
    
    // Summary data to display in highlight boxes
    const summaryBoxes = [
      { label: 'Total Sales', value: `$${formatCurrency(summary.totalSales)}`, color: '#e3f2fd' },
      { label: 'Net Sales', value: `$${formatCurrency(summary.netSales)}`, color: '#e8f5e9' },
      { label: 'Total Discounts', value: `$${formatCurrency(summary.totalDiscount)}`, color: '#fff3e0' },
      { label: 'Total Coupon Discounts', value: `$${formatCurrency(summary.totalCouponDiscount)}`, color: '#f3e5f5' },
      { label: 'Total Orders', value: summary.totalOrders.toString(), color: '#e1f5fe' },
      { label: 'Average Order Value', value: `$${formatCurrency(summary.averageOrderValue)}`, color: '#e0f2f1' }
    ];
    
    // Draw summary boxes
    let currentY = summaryStartY;
    
    for (let i = 0; i < summaryBoxes.length; i += boxesPerRow) {
      for (let j = 0; j < boxesPerRow && i + j < summaryBoxes.length; j++) {
        const box = summaryBoxes[i + j];
        const xPos = j === 0 ? 50 : 50 + boxWidth + margin;
        
        // Draw background box
        drawRect(xPos, currentY, boxWidth, boxHeight, box.color);
        
        // Add label
        doc.font('Helvetica-Bold')
           .fontSize(12)
           .fillColor('#333333')
           .text(box.label, xPos + 10, currentY + 8);
        
        // Add value
        doc.font('Helvetica-Bold')
           .fontSize(14)
           .fillColor('#000000')
           .text(box.value, xPos + 10, currentY + 22);
      }
      currentY += boxHeight + 15;
    }
    
    // Table section
    doc.moveDown(4);
    doc.fontSize(16)
       .font('Helvetica-Bold')
       .fillColor('#333333')
       .text('Detailed Report', { underline: true });
    
    doc.moveDown();
    
    // Define column widths
    const colWidths = [80, 90, 90, 110, 90, 60];
    const headers = ['Period', 'Sales ($)', 'Discounts ($)', 'Coupon Discounts ($)', 'Net Sales ($)', 'Orders'];
    
    // Draw table headers
    let tableY = doc.y;
    tableY = drawTableHeader(50, tableY, headers, colWidths);
    
    // Draw table rows
    tableData.forEach((row, index) => {
      // Check if we need to add a new page
      if (tableY > doc.page.height - 100) {
        doc.addPage();
        tableY = 50;
        tableY = drawTableHeader(50, tableY, headers, colWidths);
      }
      
      // Draw alternating row background
      if (index % 2 === 0) {
        drawRect(50, tableY, colWidths.reduce((a, b) => a + b, 0), 20, '#f9f9f9');
      }
      
      let xPos = 50;
      
      // Period
      doc.font('Helvetica')
         .fontSize(10)
         .fillColor('#333333')
         .text(row.period, xPos + 5, tableY + 5, { width: colWidths[0] - 10 });
      xPos += colWidths[0];
      
      // Sales
      doc.text(`$${formatCurrency(row.sales)}`, xPos + 5, tableY + 5, { width: colWidths[1] - 10, align: 'right' });
      xPos += colWidths[1];
      
      // Discounts
      doc.text(`$${formatCurrency(row.discount)}`, xPos + 5, tableY + 5, { width: colWidths[2] - 10, align: 'right' });
      xPos += colWidths[2];
      
      // Coupon Discounts
      doc.text(`$${formatCurrency(row.couponDiscount)}`, xPos + 5, tableY + 5, { width: colWidths[3] - 10, align: 'right' });
      xPos += colWidths[3];
      
      // Net Sales
      doc.text(`$${formatCurrency(row.netSales)}`, xPos + 5, tableY + 5, { width: colWidths[4] - 10, align: 'right' });
      xPos += colWidths[4];
      
      // Orders
      doc.text(row.orders.toString(), xPos + 5, tableY + 5, { width: colWidths[5] - 10, align: 'right' });
      
      tableY += 20;
    });
    
    // Footer
    const pageCount = doc.bufferedPageRange().count;
    for (let i = 0; i < pageCount; i++) {
      doc.switchToPage(i);
      doc.fontSize(8)
         .fillColor('#999999')
         .text(
           `Generated on ${moment().format('MMMM D, YYYY [at] h:mm A')} | Page ${i + 1} of ${pageCount}`,
           50,
           doc.page.height - 50,
           { align: 'center' }
         );
    }

    doc.end();
  } catch (error) {
    console.error("Error generating PDF report:", error);
    res.status(500).json({ error: error.message || "Internal server error" });
  }
};



module.exports = {
  downloadPdfReport,
  downloadExcelReport,
  getSalesReport,
  aggregateSalesData,
  generateLabels,
};