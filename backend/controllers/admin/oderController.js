// adminOrderController.js
const Order = require('../../models/OrderModel');
const Product = require('../../models/productModel');

const getAllOrders = async (req, res) => {
  try {
    const { search, status, page = 1, limit = 10 } = req.query;

    console.log("#@@@@@@@@@@@@@@@@@@@@@@@@@ req.query", req.query)

    // Build the filter object
    let filter = {};

    // Search by orderNumber, customerName, or email
    if (search) {
      filter.$or = [
        { orderNumber: { $regex: new RegExp(search, 'i') } },
        { customerName: { $regex: new RegExp(search, 'i') } },
        { 'shippingAddress.email': { $regex: new RegExp(search, 'i') } },
      ];
    }

    // Filter by status
    if (status) {
      filter.status = status;
    }

    // Pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    console.log("Filter #########3333", filter)

    // Get total count and orders
    const totalOrders = await Order.countDocuments(filter);
    const orders = await Order.find(filter)
      .populate('items.productId', 'name') 
      .sort({ orderDate: -1 }) 
      .skip(skip)
      .limit(limitNum);

      console.log("Order######################################### #########3333", orders)

    res.status(200).json({
      success: true,
      totalOrdersCount: totalOrders,
      page: pageNum,
      totalPages: Math.ceil(totalOrders / limitNum),
      orders,
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({
      success: false,
      message: 'Something went wrong while fetching orders.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

const getOrderDetails = async (req, res) => {
  consoel.log("GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGet order dertails")
  try {
    const order = await Order.findOne({ orderNumber: req.params.orderId })
      .populate('items.productId');

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

const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.orderId).populate('items.productId');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
        data: null
      });
    }

    // Validate status
    const validStatuses = ['Pending', 'Confirmed', 'Shipped', 'Out-for-Delivery', 'Delivered', 'Cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status',
        data: null
      });
    }

    order.status = status;
    order.items.map((item) => item.status= status)


    if (status === 'Delivered' || status === 'Pending') {
      order.returnRequest = {
        isRequested: false,
        reason: '',
        isApproved: false
      };
    }
    
    order.activityLog.push({ status, changedAt: new Date() });
    await order.save();

    res.status(200).json({
      success: true,
      message: 'Order status updated successfully',
      data: order
    });
  } catch (error) {
    console.log("Error", error);
    res.status(500).json({
      success: false,
      message: 'Failed to update order status',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

const verifyReturnRequest = async (req, res) => {
  try {
    const { isApproved } = req.body;
    const order = await Order.findById(req.params.orderId).populate('items.productId');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
        data: null
      });
    }

    if (order.status !== 'Return-Requested') {
      return res.status(400).json({
        success: false,
        message: 'No return request pending for this order',
        data: null
      });
    }

    order.returnRequest.isApproved = isApproved;
    order.returnRequest.approvedAt = new Date();
    order.status = isApproved ? 'Returned' : 'Return-Rejected';

    if (isApproved) {
      await Promise.all(order.items.map(async (item) => {
        await Product.updateOne(
          { _id: item.productId, 'colors.name': item.color },
          { $inc: { 'colors.$.stock': item.quantity, totalStock: item.quantity } }
        );
        // Update item status
        item.status = 'Returned';
        // If you have return request details in items as well
        if (item.returnRequest) {
          item.returnRequest.isApproved = true;
          item.returnRequest.requestedAt = order.returnRequest.approvedAt;
        }
      }));
    } else {
      // For rejected returns, update item statuses
      order.items.forEach(item => {
        item.status = 'Return-Rejected';
      });
    }

    order.activityLog.push({ 
      status: isApproved ? 'Returned' : 'Return-Rejected', 
      changedAt: new Date() 
    });

    await order.save();
    
    res.status(200).json({
      success: true,
      message: `Return request ${isApproved ? 'approved' : 'rejected'} successfully`,
      data: order
    });
  } catch (error) {
    console.log("Error ", error);
    res.status(500).json({
      success: false,
      message: 'Failed to process return request',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};


module.exports = {
  getAllOrders,
  getOrderDetails,
  updateOrderStatus,
  verifyReturnRequest
};