const User = require("../../models/userModel");
const Coupon = require("../../models/couponModel");
const Order = require("../../models/OrderModel");

const getReferralInfo = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId).select(
      "referralCode referredBy totalReferrals referralRewards isReferralRewarded"
    );

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const referredUsers = await User.find({
      referredBy: user.referralCode,
    }).select("name createdAt referralRewards isReferralRewarded referralCode");

    const referrerCoupons = await Coupon.find({
      code: { $regex: `REF${user._id.toString().slice(-6)}`, $options: 'i' },
    });

    // Build referral history
    const referralHistory = await Promise.all(
      referredUsers.map(async (referredUser, index) => {
        const coupon = referrerCoupons[index] || null;

        // Check if the referred user has any delivered orders
        const hasDeliveredOrder = await Order.exists({
          userId: referredUser._id,
          status: "Delivered",
        });

        return {
          id: referredUser._id,
          name: referredUser.name,
          date: referredUser.createdAt,
          status: hasDeliveredOrder ? "completed" : "pending",
          reward: coupon ? coupon.discountValue : 0,
          couponCode: coupon ? coupon.code : null,
        };
      })
    );

    // Calculate completed and pending referrals
    const completedReferrals = referralHistory.filter(
      (referral) => referral.status === "completed"
    ).length;
    const totalReferrals = referredUsers.length;
    const pendingReferrals = totalReferrals - completedReferrals;

    const userCoupons = await Coupon.find({
      code: { $regex: `NEWUSER|REF${user._id.toString().slice(-6)}` },
      status: "active",
    });

    const referralInfo = {
      referralCode: user.referralCode,
      referredBy: user.referredBy || null,
      totalReferrals: totalReferrals || 0,
      completedReferrals: completedReferrals || 0,
      pendingReferrals: pendingReferrals || 0,
      totalEarnings: user.referralRewards || 0,
      coupons: userCoupons || [],
      referralHistory: referralHistory || [],
    };

    res.json({
      success: true,
      data: referralInfo,
    });
  } catch (error) {
    console.error("Error in getReferralInfo:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};



const applyReferralCode = async (req, res) => {
  const { userId, referralCode } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (user.referredBy) {
      return res.status(400).json({
        success: false,
        message: "You have already used a referral code",
      });
    }
    

    const referrer = await User.findOne({referralCode})
    if (!referrer) {
      return res.status(400).json({
        success: false,
        message: "Invalid referral code",
      });
    }

    if (referrer._id.toString() === userId) {
      return res.status(400).json({
        success: false,
        message: "You cannot use your own referral code",
      });
    }

    // Create coupon for the new user (₹50 flat)
    const newUserCoupon = await Coupon.create({
      code: `NEWUSER${user._id.toString().slice(-6)}`,
      description: `Referral bonus for new user. referred by ${referrer.name}`,
      discountType: "flat",
      discountValue: 50,
      minPurchaseAmount: 0,
      validFrom: new Date(),
      expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), 
      usageLimit: 1,
      maxUsagePerUser: 1,
      customerType: "new",
      userId: user._id,
    });

    // Create coupon for the referrer (₹100 flat)
    const referrerCoupon = await Coupon.create({
      code: `REF${referrer._id.toString().slice(-6)}`,
      description: `Referral bonus for referring a user ${user.name}.`,
      discountType: "flat",
      discountValue: 100,
      minPurchaseAmount: 0,
      validFrom: new Date(),
      expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      usageLimit: 1,
      maxUsagePerUser: 1,
      customerType: "all",
      userId: referrer._id,
    });

    // Update user and referrer records
    user.referredBy = referralCode;
    user.referralRewards += 50
    await user.save();

    referrer.totalReferrals += 1;
    referrer.referralRewards += 100;
    referrer.isReferralRewarded = true;

    await referrer.save();

    res.json({
      success: true,
      message: "Referral code applied successfully. Coupons have been generated.",
      newUserCoupon,
      referrerCoupon,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

module.exports = { 
  getReferralInfo,
  applyReferralCode,
 };