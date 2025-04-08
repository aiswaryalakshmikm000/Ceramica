const mongoose = require('mongoose')
const sendVerificationEmail = require('../utils/nodemailer/sendVarificationEmail')

const otpSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    otp:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now,
        expires:60*1 //document automatically delete after 1 minute
    }
})

otpSchema.pre("save",async function (next) {
    console.log("New OTP document saved to database");
    
})
module.exports = mongoose.model('OTP',otpSchema)