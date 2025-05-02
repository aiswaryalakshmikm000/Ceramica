// Backend file (e.g., dashboardController.js)
const mongoose = require('mongoose');
const Order = require('../../models/OrderModel');
const Product = require('../../models/productModel');
const Category = require('../../models/categoryModel');
const User = require('../../models/userModel');
const moment = require('moment');

// Helper function to calculate date range
const getDateRangeFilter = (startDate, endDate) => {
  const start = moment(startDate).startOf('day').toDate();
  const end = moment(endDate).endOf('day').toDate();
  return {
    orderDate: {
      $gte: start,
      $lte: end,
    },
  };
};

// Helper function to generate labels based on period
const generateLabels = (filterType, startDate, endDate) => {
  const labels = [];
  const start = moment(startDate);
  const end = moment(endDate);

  if (filterType === 'daily') {
    for (let i = 0; i < 24; i++) {
      labels.push(`${i}:00`);
    }
  } else if (filterType === 'weekly') {
    labels.push('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday');
  } else if (filterType === 'monthly') {
    const daysInMonth = end.diff(start, 'days') + 1;
    for (let i = 0; i < daysInMonth; i++) {
      labels.push(`Day ${i + 1}`);
    }
  } else if (filterType === 'yearly') {
    labels.push('Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec');
  }
  return labels;
};

// Helper function to get group format based on filterType
const getGroupFormat = (filterType) => {
  switch (filterType) {
    case 'daily':
      return { $hour: '$orderDate' };
    case 'weekly':
      return { $dayOfWeek: '$orderDate' };
    case 'monthly':
      return { $dayOfMonth: '$orderDate' };
    case 'yearly':
      return { $month: '$orderDate' };
    default:
      return { $dayOfWeek: '$orderDate' }; 
  }
};

// Helper function to map aggregation results to data arrays
const mapResultsToDataArrays = (results, filterType, labels) => {
  const salesData = new Array(labels.length).fill(0);
  const productsDiscountData = new Array(labels.length).fill(0);
  const offerDiscountData = new Array(labels.length).fill(0);
  const couponDiscountData = new Array(labels.length).fill(0);

  results.forEach((result) => {
    let index;
    if (filterType === 'daily') {
      index = result._id;
    } else if (filterType === 'weekly') {
      index = result._id - 1; // MongoDB $dayOfWeek starts from 1 (Sunday)
    } else if (filterType === 'monthly') {
      index = result._id - 1;
    } else if (filterType === 'yearly') {
      index = result._id - 1;
    }

    if (index >= 0 && index < labels.length) {
      salesData[index] = result.sales;
      productsDiscountData[index] = result.productsDiscount;
      offerDiscountData[index] = result.offerDiscount;
      couponDiscountData[index] = result.couponDiscount;
    }
  });

  return { salesData, productsDiscountData, offerDiscountData, couponDiscountData };
};

// 1. Get Dashboard Summary Stats
const getStatus = async (req, res) => {
  try {
    const { startDate, endDate, filterType } = req.query;

    const dateFilter = startDate && endDate ? getDateRangeFilter(startDate, endDate) : {};

    const orderStats = await Order.aggregate([
      {
        $match: {
          ...dateFilter,
          status: 'Delivered', 
        },
      },
      {
        $group: {
          _id: null,
          netSales: { $sum: '$totalAmount' },
          totalOrders: { $sum: 1 },
        },
      },
      {
        $project: {
          netSales: 1,
          totalOrders: 1,
        },
      },
    ]);

    const activeUsers = await User.countDocuments({
      isBlocked: false,
      isVerified: true,
    });

    const stats = orderStats[0] || { netSales: 0, totalOrders: 0 };
    stats.activeUsers = activeUsers;

    res.status(200).json(stats);
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ message: 'Server error while fetching dashboard stats' });
  }
};

// 2. Get Sales Data
const getSales = async (req, res) => {
  try {
    const { startDate, endDate, filterType = 'weekly' } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({ message: 'Start date and end date are required' });
    }

    if (!['daily', 'weekly', 'monthly', 'yearly'].includes(filterType)) {
      return res.status(400).json({ message: 'Invalid filter type' });
    }

    const dateFilter = getDateRangeFilter(startDate, endDate);
    const labels = generateLabels(filterType, startDate, endDate);
    const groupFormat = getGroupFormat(filterType);

    const salesData = await Order.aggregate([
      {
        $match: {
          ...dateFilter,
          status: 'Delivered', 
        },
      },
      {
        $group: {
          _id: groupFormat,
          sales: { $sum: '$totalAmount' },
          productsDiscount: { $sum: '$productsDiscount' },
          offerDiscount: { $sum: '$offerDiscount' },
          couponDiscount: { $sum: '$couponDiscount' },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    const { salesData: salesArray, productsDiscountData, offerDiscountData, couponDiscountData } = mapResultsToDataArrays(
      salesData,
      filterType,
      labels
    );

    const response = {
      labels,
      datasets: [
        {
          label: 'Sales',
          data: salesArray,
          backgroundColor: 'rgba(60, 115, 168, 0.7)',
          borderColor: 'rgba(60, 115, 168, 1)',
          borderWidth: 1,
        },
        {
          label: 'Products Discounts',
          data: productsDiscountData,
          backgroundColor: 'rgba(255, 99, 132, 0.7)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1,
        },
        {
          label: 'Offer Discounts',
          data: offerDiscountData,
          backgroundColor: 'rgba(75, 192, 192, 0.7)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        },
        {
          label: 'Coupon Discounts',
          data: couponDiscountData,
          backgroundColor: 'rgba(255, 206, 86, 0.7)',
          borderColor: 'rgba(255, 206, 86, 1)',
          borderWidth: 1,
        },
      ],
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Error fetching sales data:', error);
    res.status(500).json({ message: 'Server error while fetching sales data' });
  }
};

// 3. Get Top Products
const getTopProducts = async (req, res) => {
  try {
    const { startDate, endDate, limit = 10, filterType = 'weekly' } = req.query;

    console.log('getTopProducts .......................................query:', req.query);

    if (!startDate || !endDate) {
      return res.status(400).json({ message: 'Start date and end date are required' });
    }

    if (!['daily', 'weekly', 'monthly', 'yearly'].includes(filterType)) {
      return res.status(400).json({ message: 'Invalid filter type' });
    }

    const dateFilter = getDateRangeFilter(startDate, endDate);
    const labels = generateLabels(filterType, startDate, endDate);

    const topProducts = await Order.aggregate([
      {
        $match: {
          ...dateFilter,
          status: 'Delivered', 
        },
      },
      {
        $unwind: '$items',
      },
      {
        $group: {
          _id: '$items.productId',
          name: { $first: '$items.name' },
          sales: { $sum: '$items.quantity' },
          revenue: { $sum: '$items.totalPrice' },
        },
      },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'product',
        },
      },
      {
        $unwind: '$product',
      },
      {
        $lookup: {
          from: 'categories',
          localField: 'product.categoryId',
          foreignField: '_id',
          as: 'category',
        },
      },
      {
        $unwind: {
          path: '$category',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          name: 1,
          sales: 1,
          revenue: 1,
          totalStock: '$product.totalStock',
          categoryName: '$category.name',
        },
      },
      {
        $sort: { sales: -1 },
      },
      {
        $limit: parseInt(limit),
      },
    ]);

    const response = {
      labels,
      products: topProducts,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Error fetching top products:', error);
    res.status(500).json({ message: 'Server error while fetching top products' });
  }
};

// 4. Get Top Categories
const getTopCategories = async (req, res) => {
  try {
    const { startDate, endDate, limit = 10, filterType = 'weekly' } = req.query;

    console.log('getTopCategories ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;query:', req.query);

    if (!startDate || !endDate) {
      return res.status(400).json({ message: 'Start date and end date are required' });
    }

    if (!['daily', 'weekly', 'monthly', 'yearly'].includes(filterType)) {
      return res.status(400).json({ message: 'Invalid filter type' });
    }

    const dateFilter = getDateRangeFilter(startDate, endDate);
    const labels = generateLabels(filterType, startDate, endDate);

    const topCategories = await Order.aggregate([
      {
        $match: {
          ...dateFilter,
          status: 'Delivered', // Changed to only include Delivered
        },
      },
      {
        $unwind: '$items',
      },
      {
        $lookup: {
          from: 'products',
          localField: 'items.productId',
          foreignField: '_id',
          as: 'product',
        },
      },
      {
        $unwind: '$product',
      },
      {
        $group: {
          _id: '$product.categoryId',
          sales: { $sum: '$items.quantity' },
          revenue: { $sum: '$items.totalPrice' },
        },
      },
      {
        $lookup: {
          from: 'categories',
          localField: '_id',
          foreignField: '_id',
          as: 'category',
        },
      },
      {
        $unwind: '$category',
      },
      {
        $project: {
          name: '$category.name',
          sales: 1,
          revenue: 1,
        },
      },
      {
        $sort: { sales: -1 },
      },
      {
        $limit: parseInt(limit),
      },
    ]);

    const response = {
      labels,
      categories: topCategories,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Error fetching top categories:', error);
    res.status(500).json({ message: 'Server error while fetching top categories' });
  }
};

module.exports = {
  getStatus,
  getSales,
  getTopProducts,
  getTopCategories,
};