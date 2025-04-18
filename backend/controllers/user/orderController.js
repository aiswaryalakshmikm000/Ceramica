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
const {addWalletTransaction} = require('../../utils/services/addWalletHelper')


const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create Razorpay Order
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

    console.log("#################################3", req.body);
    // Validate required fields
    if (!amount || typeof amount !== "number" || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid or missing amount",
      });
    }
    if (!userId) {
      console.log("#################################3 no user");
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }
    if (!items || !Array.isArray(items) || items.length === 0) {
      console.log("#################################3 cart empty");
      return res.status(400).json({
        success: false,
        message: "Items are required and must be a non-empty array",
      });
    }
    if (!shippingAddress || typeof shippingAddress !== "object") {
      console.log("#################################3 need shipping address");
      return res.status(400).json({
        success: false,
        message: "Shipping address is required",
      });
    }
    if (!shippingAddress.fullName) {
      console.log("#################################3 fullname required");
      return res.status(400).json({
        success: false,
        message: "Full name in shipping address is required",
      });
    }

    // Fetch the user's cart
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

    // Validate stock
    for (const item of items) {
      const isInStock = await cartService.checkStock(
        item.productId,
        item.color,
        item.quantity
      );
      if (!isInStock) {
        console.log("#################################3 item out of stock");
        const product = await Product.findById(item.productId);
        return res.status(400).json({
          success: false,
          message: `${product.name} (${item.color}) is out of stock`,
        });
      }
    }

    // Validate coupon if provided
    let validatedCoupon = null;
    const couponCode = coupon ? coupon.code : null;
    if (couponCode) {
      const {
        valid,
        message,
        coupon: couponData,
      } = await cartService.validateCoupon(
        couponCode,
        cart,
        userId,
        false // Don’t increment usage yet
      );
      if (!valid) {
        return res.status(400).json({ success: false, message });
      }
      validatedCoupon = couponData;
    }

    // Recalculate cart totals with validated coupon
    const updatedCart = await cartService.recalculateCartTotals(
      cart,
      validatedCoupon
    );

    // Use the total amount from recalculated cart
    const totalAmount = updatedCart.totalAmount;

    console.log(",,,,,,,,,,,,,,,,,,,,,,,,totalAmount ", totalAmount);

    const options = {
      amount: totalAmount * 100, // Convert to paise
      currency,
      receipt: `receipt_${Date.now()}`,
    };

    const razorpayOrder = await razorpay.orders.create(options);

    // Calculate totals for order storage
    const totalMRP = updatedCart.totalMRP;
    const totalDiscount = updatedCart.totalDiscount;
    const couponDiscount = updatedCart.couponDiscount || 0;
    const shippingFee = updatedCart.deliveryCharge;
    // const platformFee = updatedCart.platformFee || 3;

    // Create MongoDB order
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
      })),
      totalMRP,
      totalDiscount,
      couponDiscount,
      couponCode: couponCode || null,
      shippingFee,
      // platformFee,
      totalAmount,
      shippingAddress,
      paymentMethod: "Razorpay",
      paymentStatus: "Pending",
      transactionId: razorpayOrder.id,
      status: "Pending",
      orderDate: new Date(),
      expectedDeliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      activityLog: [{ status: "Pending", changedAt: new Date() }],
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

// Verify Razorpay Payment and Update Order

const verifyRazorpayPayment = async (req, res) => {
  console.log("#################### verifyRazorpayPayment");
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    console.log("#################### req.body", req.body);

    // Validate input
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Missing required payment details",
      });
    }

    // Verify payment signature
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      console.log("Iiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiinvalid payment signature");
      return res.status(400).json({
        success: false,
        status: "failure",
        message: "Invalid payment signature",
      });
    }

    // Find the order
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

    // Create a mock cart for coupon validation
    const mockCart = {
      items: order.items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        color: item.color,
      })),
      populate: async (options) => {
        // Mock population (already populated)
        return mockCart;
      },
    };

    // Validate coupon if applicable
    if (order.couponCode) {
      const { valid, message } = await cartService.validateCoupon(
        order.couponCode,
        mockCart,
        order.userId,
        true
      );
      if (!valid) {
        return res.status(400).json({ success: false, message });
      }
    }

    // Update order
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

    // Decrease stock
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

    // Clear cart
    await Cart.findOneAndUpdate(
      { userId: order.userId },
      {
        items: [],
        totalAmount: 0,
        totalItems: 0,
        totalMRP: 0,
        totalDiscount: 0,
        deliveryCharge: 0,
        couponDiscount: 0,
        couponId: null,
        couponCode: null,
      },
      { new: true }
    );

    await order.save();

    console.log("OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOrder", order);

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

// Place Cash on Delivery Order
const placeCODOrder = async (req, res) => {
  try {
    const { cart, address, coupon } = req.body;
    const userId = req.user.id;

    console.log(
      "#@$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$",
      req.body
    );

    // Validate required fields
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

    // Fetch the user's cart
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

    // Validate stock and prepare items
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

    // Validate coupon if provided
    let validatedCoupon = null;
    const couponCode = coupon ? coupon.code : null;
    if (couponCode) {
      const {
        valid,
        message,
        coupon: couponData,
      } = await cartService.validateCoupon(
        couponCode,
        userCart,
        userId,
        true // Increment usage for COD
      );
      if (!valid) {
        return res.status(400).json({ success: false, message });
      }
      validatedCoupon = couponData;
    }

    // Recalculate cart totals with validated coupon
    const updatedCart = await cartService.recalculateCartTotals(
      userCart,
      validatedCoupon
    );

    // Calculate totals
    const totalMRP = updatedCart.totalMRP;
    const totalDiscount = updatedCart.totalDiscount;
    const couponDiscount = updatedCart.couponDiscount || 0;
    const shippingFee = updatedCart.deliveryCharge;
    // const platformFee = updatedCart.platformFee || 3;
    const totalAmount = updatedCart.totalAmount;

    const orderDate = new Date();
    const expectedDeliveryDate = new Date(orderDate);
    expectedDeliveryDate.setDate(orderDate.getDate() + 7);

    const order = new Order({
      orderNumber: generateOrderNumber(),
      userId,
      customerName: address.fullName,
      items: orderItems,
      totalMRP,
      totalDiscount,
      couponDiscount,
      couponCode: coupon ? coupon.code : null,
      shippingFee,
      // platformFee,
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
        totalDiscount: 0,
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

// Place Wallet Order
const placeWalletOrder = async (req, res) => {
  try {
    const { cart, address, coupon } = req.body;
    const userId = req.user.id;

    // Validate required fields
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

    // Fetch the user's cart
    const userCart = await Cart.findOne({ userId });
    if (!userCart || !userCart.items.length) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      });
    }

    // Validate stock and prepare items
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

    // Validate coupon if provided
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

    // Check wallet balance
    const wallet = await Wallet.findOne({ user: userId });
    if (!wallet || wallet.balance < totalAmount) {
      return res.status(400).json({
        success: false,
        message: "Insufficient wallet balance",
      });
    }

    // Calculate totals
    const totalMRP = updatedCart.totalMRP;
    const totalDiscount = updatedCart.totalDiscount;
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
      totalDiscount,
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

    // Clear cart
    await Cart.findOneAndUpdate(
      { userId },
      {
        items: [],
        totalAmount: 0,
        totalItems: 0,
        totalMRP: 0,
        totalDiscount: 0,
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
    const orders = await Order.find({ userId: req.user.id })
      .sort({ orderDate: -1 })
      .select("orderNumber status orderDate totalAmount paymentStatus");

    res.status(200).json({
      success: true,
      message: orders.length
        ? "Orders retrieved successfully"
        : "No orders found",
      data: orders,
      count: orders.length,
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
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
        data: null,
      });
    }

    if (order.status !== "Pending" && order.status !== "Confirmed") {
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

    let refundAmount = 0; // Initialize refund amount

    // Update item statuses and calculate refund for non-cancelled items
    order.items.forEach((item) => {
      if (item.status !== "Cancelled") {
        item.status = "Cancelled";
        refundAmount += item.totalPrice; // Add price of non-cancelled items to refund
      }
    });

    order.activityLog.push({
      status: "Cancelled",
      timestamp: new Date(),
    });

    // Restore stock for non-cancelled items
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

    // Refund to wallet if payment was made and there is a refundable amount
    if (
      (order.paymentMethod === "Razorpay" || order.paymentMethod === "Wallet") &&
      order.paymentStatus === "Paid" &&
      refundAmount > 0
    ) {
      console.log(
        "$#################################################33 cancelorder"
      );
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
        refundedAmount: refundAmount, // Optional: Include refunded amount in response
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

    // Find the order
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

    // Find the item in the order
    const item = order.items.id(itemId);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found in order",
        data: null,
      });
    }

    // Check if the item can be canceled
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

    // Update item status and cancel reason
    item.status = "Cancelled";
    item.cancelProductReason = cancelProductReason;

    // Log the activity
    order.activityLog.push({
      status: `Item ${item.name} Cancelled`,
      timestamp: new Date(),
    });

    // Restore stock for the canceled item
    await Product.updateOne(
      { _id: item.productId, "colors.name": item.color },
      { $inc: { "colors.$.stock": item.quantity, totalStock: item.quantity } }
    );

    // Refund to wallet for the item if payment was made via Razorpay
    if ((order.paymentMethod === "Razorpay" || order.paymentMethod === "Wallet" ) && order.paymentStatus === "Paid") {
      const refundAmount = item.totalPrice;
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

    // Recalculate order totals
    const activeItems = order.items.filter((i) => i.status !== "Cancelled");
    
    // If all items are canceled, cancel the entire order
    if (activeItems.length === 0) {
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

    // Find the order
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

    // Find the item in the order
    const item = order.items.id(itemId);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found in order",
        data: null,
      });
    }

    // Check if the item can be returned
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

    // Update item status and return reason
    item.status = "Return-Requested";
    order.status = "Return-Requested";
    // item.returnProductReason = returnProductReason;
    item.returnRequest = {
      isRequested: true,
      requestedAt: new Date(),
      reason: reason,
    };

    // Log the activity
    order.activityLog.push({
      status: `Item ${item.name} Return-Requested`,
      timestamp: new Date(),
    });

    // Optional: Update order status if all items are returned
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
  console.log("$$$$$$444444");
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

    // Company Logo/Header Section
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

    doc.text(`Discount:`, 400, doc.y);
    doc.text(`₹${order.totalDiscount}`, 510, doc.y - 10);
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
