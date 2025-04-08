const Order = require('../../models/OrderModel');
const Product = require('../../models/productModel');
const Cart = require('../../models/cartModel');
const { generateOrderNumber } = require('../../utils/orderUtils/generateOrderNumber');
const PDFDocument = require('pdfkit');
const cartService = require('../../utils/services/cartService');

const placeOrder = async (req, res) => {

  try {
    const { cart, address, paymentMethod, coupon } = req.body;
    const userId = req.user.id;

    // Validate cart items stock
    for (const item of cart.items) {
      const isInStock = await cartService.checkStock(item.productId, item.color, item.quantity);
      if (!isInStock) {
        return res.status(400).json({ 
          success: false,
          message: `${item.name} (${item.color}) is out of stock. Please remove from cart to place order`,
          data: null
        });
      }
    }

    const orderItems = cart.items.map(item => ({
      productId: item.productId,
      name: item.name,
      color: item.color,
      quantity: item.quantity,
      image: item.image,
      originalPrice: item.originalPrice,
      latestPrice: item.latestPrice,
      discount: item.discount,
      totalPrice: item.latestPrice * item.quantity
    }));


    const order = new Order({
      orderNumber: generateOrderNumber(),
      userId,
      customerName: address.fullName,
      items: orderItems,
      totalMRP: cart.totalMRP,
      totalDiscount: cart.totalDiscount,
      couponDiscount: coupon ? coupon.discount : 0,
      couponCode: coupon ? coupon.code : null,
      shippingFee: cart.deliveryCharge,
      totalAmount: cart.totalAmount,
      shippingAddress: address,
      paymentMethod: paymentMethod,
    });

    await order.save();

    // Clear cart
    const cartUpdateResult = await Cart.findOneAndUpdate({ userId }, { items: [], totalAmount: 0 });


    // Decrease stock
    for (const item of orderItems) {
      await Product.updateOne(
        { _id: item.productId, 'colors.name': item.color },
        { $inc: { 'colors.$.stock': -item.quantity, totalStock: -item.quantity } }
      );
    }

    res.status(201).json({ 
      success: true,
      message: 'Order placed successfully',
      data: {
        orderNumber: order.orderNumber,
        totalAmount: order.totalAmount,
        estimatedDelivery: order.expectedDeliveryDate
      }
    });
  } catch (error) {
    console.error("Error in placeOrder:", error.stack);
    res.status(500).json({ 
      success: false,
      message: 'Failed to place order',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

const getUserOrders = async (req, res) => {

  try {
    const orders = await Order.find({ userId: req.user.id })
      .sort({ orderDate: -1 })
      .select('orderNumber status orderDate totalAmount paymentStatus');
    
    res.status(200).json({
      success: true,
      message: orders.length ? 'Orders retrieved successfully' : 'No orders found',
      data: orders,
      count: orders.length
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Failed to retrieve orders',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

const getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({ 
      orderNumber: req.params.orderId, 
      userId: req.user.id 
    }).populate('items.productId');
    
    if (!order) {
      return res.status(404).json({ 
        success: false,
        message: 'Order not found',
        data: null
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Order details retrieved successfully',
      data: order
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Failed to retrieve order details',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

const cancelOrder = async (req, res) => {
  try {
    const { cancelReason } = req.body;

    const order = await Order.findOne({ 
      orderNumber: req.params.orderId, 
      userId: req.user.id 
    });
    

    if (!order) {
      return res.status(404).json({ 
        success: false,
        message: 'Order not found',
        data: null
      });
    }
    
    if (order.status !== 'Pending' && order.status !== 'Confirmed') {
      return res.status(400).json({ 
        success: false,
        message: 'Cannot cancel order at this stage',
        data: {
          currentStatus: order.status,
          cancellableStatuses: ['Pending', 'Confirmed']
        }
      });
    }

    order.status = 'Cancelled';
    
    order.items.map((item) => item.status = "Cancelled")
    order.cancelReason = cancelReason;

    order.activityLog.push({ 
      status: 'Cancelled',
      timestamp: new Date()
    });


    // Restore stock
    await Promise.all(order.items.map(async (item) => {
      await Product.updateOne(
        { _id: item.productId, 'colors.name': item.color },
        { $inc: { 'colors.$.stock': item.quantity, totalStock: item.quantity } }
      );
    }));

    await order.save();
    
    res.status(200).json({ 
      success: true,
      message: 'Order cancelled successfully',
      data: {
        orderNumber: order.orderNumber,
        cancelledAt: new Date()
      }
    });
  } catch (error) {
    console.error('Error cancelling order:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to cancel order',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

const cancelOrderItem = async (req, res) => {
  try {
    const { orderId, itemId, cancelProductReason } = req.body;

    // Find the order
    const order = await Order.findOne({ 
      orderNumber: orderId, 
      userId: req.user.id 
    });

    if (!order) {
      return res.status(404).json({ 
        success: false,
        message: 'Order not found',
        data: null
      });
    }

    // Find the item in the order
    const item = order.items.id(itemId);
    if (!item) {
      return res.status(404).json({ 
        success: false,
        message: 'Item not found in order',
        data: null
      });
    }

    // Check if the item can be canceled
    if (item.status !== 'Pending' && item.status !== 'Confirmed') {
      return res.status(400).json({ 
        success: false,
        message: 'Cannot cancel item at this stage',
        data: {
          currentStatus: item.status,
          cancellableStatuses: ['Pending', 'Confirmed']
        }
      });
    }

    // Update item status and cancel reason
    item.status = 'Cancelled';
    item.cancelProductReason = cancelProductReason;

    // Log the activity
    order.activityLog.push({ 
      status: `Item ${item.name} Cancelled`,
      timestamp: new Date()
    });

    // Restore stock for the canceled item
    await Product.updateOne(
      { _id: item.productId, 'colors.name': item.color },
      { $inc: { 'colors.$.stock': item.quantity, totalStock: item.quantity } }
    );

    // Recalculate order totals
    const activeItems = order.items.filter(i => i.status !== 'Cancelled');
    order.totalMRP = activeItems.reduce((sum, i) => sum + i.originalPrice * i.quantity, 0);
    order.totalDiscount = activeItems.reduce((sum, i) => sum + i.discount * i.quantity, 0);
    order.totalAmount = activeItems.reduce((sum, i) => sum + i.totalPrice, 0);

    // If all items are canceled, cancel the entire order
    if (activeItems.length === 0) {
      order.status = 'Cancelled';
    }

    await order.save();

    res.status(200).json({ 
      success: true,
      message: 'Item cancelled successfully',
      data: {
        orderNumber: order.orderNumber,
        itemId: item._id,
        cancelledAt: new Date()
      }
    });
  } catch (error) {
    console.error('Error cancelling item:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to cancel item',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

const returnOrder = async (req, res) => {
  try {
    const { reason, comment } = req.body;
    const orderId = req.params.orderId; 

    const order = await Order.findOne({ 
      orderNumber: orderId, 
      userId: req.user.id 
    });


    if (!order) {
      return res.status(404).json({ 
        success: false,
        message: 'Order not found',
        data: null
      });
    }

    
    if (order.status !== 'Delivered') {
      return res.status(400).json({ 
        success: false,
        message: 'Can only return delivered orders',
        data: {
          currentStatus: order.status
        }
      });
    }
    
    if (!reason) {
      return res.status(400).json({ 
        success: false,
        message: 'Return reason is required',
        data: null
      });
    }

    order.returnRequest = {
      isRequested: true,
      reason,
      comment,
      requestedAt: new Date()
    };

    order.status= 'Return-Requested'
    order.items.map((item) => item.status = "Return-Requested")

    order.activityLog.push({ 
      status: 'Return-Requested',
      timestamp: new Date()
    });

    await order.save();

    
    res.status(200).json({ 
      success: true,
      message: 'Return request submitted successfully',
      data: {
        orderNumber: order.orderNumber,
        returnRequestId: order.returnRequest._id
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Failed to process return request',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

const returnOrderItem = async (req, res) => {
  try {
    const { orderId, itemId, returnProductReason } = req.body;

    // Find the order
    const order = await Order.findOne({ 
      orderNumber: orderId, 
      userId: req.user.id 
    });

    if (!order) {
      return res.status(404).json({ 
        success: false,
        message: 'Order not found',
        data: null
      });
    }

    // Find the item in the order
    const item = order.items.id(itemId);
    if (!item) {
      return res.status(404).json({ 
        success: false,
        message: 'Item not found in order',
        data: null
      });
    }

    // Check if the item can be returned
    if (item.status !== 'Delivered') {
      return res.status(400).json({ 
        success: false,
        message: 'Can only return delivered items',
        data: {
          currentStatus: item.status,
          returnableStatuses: ['Delivered']
        }
      });
    }

    if (!returnProductReason) {
      return res.status(400).json({ 
        success: false,
        message: 'Return reason is required',
        data: null
      });
    }

    // Update item status and return reason
    item.status = 'Return-Requested';
    order.status= 'Return-Requested'
    item.returnProductReason = returnProductReason;
    item.returnRequest = {
      isRequested: true,
      requestedAt: new Date()
    };

    // Log the activity
    order.activityLog.push({ 
      status: `Item ${item.name} Return-Requested`,
      timestamp: new Date()
    });


    // Optional: Update order status if all items are returned
    const deliveredItems = order.items.filter(i => i.status === 'Delivered');
    if (deliveredItems.length === 0) {
      order.status = 'Return-Requested';
    }

    await order.save();

    res.status(200).json({ 
      success: true,
      message: 'Item return request submitted successfully',
      data: {
        orderNumber: order.orderNumber,
        itemId: item._id,
        requestedAt: new Date()
      }
    });
  } catch (error) {
    console.error('Error requesting item return:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to process item return request',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

const downloadInvoice = async (req, res) => {
  try {
    const order = await Order.findOne({ 
      orderNumber: req.params.orderId, 
      userId: req.user.id 
    });
    
    if (!order) {
      return res.status(404).json({ 
        success: false,
        message: 'Order not found',
        data: null
      });
    }

    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=invoice-${order.orderNumber}.pdf`);

    doc.pipe(res);
    doc.fontSize(20).text('Invoice', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Order Number: ${order.orderNumber}`);
    doc.text(`Date: ${order.orderDate.toLocaleDateString()}`);
    doc.text(`Customer: ${order.customerName}`);
    doc.moveDown();
    
    order.items.forEach(item => {
      doc.text(`${item.name} (${item.color}) - Qty: ${item.quantity} - ₹${item.totalPrice}`);
    });
    
    doc.moveDown();
    doc.text(`Total Amount: ₹${order.totalAmount}`);
    doc.end();
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Failed to generate invoice',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  placeOrder,
  getUserOrders,
  getOrderById,
  cancelOrder,
  returnOrder,
  downloadInvoice,
  cancelOrderItem,
  returnOrderItem,
};