const { cloudinaryImageUploadMethod } = require("../../utils/cloudinary/cloudinaryUpload");
const {cloudinaryDeleteImages} = require("../../utils/cloudinary/deleteImages");

//models
const User = require('../../models/userModel')

const showProfile = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById({ _id: id }).select("-password");
    if(!user){
      return res.status(400).json({message:"user not found"})
    }
    res
      .status(200)
      .json({ success: true, message: "user details fetched", user });
  } catch (error) {
    res.status(500).json({ success: false, message: "User data not fetched" });
  }
};


const editProfile=async(req,res)=>{
  const {id}=req.params
  const {name, email, phone}=req.body
  const file = req.file;

  try {
   const user= await User.findById({_id:id})
   if(!user){
    return res.status(404).json({success:false, message:"user not found"})
   }

   if(user.isBlocked){
    return res.status(403).json({success:false,message:"User is blocked"})
   }

   const existingUser =await User.findOne({email: {$regex : new RegExp(`^${email}$`,'i')},_id:{$ne:id}})
   if(existingUser){
    return res.status(409).json({success:false, message: 'User already exist with the same email'})
   }
   
   let imageUrl = user.images;
   if (file) {
     if (user.images) {
       await cloudinaryDeleteImages([user.images]);
     }
     imageUrl = await cloudinaryImageUploadMethod(file.buffer);
   }

  
   const updatedUser = await User.findByIdAndUpdate(
    id, {
      name,
      email,
      phone,
      images: imageUrl
   }).select('-password')


   res.status(200).json({success:true, updatedUser, message:"User profile updated successfully."})
  } catch (error) {
    res.status(500).json({message:"Internal servere error",error})
  }
}

module.exports= {
    showProfile,
    editProfile,
}