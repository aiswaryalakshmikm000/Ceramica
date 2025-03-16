import React, { useState, useCallback } from "react";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

const ImageCropper = ({ onCropComplete, initialImage }) => {
  const [upImg, setUpImg] = useState(initialImage || null);
  const [crop, setCrop] = useState({ unit: "%", width: 50, height: 50, x: 25, y: 25 });
  const [completedCrop, setCompletedCrop] = useState(null);
  const [imageRef, setImageRef] = useState(null);

  const onSelectFile = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener("load", () => setUpImg(reader.result));
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const onLoadImage = useCallback((img) => {
    setImageRef(img);
  }, []);

  const getCroppedImg = async (image, crop) => {
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width * scaleX;
    canvas.height = crop.height * scaleY;
    const ctx = canvas.getContext("2d");

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width * scaleX,
      crop.height * scaleY
    );

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        const file = new File([blob], "cropped-image.jpg", { type: "image/jpeg" });
        resolve(file);
      }, "image/jpeg");
    });
  };

  const handleCropComplete = async () => {
    if (imageRef && completedCrop?.width && completedCrop?.height) {
      const croppedImage = await getCroppedImg(imageRef, completedCrop);
      onCropComplete(croppedImage);
      setUpImg(null); // Reset after cropping
    }
  };

  return (
    <div className="space-y-4">
      {!upImg ? (
        <input
          type="file"
          accept="image/*"
          onChange={onSelectFile}
          className="block w-full p-2 border border-gray-300 rounded-md shadow-sm"
        />
      ) : (
        <>
          <ReactCrop
            crop={crop}
            onChange={(_, percentCrop) => setCrop(percentCrop)}
            onComplete={(c) => setCompletedCrop(c)}
            aspect={1} // Optional: enforce a square aspect ratio, adjust as needed
          >
            <img src={upImg} onLoad={(e) => onLoadImage(e.target)} alt="Crop preview" />
          </ReactCrop>
          <button
            type="button"
            onClick={handleCropComplete}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Crop Image
          </button>
        </>
      )}
    </div>
  );
};

export default ImageCropper;