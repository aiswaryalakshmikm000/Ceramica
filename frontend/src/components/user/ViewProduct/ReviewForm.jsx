import React, { useState, useRef } from 'react';
import { Star, Upload, Loader2 } from 'lucide-react';
import { Button } from '../../common/Button';

const ReviewForm = () => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [images, setImages] = useState([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState([]);
  const [rememberInfo, setRememberInfo] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const fileInputRef = useRef(null);

  React.useEffect(() => {
    const savedName = localStorage.getItem('reviewName');
    const savedEmail = localStorage.getItem('reviewEmail');
    if (savedName) setName(savedName);
    if (savedEmail) setEmail(savedEmail);
  }, []);

  const handleRatingClick = (value) => {
    setRating(value);
  };

  const handleImageUpload = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length === 0) return;

    if (images.length + selectedFiles.length > 3) {
      alert('You can upload a maximum of 3 images');
      return;
    }

    const newImages = [...images, ...selectedFiles];
    setImages(newImages);

    const newImagePreviewUrls = [];
    newImages.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newImagePreviewUrls.push(reader.result);
        if (newImagePreviewUrls.length === newImages.length) {
          setImagePreviewUrls(newImagePreviewUrls);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);

    const newImagePreviewUrls = [...imagePreviewUrls];
    newImagePreviewUrls.splice(index, 1);
    setImagePreviewUrls(newImagePreviewUrls);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (rating === 0) {
      alert('Please select a rating');
      return;
    }

    if (comment.trim() === '') {
      alert('Please enter a comment');
      return;
    }

    setIsSubmitting(true);

    if (rememberInfo) {
      localStorage.setItem('reviewName', name);
      localStorage.setItem('reviewEmail', email);
    } else {
      localStorage.removeItem('reviewName');
      localStorage.removeItem('reviewEmail');
    }

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setRating(0);
      setComment('');
      setImages([]);
      setImagePreviewUrls([]);
      setIsExpanded(false);
      alert('Review submitted successfully!');
    }, 1000);
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="mt-12 animate-fade-in">
      <Button
        variant="default"
        size="lg"
        className={`w-full ${isExpanded ? 'hidden' : 'block'} bg-orange-800 text-white hover:bg-orange-700`}
        onClick={toggleExpanded}
      >
        Write a Review
      </Button>

      <div
        className={`transition-all duration-500 overflow-hidden ${
          isExpanded ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <form
          onSubmit={handleSubmit}
          className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200"
        >
          {/* Rating */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-800 mb-2">Rating</label>
            <div className="flex">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  aria-label={`Rate ${value} out of 5 stars`}
                  className="p-1 focus:outline-none"
                  onMouseEnter={() => setHoveredRating(value)}
                  onMouseLeave={() => setHoveredRating(0)}
                  onClick={() => handleRatingClick(value)}
                >
                  <Star
                    size={24}
                    fill={(hoveredRating || rating) >= value ? '#FFCC00' : 'none'}
                    color={(hoveredRating || rating) >= value ? '#FFCC00' : '#8E8E93'}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Comment */}
          <div className="mb-4">
            <label htmlFor="comment" className="block text-sm font-medium text-gray-800 mb-2">
              Your Review
            </label>
            <textarea
              id="comment"
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Share your experience with this product..."
              required
            />
          </div>

          {/* Image Upload */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-800 mb-2">
              Upload Images (optional)
            </label>
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="default"
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={images.length >= 3}
                className="flex items-center"
              >
                <Upload size={16} className="mr-2" />
                {images.length === 0 ? 'Add Photos' : 'Add More Photos'}
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                multiple
                className="hidden"
                disabled={images.length >= 3}
              />
              <span className="text-xs text-gray-500">
                {images.length}/3 images • Max 5MB each
              </span>
            </div>

            {/* Image Previews */}
            {imagePreviewUrls.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2 max-h-24 overflow-y-auto">
                {imagePreviewUrls.map((url, index) => (
                  <div key={index} className="relative w-16 h-16 sm:w-20 sm:h-20">
                    <img
                      src={url}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-full object-cover rounded-md"
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 w-5 h-5 rounded-full text-xs"
                    >
                      ✕
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Personal Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-800 mb-2">
                Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-800 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                required
              />
            </div>
          </div>

          {/* Remember Me */}
          <div className="flex items-center mb-6">
            <input
              id="remember"
              type="checkbox"
              checked={rememberInfo}
              onChange={(e) => setRememberInfo(e.target.checked)}
              className="h-4 w-4 text-blue-600 border-gray-200 rounded focus:ring-blue-600"
            />
            <label htmlFor="remember" className="ml-2 block text-sm text-gray-800">
              Save my name and email in this browser for the next time I comment
            </label>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-2">
            <Button
              variant="ghost"
              size="default"
              type="button"
              onClick={toggleExpanded}
              className="text-gray-800 hover:text-blue-600 "
            >
              Cancel
            </Button>
            <Button
              variant="default"
              size="default"
              type="submit"
              disabled={isSubmitting}
              className="bg-orange-800 text-white hover:bg-orange-700"
              aria-busy={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <Loader2 size={16} className="animate-spin mr-2" />
                  Submitting...
                </span>
              ) : (
                'Submit Review'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewForm;