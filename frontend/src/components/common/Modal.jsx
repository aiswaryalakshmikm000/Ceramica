import React from "react";

const Modal = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 transition-opacity duration-300">
      <div 
        className="bg-white rounded-xl p-6 w-full max-w-md mx-4 shadow-2xl transform transition-all duration-300 scale-100 hover:scale-[1.02]"
      >
        {/* Title */}
        <h2 className="text-2xl font-semibold text-ceramic-charcoal mb-4 tracking-tight">
          {title}
        </h2>

        {/* Message */}
        <p className="text-ceramic-charcoal mb-6 text-base leading-relaxed font-normal">
          {message}
        </p>

        {/* Buttons */}
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-5 py-2 text-ceramic-charcoal hover:text-ceramic-earth font-medium rounded-md transition-all duration-200 hover:bg-gray-100 active:scale-95"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-5 py-2 bg-ceramic-earth text-black font-medium rounded-md hover:bg-opacity-90 transition-all duration-200 active:scale-95 shadow-md hover:shadow-lg"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;