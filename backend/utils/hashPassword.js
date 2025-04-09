const bcrypt =require('bcrypt')
const hashPassword = async (password) => {
    try {
      const securePassword = await bcrypt.hash(password, 10);
  
      return securePassword;
    } catch (error) {
    }
  };

  module.exports=hashPassword