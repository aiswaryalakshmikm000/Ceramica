const generateOTP = () => {
    // Generate a random number between 100000 and 999999 (inclusive)
    const otp = Math.floor(100000 + Math.random() * 900000);
    return otp.toString(); 
  };
  module.exports= generateOTP