const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      index: true,
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: [0, "Price cannot be negative"],
    },
    discount: {
      type: Number,
      default: 0,
      min: [0, "Discount cannot be negative"],
      max: [90, "Discount cannot exceed 90%"],
    },
    offerId: { type: mongoose.Schema.Types.ObjectId, ref: "Offer", default: null },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
      index: true,
    },
    tags: [{ type: String }],
    colors: [
      {
        name: { type: String, required: true },
        stock: {
          type: Number,
          required: true,
          min: [0, "Stock cannot be negative"],
        },
        images: [{ type: String, required: true }], 
      },
    ],
    sku: {
      type: String,
      unique: true,
      default: function () {
        return `SKU-${Date.now()}`;
      },
    },
    totalStock: {
      type: Number,
      default: 0,
    },
    discountedPrice: {
      type: Number,
      default: 0,
      index: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
      index: true,
    },
    isListed: {
      type: Boolean,
      default: true,
      index: true,
    },
    reviews: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        name: { type: String },
        rating: { type: Number, min: 1, max: 5 },
        comment: { type: String },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

productSchema.pre("save", function (next) {
  this.price = Number(this.price.toFixed(2));
  this.totalStock = this.colors.reduce((sum, color) => sum + color.stock, 0);
  this.discountedPrice = Number((this.price * (1 - this.discount / 100)).toFixed(2));
  next();
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;