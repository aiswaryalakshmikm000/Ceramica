// adminOrderController.js
const Order = require("../../models/OrderModel");
const Product = require("../../models/productModel");
const {
  addWalletTransaction,
} = require("../../utils/services/addWalletHelper");

const getAllOrders = async (req, res) => {
  try {
    const { search, status, page = 1, limit = 10, sort } = req.query;

    // Build the filter object
    let filter = {};

    // Search by orderNumber, customerName, or email
    if (search) {
      filter.$or = [
        { orderNumber: { $regex: new RegExp(search, "i") } },
        { customerName: { $regex: new RegExp(search, "i") } },
        { "shippingAddress.email": { $regex: new RegExp(search, "i") } },
      ];
    }

    // Filter by status
    if (status !== undefined && status !== "") {
      filter.status = { $regex: new RegExp(`^${status}$`, "i") };
    }

    // Pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    let sortOption = {};
    if (sort) {
      const direction = sort.startsWith("-") ? -1 : 1;
      const field = sort.startsWith("-") ? sort.substring(1) : sort;
      sortOption[field] = direction;
    } else {
      sortOption.orderDate = -1;
    }

    // Get total count and orders
    const totalOrders = await Order.countDocuments(filter);
    const orders = await Order.find(filter)
      .populate("items.productId", "name")
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      totalOrdersCount: totalOrders,
      page: pageNum,
      totalPages: Math.ceil(totalOrders / limitNum),
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong while fetching orders.",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

const getOrderDetails = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId).populate(
      "items.productId"
    );
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
        data: null,
      });
    }

    res.status(200).json({
      success: true,
      message: "Order details retrieved successfully",
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve order details",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.orderId).populate(
      "items.productId"
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
        data: null,
      });
    }

    // Validate status
    const validStatuses = [
      "Pending",
      "Confirmed",
      "Shipped",
      "Out for Delivery",
      "Delivered",
      "Cancelled",
    ];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
        data: null,
      });
    }

    // Update main order status
    order.status = status;

    // Update status for all items
    order.items = order.items.map((item) => {
      item.status = status;

      // Reset returnRequest for each item when status is Delivered or Pending
      if (status === "Delivered" || status === "Pending") {
        item.returnRequest = {
          isRequested: false,
          requestedAt: undefined,
          reason: "",
          isApproved: false,
          approvedAt: undefined,
          adminComment: "",
        };
      }

      return item;
    });

    // Reset returnRequest for the main order when status is Delivered or Pending
    if (status === "Delivered" || status === "Pending") {
      order.returnRequest = {
        isRequested: false,
        reason: "",
        isApproved: false,
        approvedAt: undefined,
        adminComment: "",
      };
    }

    // Add to activity log
    order.activityLog.push({ status, changedAt: new Date() });
    await order.save();

    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update order status",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

const verifyReturnRequest = async (req, res) => {
  try {
    const { isApproved, adminComment = "", refundToWallet = false } = req.body;
    const orderId = req.params.orderId;

    const order = await Order.findById(orderId).populate("items.productId");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
        data: null,
      });
    }

    if (order.status !== "Return-Requested") {
      return res.status(400).json({
        success: false,
        message: "No return request pending for this order",
        data: null,
      });
    }

    // Update return request details
    order.returnRequest.isApproved = isApproved;
    order.returnRequest.approvedAt = new Date();
    order.returnRequest.adminComment = adminComment;
    order.status = isApproved ? "Returned" : "Return-Rejected";

    // Update stock for all items using Promise.all
    if (isApproved) {
      await Promise.all(
        order.items.map(async (item) => {
          await Product.updateOne(
            { _id: item.productId, "colors.name": item.color },
            {
              $inc: {
                "colors.$.stock": item.quantity,
                totalStock: item.quantity,
              },
            }
          );
          item.status = "Returned";
          // Update item return request if exists
          if (item.returnRequest) {
            item.returnRequest.isApproved = true;
            item.returnRequest.approvedAt = order.returnRequest.approvedAt;
            item.returnRequest.adminComment = adminComment;
          }
        })
      );

      // Refund to wallet if approved, refundToWallet is true, payment method is Razorpay or Wallet, and payment status is Paid
      if (
        refundToWallet &&
        (order.paymentMethod === "Razorpay" ||
          order.paymentMethod === "Wallet") &&
        order.paymentStatus === "Paid"
      ) {
        const refundAmount = order.totalAmount;
        const walletResult = await addWalletTransaction(
          order.userId,
          refundAmount,
          "credit",
          `Refund for returned order ${order.orderNumber}`,
          order._id
        );
        if (!walletResult.success) {
          throw new Error(walletResult.message);
        }
        order.paymentStatus = "Refunded";
      }
    } else {
      // For rejected returns, update item statuses
      order.items.forEach((item) => {
        item.status = "Return-Rejected";
        if (item.returnRequest) {
          item.returnRequest.isApproved = false;
          item.returnRequest.adminComment = adminComment;
        }
      });
    }

    // Log the activity
    order.activityLog.push({
      status: isApproved ? "Returned" : "Return-Rejected",
      changedAt: new Date(),
    });

    await order.save();

    res.status(200).json({
      success: true,
      message: `Return request ${
        isApproved ? "approved" : "rejected"
      } successfully`,
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to process return request",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

const verifyItemReturnRequest = async (req, res) => {
  try {
    const {
      isApproved,
      adminComment = "",
      itemId,
      refundToWallet = false,
    } = req.body;
    const { orderId } = req.params;

    const order = await Order.findById(orderId).populate("items.productId");
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
        data: null,
      });
    }

    const item = order.items.id(itemId);
    if (!item || !item.returnRequest.isRequested) {
      return res.status(400).json({
        success: false,
        message: "No return request pending for this item",
        data: null,
      });
    }

    // Update item return request details
    item.returnRequest.isApproved = isApproved;
    item.returnRequest.approvedAt = new Date();
    item.returnRequest.adminComment = adminComment;
    item.status = isApproved ? "Returned" : "Return-Rejected";

    // Check if all items are returned or return-rejected to update order status
    const allItemsProcessed = order.items.every(
      (i) =>
        i.status === "Returned" ||
        i.status === "Return-Rejected" ||
        !i.returnRequest.isRequested
    );
    order.status = allItemsProcessed
      ? isApproved
        ? "Returned"
        : "Return-Rejected"
      : "Return-Requested";

    if (isApproved) {
      await Product.updateOne(
        { _id: item.productId, "colors.name": item.color },
        { $inc: { "colors.$.stock": item.quantity, totalStock: item.quantity } }
      );

      if (
        refundToWallet &&
        (order.paymentMethod === "Razorpay" ||
          order.paymentMethod === "Wallet") &&
        order.paymentStatus === "Paid"
      ) {
        const refundAmount = item.totalPrice;
        const walletResult = await addWalletTransaction(
          order.userId,
          refundAmount,
          "credit",
          `Refund for returned item ${item.name} in order ${order.orderNumber}`,
          order._id
        );
        if (!walletResult.success) {
          throw new Error(walletResult.message);
        }
        item.paymentStatus = "Refunded";
      }
    }

    // Log the activity
    order.activityLog.push({
      status: isApproved
        ? `Item ${item.name} Returned`
        : `Item ${item.name} Return-Rejected`,
      changedAt: new Date(),
    });

    await order.save();

    res.status(200).json({
      success: true,
      message: `Item return request ${
        isApproved ? "approved" : "rejected"
      } successfully`,
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to process item return request",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

module.exports = {
  getAllOrders,
  getOrderDetails,
  updateOrderStatus,
  verifyReturnRequest,
  verifyItemReturnRequest,
};
