const cloudinary = require("../../config/cloudinary");

const cloudinaryDeleteImages = async (imageUrls) => {
    const getPublicIdFromUrl = (url) => {
      const parts = url.split('/');
      const fileWithExtension = parts.pop(); 
      const folderPath = parts.slice(-1)[0] === 'products' ? '' : 'products/'; 
      const [publicId] = fileWithExtension.split('.'); 
      return `${folderPath}${publicId}`;
    };
  
    const deletePromises = imageUrls.map((url) => {
      const publicId = getPublicIdFromUrl(url);
      return new Promise((resolve, reject) => {
        cloudinary.uploader.destroy(publicId, (error, result) => {
          if (error) {
            console.error(`Failed to delete image with public_id ${publicId}:`, error);
            reject(error);
          } else {
            console.log(`Deleted image with public_id ${publicId}:`, result);
            resolve(result);
          }
        });
      });
    });
  
    return Promise.all(deletePromises);
  };
  
module.exports = {cloudinaryDeleteImages}