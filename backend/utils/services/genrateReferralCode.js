const User = require("../../models/userModel");

const generateReferralCode = async (userId) => {
  const base = userId.toString().slice(-6);
  let code = `CERAMIC${base}`;
  let isUnique = false;
  let attempt = 0;

  while (!isUnique && attempt < 5) {
    const existingUser = await User.findOne({ referralCode: code });
    if (!existingUser) {
      isUnique = true;
    } else {
      attempt++;
      code = `CERAMIC${base}${Math.floor(Math.random() * 1000)}`;
    }
  }

  if (!isUnique) {
    throw new Error("Unable to generate unique referral code");
  }

  return code;
};

module.exports = generateReferralCode;