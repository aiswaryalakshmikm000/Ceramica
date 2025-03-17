const User = require("../../models/userModel");
const mongoose = require("mongoose");

const getCustomerDetails = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Math.max(1, Number(req.query.limit) || 10);
    const skip = limit * (page - 1);
    const term = req.query.term;

    console.log({ page, limit, skip, term });

    const query = {};
    if (term) {
      query.$or = [
        { name: { $regex: term, $options: "i" } },
        { email: { $regex: term, $options: "i" } },
      ];
    }

    const users = await User.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit);
    const totalUsers = await User.countDocuments(query);
    console.log("Total users in DB:", totalUsers);
    // Optional: Log the fetched users
    console.log("Fetched users:", users);

    res.status(200).json({
      success: true,
      message: "Customer details fetched",
      users,
      totalPages: Math.ceil(totalUsers / limit),
    });
  } catch (error) {
    console.log("Error fetching customer details:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const editCustomerStatus = async (req, res) => {
  const { userId } = req.params;

  console.log("Received userId:", req.params.userId);

  try {

    // Check if userId is valid
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      console.log("Invalid ObjectId format");
      return res
        .status(400)
        .json({ success: false, message: "Invalid user ID" });
    }

    const user = await User.findById(userId);

    if (!user) {
      console.log(user);

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
    console.log("Customer status update failed", error.message);
    res
      .status(500)
      .json({
        success: false,
        message: "An error occurred while updating status",
      });
  }
};

module.exports = { getCustomerDetails, editCustomerStatus };
