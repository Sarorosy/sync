import React from "react";

const ConfirmationModal = ({
  message,
  smallMessage,
  onConfirm,
  onCancel,
  after,
  isOpen,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
      style={{zIndex:"9999999999999999999999999999999999999999999999999999"}}
    >
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-center">
        <h2 className="text-lg text-red-500 font-semibold">{message}</h2>
        <p className="text-sm text-gray-600 mt-2">{smallMessage}</p>
        <div className="flex justify-between mt-4">
          <button
            onClick={() => {
              onConfirm();
              if (after) after();
            }}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
          >
            Confirm
          </button>
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
