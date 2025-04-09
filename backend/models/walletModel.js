const mongoose = require('mongoose');


const walletSchema = new mongoose.Schema ({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      orderId: {
        type:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order",
            required: true
        }
    },
    totalPrice: {
        type: Number,
        required: true
    },
    walletAmout:{
        type: Number,
    }
})






module.exports = mongoose.model('Wallet', walletSchema);