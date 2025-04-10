const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: [true, 'Product ID is required']
        },
        color: {
          type: String,
          required: [true, 'Color variant is required'],
          lowercase: true
        },
        addedAt: {
          type: Date,
          default: Date.now
        },
        image: {  
          type: String,
      },
        inStock: {
          type: Boolean,
          default: true
        }
      }
    ]
  },
  {
    timestamps: true
  }
);

// Pre-save middleware to validate items
wishlistSchema.pre('save', async function(next) {
  const Product = mongoose.model('Product');
  for (const item of this.items) {
    const product = await Product.findById(item.productId);
    if (!product || !product.isListed) {
      throw new Error(`Product ${item.productId} is not available`);
    }
    const colorData = product.colors.find(c => c.name.toLowerCase() === item.color.toLowerCase());
    if (!colorData || colorData.stock <= 0) {
      item.inStock = false;
    }
  }
  next();
});

const Wishlist = mongoose.model('Wishlist', wishlistSchema);
module.exports = Wishlist;