// src/components/core/CustomAlert.tsx
import React, { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';

type CustomAlertProps = {
  message: string;
  type?: 'success' | 'error' | 'info'; // Added optional type for better context
  onClose: () => void;
};

const CustomAlert: React.FC<CustomAlertProps> = ({ message, type = 'info', onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  // Animation trigger
  useEffect(() => {
    if (message) {
      setIsVisible(true);
    }
  }, [message]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 200); // Wait for animation to finish
  };

  if (!message) return null;

  // Configuration based on Alert Type
  const config = {
    success: {
      icon: <CheckCircle className="w-8 h-8 text-emerald-600" />,
      bgIcon: "bg-emerald-100",
      title: "Success",
      btnGradient: "from-emerald-500 to-green-600",
      shadow: "shadow-emerald-500/30"
    },
    error: {
      icon: <AlertCircle className="w-8 h-8 text-red-600" />,
      bgIcon: "bg-red-100",
      title: "Error",
      btnGradient: "from-red-500 to-rose-600",
      shadow: "shadow-red-500/30"
    },
    info: {
      icon: <Info className="w-8 h-8 text-indigo-600" />,
      bgIcon: "bg-indigo-100",
      title: "Information",
      btnGradient: "from-indigo-600 via-purple-600 to-pink-600",
      shadow: "shadow-indigo-500/30"
    }
  };

  const currentConfig = config[type] || config.info;

  return (
    <div 
      className={`
        fixed inset-0 z-[100] flex items-center justify-center p-4 
        bg-black/40 backdrop-blur-md transition-opacity duration-300
        ${isVisible ? 'opacity-100' : 'opacity-0'}
      `}
    >
      <div 
        className={`
          relative bg-white/90 backdrop-blur-xl rounded-[32px] p-8 
          shadow-2xl max-w-sm w-full text-center ring-1 ring-white/60
          transform transition-all duration-300
          ${isVisible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}
        `}
      >
        {/* Close Icon (Top Right) */}
        <button 
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Icon Blob */}
        <div className={`mx-auto mb-5 w-20 h-20 rounded-full flex items-center justify-center ${currentConfig.bgIcon} mb-4`}>
          {currentConfig.icon}
        </div>

        {/* Title & Message */}
        <h3 className="text-xl font-extrabold text-gray-800 mb-2">
          {currentConfig.title}
        </h3>
        <p className="text-gray-600 font-medium leading-relaxed mb-8">
          {message}
        </p>

        {/* Action Button */}
        <button
          onClick={handleClose}
          className={`
            w-full py-3.5 rounded-[20px] 
            bg-gradient-to-r ${currentConfig.btnGradient}
            text-white font-bold text-lg tracking-wide
            shadow-lg ${currentConfig.shadow}
            transform transition-all duration-200 
            hover:shadow-xl hover:-translate-y-1 active:scale-[0.98]
          `}
        >
          OK
        </button>
      </div>
    </div>
  );
};

export default CustomAlert;