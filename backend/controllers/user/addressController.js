const Address = require("../../models/addressModel");
const addressSchema = require("../../utils/validation/addressValidation");
const User = require("../../models/userModel");

const addAddress = async (req, res) => {
  const { user } = req.body;
  console.log("add address###########################33",req.body)
  try {
    const userExist = await User.findById(user);
    if (!userExist) {
      console.log("no existing user found")
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    const { error } = addressSchema.validate(req.body);
    if (error) {
      const errorMessages = error.details.map((err) => err.message);
      console.log("error in validation", errorMessages);

      return res
        .status(400)
        .json({ message: "Validation error", details: errorMessages });
    }

    const newAddress = await Address.create(req.body);
    const address = {
      _id:newAddress._id,
      user:newAddress.user,
      fullname: newAddress.fullname,
      phone: newAddress.phone,
      email: newAddress.email,
      addressLine: newAddress.addressLine,
      city: newAddress.city,
      state: newAddress.state,
      landmark: newAddress.landmark,
      pincode: newAddress.pincode,
      addressType: newAddress.addressType,
      isDefault: newAddress.isDefault,
    };

    console.log("new user", address)

    return res
      .status(200)
      .json({ success: true, message: "Address added", address });
  } catch (error) {
    console.log("Address not added", error);
    res
      .status(500)
      .json({ success: false, message: "Address not added", error });
  }
};

const showAddresses = async (req, res) => {
  const { userId } = req.params;
  console.log("userId to show address",userId)
  try {
    const addresses = await Address.find({ user: userId ,isListed:true}).select("-createdAt -updatedAt -__v")

    if (!addresses) {
      return res
        .status(404)
        .json({ success: false, message: "Addresses not found" });
    }

    console.log("address fetched successfully")
    res
      .status(200)
      .json({
        success: true,
        message: "Addresses for user fetched",
        addresses,
      });
  } catch (error) {
    console.log("fetching addresses failed");
    res
      .status(500)
      .json({ success: false, message: "Internal server error", error });
  }
};

const editAddress = async (req, res) => {
  const { userId, addressId } = req.params; // Extract userId and addressId from URL
  console.log("Incoming request URL:", req.originalUrl); // Debug the full URL
  console.log("Editing address for user:", userId, "addressId:", addressId);
  try {
    // Validate the incoming data
    const { error } = addressSchema.validate(req.body);
    if (error) {
      const errorMessages = error.details.map((err) => err.message);
      console.log("Validation errors:", errorMessages);
      return res.status(400).json({
        success: false,
        message: "Validation error",
        details: errorMessages,
      });
    }

    const data = req.body;

    // Ensure the address belongs to the user (optional security check)
    const existingAddress = await Address.findOne({ _id: addressId, user: userId });
    if (!existingAddress) {
      return res.status(404).json({
        success: false,
        message: "Address not found or does not belong to this user",
      });
    }
    // If the updated address is set as default, reset all other addresses
    if (data.isDefault === true) {
      await Address.updateMany(
        { user: userId, _id: { $ne: addressId } }, // Exclude the current address
        { isDefault: false }
      );
    }
    

    // Update the address
    const updatedAddress = await Address.findByIdAndUpdate(
      addressId,
      { ...data, user: userId }, // Ensure user field is preserved
      { new: true }
    ).select("-createdAt -updatedAt -__v");

    console.log("Address updated:", updatedAddress);

    res.status(200).json({
      success: true,
      message: "Address updated",
      updatedAddress,
    });
  } catch (error) {
    console.error("Error editing address:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const deleteAddress =async(req,res)=>{
  const {userId, addressId}=req.params
  try {
    const address=await Address.findOneAndUpdate({_id:addressId , user:userId},{isListed:false}).select("-createdAt -updatedAt -__v")
    

    if(!address){
      return res.status(404).json({success:false ,message:"Address not found"})
    }
    res.status(200).json({success:true, message:"Address deleted successfully"})
  } catch (error) {
    console.log("Error deleteing address",error);
    res.status(500).json({success:false ,message:"Internal server error",error})
  }
}

const setDefaultAddress = async (req, res) => {
  const { addressId } = req.params;
  console.log("Setting default address for user:", req.user._id, "addressId:", addressId);
  try {
    // Set all addresses for the user to non-default
    await Address.updateMany(
      { user: req.user._id }, 
      { isDefault: false }
    );
    
    // Set the specified address as default
    const updatedAddress = await Address.findByIdAndUpdate(
      addressId,
      { isDefault: true },
      { new: true }
    ).select("-createdAt -updatedAt -__v");

    if (!updatedAddress) {
      return res.status(404).json({ success: false, message: "Address not found" });
    }

    res.status(200).json({ success: true, message: "Default address updated", updatedAddress });
  } catch (error) {
    console.log("Error setting default address", error);
    res.status(500).json({ success: false, message: "Internal server error", error });
  }
};


module.exports = { addAddress, showAddresses, editAddress ,deleteAddress, setDefaultAddress};