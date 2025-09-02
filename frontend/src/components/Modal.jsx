import React from "react";

const Modal = ({ content, onClose }) => {
  if (!content) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 sm:p-8 rounded-2xl max-w-3xl w-11/12 max-h-[90vh] overflow-y-auto relative shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          className="absolute top-3 right-4 text-3xl font-bold text-gray-600 hover:text-gray-800 transition"
          onClick={onClose}
        >
          &times;
        </button>

        {/* Modal Content */}
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">
          {content.title}
        </h2>
        <p className="text-gray-700 leading-relaxed">
          {content.story || content.content}
        </p>
      </div>
    </div>
  );
};

export default Modal;
