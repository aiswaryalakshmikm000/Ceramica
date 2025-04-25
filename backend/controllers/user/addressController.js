const Address = require("../../models/addressModel");
const addressSchema = require("../../utils/validation/addressValidation");
const User = require("../../models/userModel");

const addAddress = async (req, res) => {
  const { user } = req.body;
  try {
    const userExist = await User.findById(user);
    if (!userExist) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    const { error } = addressSchema.validate(req.body);
    if (error) {
      const errorMessages = error.details.map((err) => err.message);

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

    return res
      .status(200)
      .json({ success: true, message: "Address added", address });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Address not added", error });
  }
};

const showAddresses = async (req, res) => {
  const { userId } = req.params;
  try {
    const addresses = await Address.find({ user: userId ,isListed:true}).select("-createdAt -updatedAt -__v")

    if (!addresses) {
      return res
        .status(404)
        .json({ success: false, message: "Addresses not found" });
    }

    res
      .status(200)
      .json({
        success: true,
        message: "Addresses for user fetched",
        addresses,
      });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Internal server error", error });
  }
};

const editAddress = async (req, res) => {
  const { userId, addressId } = req.params; 
  try {
    const { error } = addressSchema.validate(req.body);
    if (error) {
      const errorMessages = error.details.map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: "Validation error",
        details: errorMessages,
      });
    }

    const data = req.body;

    const existingAddress = await Address.findOne({ _id: addressId, user: userId });
    if (!existingAddress) {
      return res.status(404).json({
        success: false,
        message: "Address not found or does not belong to this user",
      });
    }
    if (data.isDefault === true) {
      await Address.updateMany(
        { user: userId, _id: { $ne: addressId } }, 
        { isDefault: false }
      );
    }
    
    const updatedAddress = await Address.findByIdAndUpdate(
      addressId,
      { ...data, user: userId }, 
      { new: true }
    ).select("-createdAt -updatedAt -__v");

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
    res.status(500).json({success:false ,message:"Internal server error",error})
  }
}

const setDefaultAddress = async (req, res) => {
  const { addressId } = req.params;
  try {
    await Address.updateMany(
      { user: req.user._id }, 
      { isDefault: false }
    );
    
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
    res.status(500).json({ success: false, message: "Internal server error", error });
  }
};


module.exports = { addAddress, showAddresses, editAddress ,deleteAddress, setDefaultAddress};