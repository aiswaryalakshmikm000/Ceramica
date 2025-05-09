const Order = require("../../models/OrderModel");
const Product = require("../../models/productModel");
const {
  addWalletTransaction,
} = require("../../utils/services/addWalletHelper");
const {applyOffers} = require('../../utils/services/cartService')
const {debitAdminWallet} = require('../../utils/services/adminWalletHelper')

const getAllOrders = async (req, res) => {
  try {
    const { search, status, page = 1, limit = 10, sort } = req.query;

    let filter = {};

    if (search) {
      filter.$or = [
        { orderNumber: { $regex: new RegExp(search, "i") } },
        { customerName: { $regex: new RegExp(search, "i") } },
        { "shippingAddress.email": { $regex: new RegExp(search, "i") } },
      ];
    }

    if (status !== undefined && status !== "") {
      filter.status = { $regex: new RegExp(`^${status}$`, "i") };
    }

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
    const { orderId }  = req.params;
    const order = await Order.findById(orderId).populate(
      "items.productId"
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
        data: null,
      });
    }

    const validStatuses = [
      "Pending",
      "Confirmed",
      "Shipped",
      "Out for Delivery",
      "Delivered",
      "Cancelled",
      "Payment-Pending",
      "Return-Rejected",
      "Returned"
    ];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
        data: null,
      });
    }

    if (order.status === "Payment-Pending" || order.status === "Cancelled" || order.status === "Delivered" || order.status === "Returned") {
      return res.status(400).json({
        success: false,
        message: "Cannot change the status",
        data: {
          currentStatus: order.status,
          allowedAction: "Wait for payment to be completed or failed",
        },
      });
    }
    
    order.status = status;

    order.items = order.items.map((item) => {
      if(item.status === "Cancelled" || item.status === "Return-Requested" || item.status === "Returned") {
        return item;
      }
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

      item.status = status;
      return item;
    });

    if (status === "Delivered" || status === "Pending") {
      order.returnRequest = {
        isRequested: false,
        reason: "",
        isApproved: false,
        approvedAt: undefined,
        adminComment: "",
      };
    }

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

    order.returnRequest.isApproved = isApproved;
    order.returnRequest.approvedAt = new Date();
    order.returnRequest.adminComment = adminComment;
    order.status = isApproved ? "Returned" : "Return-Rejected";

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
          if (item.returnRequest) {
            item.returnRequest.isApproved = true;
            item.returnRequest.approvedAt = order.returnRequest.approvedAt;
            item.returnRequest.adminComment = adminComment;
          }
        })
      );

      if (
        refundToWallet &&
        (order.paymentMethod === "Razorpay" ||
          order.paymentMethod === "Wallet") &&
        order.paymentStatus === "Paid"
      ) {

        const refundAmount = order.totalAmount - (order.shippingFee + order.couponDiscount);

        // Debit admin wallet
        const adminWalletResult = await debitAdminWallet(
          refundAmount,
          `Refund for returned order ${order.orderNumber}`,
          order._id,
          order.userId,
          "return"
        );
        if (!adminWalletResult.success) {
          throw new Error(adminWalletResult.message);
        }

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
      order.items.forEach((item) => {
        item.status = "Return-Rejected";
        if (item.returnRequest) {
          item.returnRequest.isApproved = false;
          item.returnRequest.adminComment = adminComment;
        }
      });
    }

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

    item.returnRequest.isApproved = isApproved;
    item.returnRequest.approvedAt = new Date();
    item.returnRequest.adminComment = adminComment;
    item.status = isApproved ? "Returned" : "Return-Rejected";

    const allItemsProcessed = order.items.every(
      (i) =>
        i.status === "Returned" ||
        i.status === "Return-Rejected" ||
        !i.returnRequest.isRequested
    );
    // order.status = allItemsProcessed
    //   ? isApproved
    //     ? "Returned"
    //     : "Return-Rejected"
    //   : "Return-Requested";

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

        const product = item.productId
        if (!product){
          throw new Error (`Product not found for the item ${item._id}`)
        }

        const basePrice = product.discount > 0 ? product.discountedPrice : product.price;
        const {discountedPrice} = await applyOffers(product._id, basePrice)
        const totalItems = order.items.length;
        const apportionedCouponDiscount = order.couponDiscount / totalItems;

        const refundAmount = (discountedPrice * item.quantity) + apportionedCouponDiscount;

         // Debit admin wallet
         const adminWalletResult = await debitAdminWallet(
          refundAmount,
          `Refund for returned item ${item.name} in order ${order.orderNumber}`,
          order._id,
          order.userId,
          "item-return"
        );
        if (!adminWalletResult.success) {
          throw new Error(adminWalletResult.message);
        }

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
