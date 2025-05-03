const Order = require("../../models/OrderModel");
const Product = require("../../models/productModel");
const Cart = require("../../models/cartModel");
const Razorpay = require("razorpay");
const Coupon = require("../../models/couponModel");
const crypto = require("crypto");
const {
  generateOrderNumber,
} = require("../../utils/orderUtils/generateOrderNumber");
const cartService = require("../../utils/services/cartService");
const Wallet = require("../../models/walletModel");
const PDFDocument = require("pdfkit");
const {
  addWalletTransaction,
} = require("../../utils/services/addWalletHelper");
const { resourceLimits } = require("worker_threads");
const {
  creditAdminWallet,
  debitAdminWallet,
} = require("../../utils/services/adminWalletHelper");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const createRazorpayOrder = async (req, res) => {
  try {
    const {
      amount,
      currency = "INR",
      userId,
      items,
      shippingAddress,
      coupon,
    } = req.body;

    if (!amount || typeof amount !== "number" || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid or missing amount",
      });
    }
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Items are required and must be a non-empty array",
      });
    }
    if (!shippingAddress || typeof shippingAddress !== "object") {
      return res.status(400).json({
        success: false,
        message: "Shipping address is required",
      });
    }
    if (!shippingAddress.fullName) {
      return res.status(400).json({
        success: false,
        message: "Full name in shipping address is required",
      });
    }

    const cart = await Cart.findOne({ userId }).populate({
      path: "items.productId",
      populate: { path: "categoryId" },
    });
    if (!cart || !cart.items.length) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      });
    }

    for (const item of items) {
      const isInStock = await cartService.checkStock(
        item.productId,
        item.color,
        item.quantity
      );
      if (!isInStock) {
        const product = await Product.findById(item.productId);
        return res.status(400).json({
          success: false,
          message: `${product.name} (${item.color}) is out of stock`,
        });
      }
    }

    let validatedCoupon = null;
    const couponCode = coupon ? coupon.code : null;
    console.log("have CCCCCCCCCCCCcccoupon ", couponCode);

    if (couponCode) {
      const {
        valid,
        message,
        coupon: couponData,
      } = await cartService.validateCoupon(couponCode, cart, userId, false);
      if (!valid) {
        return res.status(400).json({ success: false, message });
      }
      validatedCoupon = couponData;
    }

    console.log(
      "WERRRRRRRRCCCCCCCCCCCCCCCCCCCCCCCCCCCcc validatedCoupon",
      validatedCoupon
    );

    const updatedCart = await cartService.recalculateCartTotals(
      cart,
      validatedCoupon
    );

    console.log("UUUUUUUUUUUUUUUUUUUUUUUUUUUUUpdated cart", updatedCart);
    const totalAmount = updatedCart.totalAmount;

    const options = {
      amount: totalAmount * 100,
      currency,
      receipt: `receipt_${Date.now()}`,
    };

    const razorpayOrder = await razorpay.orders.create(options);

    const totalMRP = updatedCart.totalMRP;
    const productsDiscount = updatedCart.productsDiscount;
    const offerDiscount = updatedCart.offerDiscount;
    const couponDiscount = updatedCart.couponDiscount || 0;
    const shippingFee = updatedCart.deliveryCharge;

    const order = new Order({
      orderNumber: generateOrderNumber(),
      userId,
      customerName: shippingAddress.fullName,
      items: items.map((item) => ({
        productId: item.productId,
        name: item.name,
        color: item.color,
        quantity: item.quantity,
        image: item.image,
        originalPrice: item.originalPrice,
        latestPrice: item.latestPrice,
        discount: item.discount,
        totalPrice: item.totalPrice,
        status: "Payment-Pending",
        paymentStatus: "Pending",
      })),
      totalMRP,
      productsDiscount,
      offerDiscount,
      couponDiscount,
      couponCode: couponCode || null,
      shippingFee,
      totalAmount,
      shippingAddress,
      paymentMethod: "Razorpay",
      paymentStatus: "Pending",
      transactionId: razorpayOrder.id,
      status: "Payment-Pending",
      orderDate: new Date(),
      expectedDeliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      activityLog: [{ status: "Payment-Pending", changedAt: new Date() }],
    });

    await order.save();

    res.status(201).json({
      success: true,
      message: "Razorpay order created successfully",
      data: {
        orderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        orderNumber: order.orderNumber,
        _id: order._id,
      },
    });
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create Razorpay order",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

const verifyRazorpayPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Missing required payment details",
      });
    }

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        status: "failure",
        message: "Invalid payment signature",
      });
    }

    const order = await Order.findOne({
      transactionId: razorpay_order_id,
    }).populate({
      path: "items.productId",
      populate: { path: "categoryId" },
    });
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found for the provided Razorpay order ID",
      });
    }

    order.paymentStatus = "Paid";
    order.transactionId = razorpay_payment_id;
    order.status = "Confirmed";
    order.items.forEach((item) => {
      item.paymentStatus = "Paid";
      item.status = "Confirmed";
    });
    order.activityLog.push({
      status: "Confirmed",
      changedAt: new Date(),
    });

    for (const item of order.items) {
      await Product.updateOne(
        { _id: item.productId, "colors.name": item.color },
        {
          $inc: {
            "colors.$.stock": -item.quantity,
            totalStock: -item.quantity,
          },
        }
      );
    }

    await Cart.findOneAndUpdate(
      { userId: order.userId },
      {
        items: [],
        totalAmount: 0,
        totalItems: 0,
        totalMRP: 0,
        productsDiscount: 0,
        offerDiscount: 0,
        deliveryCharge: 0,
        couponDiscount: 0,
        couponId: null,
        couponCode: null,
      },
      { new: true }
    );

    // Credit admin wallet
    const adminWalletResult = await creditAdminWallet(
      order.totalAmount,
      `Payment received for order ${order.orderNumber}`,
      order._id,
      order.userId,
      "order"
    );
    if (!adminWalletResult.success) {
      throw new Error(adminWalletResult.message);
    }

    await order.save();

    res.status(200).json({
      success: true,
      status: "success",
      message: "Payment verified and order confirmed",
      data: {
        orderNumber: order.orderNumber,
        totalAmount: order.totalAmount,
        orderDate: order.orderDate,
        expectedDeliveryDate: order.expectedDeliveryDate,
        paymentMethod: order.paymentMethod,
      },
    });
  } catch (error) {
    console.error("Error verifying Razorpay payment:", error);
    res.status(500).json({
      success: false,
      message: "Failed to verify payment or update order",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Retry Payment for Failed/Pending Order
const retryRazorpayPayment = async (req, res) => {
  try {
    const { orderNumber, userId } = req.body;

    if (!orderNumber || !userId) {
      return res.status(400).json({
        success: false,
        message: "Order number and user ID are required",
      });
    }

    // Find the order
    const order = await Order.findOne({ orderNumber, userId });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found or does not belong to the user",
      });
    }

    if (order.paymentStatus !== "Pending"  ) {
      return res.status(400).json({
        success: false,
        message: "Order is not eligible for retry payment",
      });
    }

    const fiveDaysInMs = 5 * 24 * 60 * 60 * 1000;
    const timeSinceCreation = Date.now() - new Date(order.createdAt).getTime();

    if (timeSinceCreation > fiveDaysInMs) {
      return res.status(400).json({
        success: false,
        message:
          "Retry payment is only allowed within 5 days of order creation",
      });
    }

    for (const item of order.items) {
      const isInStock = await cartService.checkStock(
        item.productId,
        item.color,
        item.quantity
      );

      if (!isInStock) {
        const product = await Product.findById(item.productId);
        return res.status(400).json({
          success: false,
          message: `${product.name} (${item.color}) is out of stock`,
        });
      }
    }

    const options = {
      amount: order.totalAmount * 100,
      currency: "INR",
      receipt: `receipt_${orderNumber}_${Date.now()}`,
    };

    const razorpayOrder = await razorpay.orders.create(options);

    order.transactionId = razorpayOrder.id;
    order.paymentStatus = "Pending";
    order.items.forEach((item) => {
      item.paymentStatus = "Pending";
      item.status = "Payment-Pending";
    });
    order.activityLog.push({
      status: "Payment-Pending",
      changedAt: new Date(),
      description: "Retry payment initiated",
    });

    await order.save();

    res.status(200).json({
      success: true,
      message: "Retry payment order created successfully",
      data: {
        orderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        orderNumber: order.orderNumber,
        _id: order._id,
      },
    });
  } catch (error) {
    console.error("Error retrying payment:", error);
    res.status(500).json({
      success: false,
      message: "Failed to initiate retry payment",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

const placeCODOrder = async (req, res) => {
  try {
    const { cart, address, coupon } = req.body;
    const userId = req.user.id;

    if (!cart || !cart.items || !cart.items.length) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty or missing items",
      });
    }
    if (!address) {
      return res.status(400).json({
        success: false,
        message: "Address is required",
      });
    }

    const userCart = await Cart.findOne({ userId }).populate({
      path: "items.productId",
      populate: { path: "categoryId" },
    });
    if (!userCart || !userCart.items.length) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      });
    }

    const orderItems = await Promise.all(
      cart.items.map(async (item) => {
        const product = await Product.findById(item.productId);
        if (!product) {
          throw new Error(`Product not found: ${item.productId}`);
        }
        const isInStock = await cartService.checkStock(
          item.productId,
          item.color,
          item.quantity
        );
        if (!isInStock) {
          return res.status(400).json({
            success: false,
            message: `${product.name} (${item.color}) is out of stock`,
          });
        }
        return {
          productId: item.productId,
          name: product.name,
          color: item.color,
          quantity: item.quantity,
          image: item.image,
          originalPrice: product.price,
          latestPrice: product.discountedPrice,
          discount: product.discount,
          totalPrice: product.discountedPrice * item.quantity,
        };
      })
    );

    let validatedCoupon = null;
    const couponCode = coupon ? coupon.code : null;
    if (couponCode) {
      const {
        valid,
        message,
        coupon: couponData,
      } = await cartService.validateCoupon(couponCode, userCart, userId, true);
      if (!valid) {
        return res.status(400).json({ success: false, message });
      }
      validatedCoupon = couponData;
    }

    const updatedCart = await cartService.recalculateCartTotals(
      userCart,
      validatedCoupon
    );

    const totalMRP = updatedCart.totalMRP;
    const productsDiscount = updatedCart.productsDiscount;
    const offerDiscount = updatedCart.offerDiscount;
    const couponDiscount = updatedCart.couponDiscount || 0;
    const shippingFee = updatedCart.deliveryCharge;
    const totalAmount = updatedCart.totalAmount;

    if (totalAmount > 1000) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Order above 1000, could'nt place on COD",
        });
    }

    const orderDate = new Date();
    const expectedDeliveryDate = new Date(orderDate);
    expectedDeliveryDate.setDate(orderDate.getDate() + 7);

    const order = new Order({
      orderNumber: generateOrderNumber(),
      userId,
      customerName: address.fullName,
      items: orderItems,
      totalMRP,
      productsDiscount,
      offerDiscount,
      couponDiscount,
      couponCode: coupon ? coupon.code : null,
      shippingFee,
      totalAmount,
      shippingAddress: address,
      paymentMethod: "Cash on Delivery",
      paymentStatus: "Pending",
      status: "Confirmed",
      orderDate,
      expectedDeliveryDate,
      activityLog: [{ status: "Confirmed", changedAt: new Date() }],
    });

    await order.save();

    // Decrease stock
    for (const item of orderItems) {
      await Product.updateOne(
        { _id: item.productId, "colors.name": item.color },
        {
          $inc: {
            "colors.$.stock": -item.quantity,
            totalStock: -item.quantity,
          },
        }
      );
    }

    // Clear cart
    await Cart.findOneAndUpdate(
      { userId },
      {
        items: [],
        totalAmount: 0,
        totalItems: 0,
        totalMRP: 0,
        productsDiscount: 0,
        offerDiscount: 0,
        deliveryCharge: 0,
        couponDiscount: 0,
        couponId: null,
        couponCode: null,
      },
      { new: true }
    );

    res.status(201).json({
      success: true,
      message: "COD order placed successfully",
      data: {
        orderNumber: order.orderNumber,
        totalAmount: order.totalAmount,
        estimatedDelivery: order.expectedDeliveryDate,
        orderDate: order.orderDate,
        paymentMethod: order.paymentMethod,
      },
    });
  } catch (error) {
    console.error("Error placing COD order:", error);
    res.status(500).json({
      success: false,
      message: "Failed to place COD order",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

const placeWalletOrder = async (req, res) => {
  try {
    const { cart, address, coupon } = req.body;
    const userId = req.user.id;

    console.log("req.bodyyyyyyyyyyyyyyyyy", req.body);

    if (!cart || !cart.items || !cart.items.length) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty or missing items",
      });
    }
    if (!address) {
      return res.status(400).json({
        success: false,
        message: "Address is required",
      });
    }

    const userCart = await Cart.findOne({ userId });
    if (!userCart || !userCart.items.length) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      });
    }

    const orderItems = await Promise.all(
      cart.items.map(async (item) => {
        const product = await Product.findById(item.productId);
        if (!product) {
          throw new Error(`Product not found: ${item.productId}`);
        }
        const isInStock = await cartService.checkStock(
          item.productId,
          item.color,
          item.quantity
        );
        if (!isInStock) {
          return res.status(400).json({
            success: false,
            message: `${product.name} (${item.color}) is out of stock`,
          });
        }
        return {
          productId: item.productId,
          name: product.name,
          color: item.color,
          quantity: item.quantity,
          image: item.image,
          originalPrice: product.price,
          latestPrice: product.discountedPrice,
          discount: product.discount,
          totalPrice: product.discountedPrice * item.quantity,
          status: "Confirmed",
          paymentStatus: "Paid",
        };
      })
    );

    let validatedCoupon = null;
    const couponCode = coupon ? coupon.code : null;
    if (couponCode) {
      const {
        valid,
        message,
        coupon: couponData,
      } = await cartService.validateCoupon(couponCode, userCart, userId, true);
      if (!valid) {
        return res.status(400).json({ success: false, message });
      }
      validatedCoupon = couponData;
    }

    const updatedCart = await cartService.recalculateCartTotals(
      userCart,
      validatedCoupon
    );

    const totalAmount = updatedCart.totalAmount;

    const wallet = await Wallet.findOne({ user: userId });
    if (!wallet || wallet.balance < totalAmount) {
      return res.status(400).json({
        success: false,
        message: "Insufficient wallet balance",
      });
    }

    const totalMRP = updatedCart.totalMRP;
    const productsDiscount = updatedCart.productsDiscount;
    const offerDiscount = updatedCart.offerDiscount;
    const couponDiscount = updatedCart.couponDiscount || 0;
    const shippingFee = updatedCart.deliveryCharge;

    const orderDate = new Date();
    const expectedDeliveryDate = new Date(orderDate);
    expectedDeliveryDate.setDate(orderDate.getDate() + 7);

    const order = new Order({
      orderNumber: generateOrderNumber(),
      userId,
      customerName: address.fullName,
      items: orderItems,
      totalMRP,
      productsDiscount,
      offerDiscount,
      couponDiscount,
      couponCode: coupon ? coupon.code : null,
      shippingFee,
      totalAmount,
      shippingAddress: address,
      paymentMethod: "Wallet",
      paymentStatus: "Paid",
      status: "Confirmed",
      orderDate,
      expectedDeliveryDate,
      activityLog: [{ status: "Confirmed", changedAt: new Date() }],
    });

    await order.save();

    // Decrease stock
    for (const item of orderItems) {
      await Product.updateOne(
        { _id: item.productId, "colors.name": item.color },
        {
          $inc: {
            "colors.$.stock": -item.quantity,
            totalStock: -item.quantity,
          },
        }
      );
    }

    // Deduct wallet balance
    const walletResult = await addWalletTransaction(
      userId,
      totalAmount,
      "debit",
      `Payment for order ${order.orderNumber}`,
      order._id
    );
    if (!walletResult.success) {
      throw new Error(walletResult.message);
    }

    console.log("#@@@@@@@@@@>>>>>>>>  before hitting admin caredit amount");
    // Credit admin wallet
    const adminWalletResult = await creditAdminWallet(
      totalAmount,
      `Payment received for order ${order.orderNumber}`,
      order._id,
      userId,
      "order"
    );
    if (!adminWalletResult.success) {
      throw new Error(adminWalletResult.message);
    }

    // Clear cart
    await Cart.findOneAndUpdate(
      { userId },
      {
        items: [],
        totalAmount: 0,
        totalItems: 0,
        totalMRP: 0,
        productsDiscount: 0,
        offerDiscount: 0,
        deliveryCharge: 0,
        couponDiscount: 0,
        couponId: null,
        couponCode: null,
      },
      { new: true }
    );

    res.status(201).json({
      success: true,
      message: "Wallet order placed successfully",
      data: {
        orderNumber: order.orderNumber,
        totalAmount: order.totalAmount,
        estimatedDelivery: order.expectedDeliveryDate,
        orderDate: order.orderDate,
        paymentMethod: order.paymentMethod,
      },
    });
  } catch (error) {
    console.error("Error placing Wallet order:", error);
    res.status(500).json({
      success: false,
      message: "Failed to place Wallet order",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

const getUserOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const orders = await Order.find({ userId: req.user.id })
      .sort({ orderDate: -1 })
      .skip(skip)
      .limit(limit)
      .select(
        "orderNumber status orderDate totalAmount paymentStatus shippingAddress"
      );
    console.log("orders", orders);
    const totalOrders = await Order.countDocuments({ userId: req.user.id });
    console.log("totalOrders", totalOrders);
    res.status(200).json({
      success: true,
      message: orders.length
        ? "Orders retrieved successfully"
        : "No orders found",
      data: orders,
      pagination: {
        totalOrders,
        currentPage: page,
        totalPages: Math.ceil(totalOrders / limit),
        resourceLimits,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve orders",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

const getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({
      orderNumber: req.params.orderId,
      userId: req.user.id,
    }).populate("items.productId");

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

const cancelOrder = async (req, res) => {
  try {
    const { cancelReason } = req.body;

    const order = await Order.findOne({
      orderNumber: req.params.orderId,
      userId: req.user.id,
    }).populate("items.productId");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
        data: null,
      });
    }

    if (order.status !== "Pending" && order.status !== "Confirmed" && order.status !== "Payment-Pending") {
      return res.status(400).json({
        success: false,
        message: "Cannot cancel order at this stage",
        data: {
          currentStatus: order.status,
          cancellableStatuses: ["Pending", "Confirmed"],
        },
      });
    }

    order.status = "Cancelled";
    order.cancelReason = cancelReason;

    let refundAmount = 0;

    // Calculate refund for each item
    await Promise.all(
      order.items.map(async (item) => {
        if (item.status !== "Cancelled") {
          item.status = "Cancelled";
          const product = item.productId;
          if (!product) {
            throw new Error(`Product not found for item ${item._id}`);
          }

          // Get base price (after product discount)
          const basePrice =
            product.discount > 0 ? product.discountedPrice : product.price;

          // Apply offers to get final discounted price
          const { discountedPrice } = await cartService.applyOffers(
            product._id,
            basePrice
          );

          // Calculate refund for this item
          refundAmount += discountedPrice * item.quantity;
        }
      })
    );

    const deliveryCharge = order.shippingFee || 0;
    const couponDiscount = order.couponDiscount || 0;
    refundAmount = refundAmount + deliveryCharge - couponDiscount;

    order.activityLog.push({
      status: "Cancelled",
      changedAt: new Date(),
    });

    // Update product stock
    await Promise.all(
      order.items.map(async (item) => {
        if (item.status === "Cancelled" && !item.cancelProductReason) {
          await Product.updateOne(
            { _id: item.productId, "colors.name": item.color },
            {
              $inc: {
                "colors.$.stock": item.quantity,
                totalStock: item.quantity,
              },
            }
          );
        }
      })
    );

    // Process refund to wallet if applicable
    if (
      (order.paymentMethod === "Razorpay" ||
        order.paymentMethod === "Wallet") &&
      order.paymentStatus === "Paid" &&
      refundAmount > 0
    ) {
      // Debit admin wallet
      const adminWalletResult = await debitAdminWallet(
        refundAmount,
        `Refund for cancelled order ${order.orderNumber}`,
        order._id,
        req.user.id,
        "cancel"
      );
      if (!adminWalletResult.success) {
        throw new Error(adminWalletResult.message);
      }

      const walletResult = await addWalletTransaction(
        req.user.id,
        refundAmount,
        "credit",
        `Refund for cancelled order ${order.orderNumber}`,
        order._id
      );
      if (!walletResult.success) {
        throw new Error(walletResult.message);
      }
    }

    await order.save();

    res.status(200).json({
      success: true,
      message: "Order cancelled successfully",
      data: {
        orderNumber: order.orderNumber,
        cancelledAt: new Date(),
        refundedAmount: refundAmount,
      },
    });
  } catch (error) {
    console.error("Error cancelling order:", error);
    res.status(500).json({
      success: false,
      message: "Failed to cancel order",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

const cancelOrderItem = async (req, res) => {
  try {
    const { orderId, itemId, cancelProductReason } = req.body;

    const order = await Order.findOne({
      orderNumber: orderId,
      userId: req.user.id,
    }).populate("items.productId");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
        data: null,
      });
    }

    const item = order.items.id(itemId);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found in order",
        data: null,
      });
    }

    if (item.status !== "Pending" && item.status !== "Confirmed") {
      return res.status(400).json({
        success: false,
        message: "Cannot cancel item at this stage",
        data: {
          currentStatus: item.status,
          cancellableStatuses: ["Pending", "Confirmed"],
        },
      });
    }

    // Check if this is the last active item
    const activeItems = order.items.filter(
      (i) => i.status !== "Cancelled" && i._id.toString() !== itemId
    );
    if (activeItems.length === 0) {
      return res.status(400).json({
        success: false,
        message:
          "This is the last item in the order. Please use full order cancellation to include delivery charge refund.",
        data: null,
      });
    }

    item.status = "Cancelled";
    item.cancelProductReason = cancelProductReason;

    // Calculate refund for the item
    const product = item.productId;
    if (!product) {
      throw new Error(`Product not found for item ${item._id}`);
    }

    // Get base price (after product discount)
    const basePrice =
      product.discount > 0 ? product.discountedPrice : product.price;

    // Apply offers to get final discounted price
    const { discountedPrice } = await cartService.applyOffers(
      product._id,
      basePrice
    );

    // Calculate refund for this item
    const refundAmount = discountedPrice * item.quantity;

    order.activityLog.push({
      status: `Item ${item.name} Cancelled`,
      changedAt: new Date(),
    });

    // Update product stock
    await Product.updateOne(
      { _id: item.productId, "colors.name": item.color },
      { $inc: { "colors.$.stock": item.quantity, totalStock: item.quantity } }
    );

    // Process refund to wallet if applicable
    if (
      (order.paymentMethod === "Razorpay" ||
        order.paymentMethod === "Wallet") &&
      order.paymentStatus === "Paid" &&
      refundAmount > 0
    ) {
      // Debit admin wallet
      const adminWalletResult = await debitAdminWallet(
        refundAmount,
        `Refund for cancelled item ${item.name} in order ${order.orderNumber}`,
        order._id,
        req.user.id,
        "item-cancel"
      );
      if (!adminWalletResult.success) {
        throw new Error(adminWalletResult.message);
      }

      
      const walletResult = await addWalletTransaction(
        req.user.id,
        refundAmount,
        "credit",
        `Refund for cancelled item ${item.name} in order ${order.orderNumber}`,
        order._id
      );
      if (!walletResult.success) {
        throw new Error(walletResult.message);
      }
    }

    // Update order status if all items are cancelled
    const remainingActiveItems = order.items.filter(
      (i) => i.status !== "Cancelled"
    );
    if (remainingActiveItems.length === 0) {
      order.status = "Cancelled";
    }

    await order.save();

    res.status(200).json({
      success: true,
      message: "Item cancelled successfully",
      data: {
        orderNumber: order.orderNumber,
        itemId: item._id,
        cancelledAt: new Date(),
        refundedAmount: refundAmount,
      },
    });
  } catch (error) {
    console.error("Error cancelling item:", error);
    res.status(500).json({
      success: false,
      message: "Failed to cancel item",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

const returnOrder = async (req, res) => {
  try {
    const { reason, comment } = req.body;
    const orderId = req.params.orderId;

    const order = await Order.findOne({
      orderNumber: orderId,
      userId: req.user.id,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
        data: null,
      });
    }

    if (order.status !== "Delivered") {
      return res.status(400).json({
        success: false,
        message: "Can only return delivered orders",
        data: {
          currentStatus: order.status,
        },
      });
    }

    if (!reason) {
      return res.status(400).json({
        success: false,
        message: "Return reason is required",
        data: null,
      });
    }

    order.returnRequest = {
      isRequested: true,
      reason,
      comment,
      requestedAt: new Date(),
    };

    order.status = "Return-Requested";
    order.items.map((item) => (item.status = "Return-Requested"));

    order.activityLog.push({
      status: "Return-Requested",
      timestamp: new Date(),
    });

    await order.save();

    res.status(200).json({
      success: true,
      message: "Return request submitted successfully",
      data: {
        orderNumber: order.orderNumber,
        returnRequestId: order.returnRequest._id,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to process return request",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

const returnOrderItem = async (req, res) => {
  try {
    const { orderId, itemId, reason } = req.body;

    const order = await Order.findOne({
      _id: orderId,
      userId: req.user.id,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
        data: null,
      });
    }

    const item = order.items.id(itemId);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found in order",
        data: null,
      });
    }

    if (item.status !== "Delivered") {
      return res.status(400).json({
        success: false,
        message: "Can only return delivered items",
        data: {
          currentStatus: item.status,
          returnableStatuses: ["Delivered"],
        },
      });
    }

    if (!reason) {
      return res.status(400).json({
        success: false,
        message: "Return reason is required",
        data: null,
      });
    }

    item.status = "Return-Requested";
    order.status = "Return-Requested";
    item.returnRequest = {
      isRequested: true,
      requestedAt: new Date(),
      reason: reason,
    };

    order.activityLog.push({
      status: `Item ${item.name} Return-Requested`,
      timestamp: new Date(),
    });

    const deliveredItems = order.items.filter((i) => i.status === "Delivered");
    if (deliveredItems.length === 0) {
      order.status = "Return-Requested";
    }

    await order.save();

    res.status(200).json({
      success: true,
      message: "Item return request submitted successfully",
      data: {
        orderNumber: order.orderNumber,
        itemId: item._id,
        requestedAt: new Date(),
      },
    });
  } catch (error) {
    console.error("Error requesting item return:", error);
    res.status(500).json({
      success: false,
      message: "Failed to process item return request",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

const downloadInvoice = async (req, res) => {
  try {
    const order = await Order.findOne({
      orderNumber: req.params.orderId,
      userId: req.user.id,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
        data: null,
      });
    }

    const doc = new PDFDocument({ margin: 50 });
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=invoice-${order.orderNumber}.pdf`
    );

    doc.pipe(res);
    doc
      .fontSize(14)
      .font("Helvetica-Bold")
      .text("CERAMICA", { align: "center" });
    doc
      .fontSize(24)
      .font("Helvetica-Bold")
      .text("INVOICE", { align: "center" });
    doc.moveDown(0.5);

    // Draw a horizontal line
    doc.lineWidth(1).moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown(1);

    // Order & Customer Details - Two-column layout
    const startY = doc.y;

    // Left column - Customer information
    doc.font("Helvetica-Bold").fontSize(11).text("BILLED TO:", 50, startY);
    doc
      .font("Helvetica")
      .fontSize(10)
      .text(order.customerName, 50, doc.y + 5);

    if (order.shippingAddress) {
      doc.text(order.shippingAddress.addressLine);
      doc.text(
        `${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.pincode}`
      );
      doc.text(order.shippingAddress.email);
      doc.text(order.shippingAddress.phone);
    }

    // Reset y position and draw right column - Order information
    doc.font("Helvetica-Bold").fontSize(11).text("ORDER DETAILS:", 300, startY);
    doc
      .font("Helvetica")
      .fontSize(10)
      .text(`Order Number: ${order.orderNumber}`, 300, doc.y + 5);
    doc.text(
      `Date: ${order.orderDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })}`
    );
    doc.text(`Payment Method: ${order.paymentMethod}`);
    doc.text(`Order Status: ${order.status}`);

    // Find the lower of the two columns to continue
    const nextY = Math.max(doc.y + 20, startY + 100);
    doc.y = nextY;

    // Items Table Header
    doc.lineWidth(1).moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown(0.5);

    // Create table headers
    doc.font("Helvetica-Bold").fontSize(10);
    doc.text("ITEM", 50, doc.y);
    doc.text("COLOR", 310, doc.y - 10);
    doc.text("QTY", 400, doc.y - 10);
    doc.text("PRICE", 450, doc.y - 10);
    doc.text("TOTAL", 510, doc.y - 10);

    doc.moveDown(0.5);
    doc.lineWidth(0.5).moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown(0.5);

    // Items List
    doc.font("Helvetica").fontSize(10);
    order.items.forEach((item) => {
      const itemPositionY = doc.y;

      // Item name might be long, so we allow it to wrap
      doc.text(item.name, 50, itemPositionY, { width: 240 });

      // For the rest, we align them in their respective columns
      const itemHeight = doc.y - itemPositionY;

      doc.text(item.color, 310, itemPositionY);
      doc.text(item.quantity.toString(), 400, itemPositionY);
      doc.text(`₹${item.originalPrice}`, 450, itemPositionY);
      doc.text(`₹${item.totalPrice}`, 510, itemPositionY);

      doc.moveDown(0.5);
    });

    // Final separator line
    doc.lineWidth(0.5).moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown(1);

    // Summary section - Right aligned
    doc.font("Helvetica").fontSize(10);

    // Place subtotal on right side
    doc.text(`Subtotal:`, 400, doc.y);
    doc.text(`₹${order.totalMRP}`, 510, doc.y - 10);
    doc.moveDown(0.3);

    doc.text(`Product Discount:`, 400, doc.y);
    doc.text(`₹${order.productsDiscount}`, 510, doc.y - 10);
    doc.moveDown(0.3);

    doc.text(`Offer Discount:`, 400, doc.y);
    doc.text(`₹${order.offerDiscount}`, 510, doc.y - 10);
    doc.moveDown(0.3);

    doc.text(`Coupon Discount:`, 400, doc.y);
    doc.text(`₹${order.couponDiscount}`, 510, doc.y - 10);
    doc.moveDown(0.3);

    doc.text(`Shipping Fee:`, 400, doc.y);
    doc.text(`₹${order.shippingFee}`, 510, doc.y - 10);
    doc.moveDown(0.5);

    doc.lineWidth(0.5).moveTo(400, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown(0.5);

    doc.font("Helvetica-Bold");
    doc.text(`TOTAL:`, 400, doc.y);
    doc.text(`₹${order.totalAmount}`, 510, doc.y - 10);
    doc.end();
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to generate invoice",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

module.exports = {
  addWalletTransaction,
  createRazorpayOrder,
  verifyRazorpayPayment,
  retryRazorpayPayment,
  placeCODOrder,
  placeWalletOrder,
  getUserOrders,
  getOrderById,
  cancelOrder,
  cancelOrderItem,
  returnOrder,
  returnOrderItem,
  downloadInvoice,
};
