// src/components/core/CustomAlert.tsx
import React from "react";

type CustomAlertProps = {
  message: string;
  onClose: () => void;
};

const CustomAlert: React.FC<CustomAlertProps> = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="fixed inset-0 bg-transparent z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white p-6 rounded-xl shadow-2xl max-w-sm w-full text-center">
        <p className="mb-4 text-lg font-semibold text-gray-900">{message}</p>
        <button
          onClick={onClose}
          className="px-6 py-2 bg-purple-700 text-white font-semibold rounded-lg hover:bg-purple-800 transition duration-150 shadow-md">
          OK
        </button>
      </div>
    </div>
  );
};

export default CustomAlert;
