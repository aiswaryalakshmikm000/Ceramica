const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: [true, 'Product ID is required']
    },
    name: {
        type: String,
    },
    color: {
        type: String,
        required: [true, 'Color selection is required']
    },
    originalPrice: {  // Added originalPrice
        type: Number,
        required: [true, 'Original price is required'],
        min: [0, 'Price cannot be negative']
    },
    quantity: {
        type: Number,
        required: [true, 'Quantity is required'],
        min: [1, 'Quantity must be at least 1']
    },
    latestPrice: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price cannot be negative']
    },
    image: {  // Added image field
        type: String,
    },
    discount: {
        type: Number,
        required: [true, 'Discount is required'],
        min: [0, 'Discount cannot be negative'],
        max: [100, 'Discount cannot exceed 100%']
    },
    maxQtyPerUser: {
        type: Number,
        default: 5,
        min: [1, 'Maximum quantity per user must be at least 1']
    },
    inStock: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

const CartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User ID is required'],
        unique: true // One cart per user
    },
    items: [cartItemSchema],
    platformFee: {
        type: Number,
        default: 3,
        min: [0, 'Platform fee cannot be negative']
    },
    totalAmount: {
        type: Number,
        default: 0,
        min: [0, 'Total amount cannot be negative']
    }
}, {
    timestamps: true
});


const Cart = mongoose.model("Cart", CartSchema);
module.exports = Cart;
