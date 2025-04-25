const User = require("../../models/userModel");
const mongoose = require("mongoose");

const getCustomerDetails = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Math.max(1, Number(req.query.limit) || 10);
    const skip = limit * (page - 1);
    const term = req.query.term;

    const query = {};
    if (term) {
      query.$or = [
        { name: { $regex: term, $options: "i" } },
        { email: { $regex: term, $options: "i" } },
      ];
    }

    const users = await User.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit);
    const totalUsers = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      message: "Customer details fetched",
      users,
      totalPages: Math.ceil(totalUsers / limit),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const editCustomerStatus = async (req, res) => {
  const { userId } = req.params;


  try {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid user ID" });
    }

    const user = await User.findById(userId);

    if (!user) {

      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    user.isBlocked = !user.isBlocked;

    await user.save();
    res
      .status(200)
      .json({ success: true, message: "Customer status updated", user });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "An error occurred while updating status",
      });
  }
};

module.exports = { getCustomerDetails, editCustomerStatus };
