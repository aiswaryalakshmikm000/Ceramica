const mailSender = require('./mailsender')

const sendVerificationEmail=async(email,otp)=>{
    console.log("Sending verification email to", email);
    try {
       const mailResponse = await mailSender(
        email,
        "CERAMICA- Verify Your Email",
        `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h2 style="color: #0a74da;">Welcome to CERAMICA!</h2>
          <p>Dear user,</p>
          <p>Thank you for registering with <strong>CERAMICA</strong>. To complete your sign-up process, please verify your email address by using the OTP code provided below:</p>
          <div style="text-align: center; margin: 20px 0;">
            <span style="font-size: 24px; font-weight: bold; background-color: #f2f2f2; padding: 10px; border-radius: 5px;">${otp}</span>
          </div>
          <p>If you did not request this, please ignore this email or contact our support team.</p>
          <p>Best regards,<br/> Team CERAMICA</p>
        </div>`
        
       ) 
       console.log("varification email sent for registering");
       
    } catch (error) {
        console.log("error in verification mail response",error);
        throw error;
    }
}

module.exports = sendVerificationEmail