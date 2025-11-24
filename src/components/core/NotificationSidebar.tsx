// src/components/core/NotificationSidebar.tsx
"use client";

import React, { useEffect, useRef } from "react";
import {
  CheckCircle,
  AlertTriangle,
  XCircle,
  Info,
  Bell,
  X,
  Clock
} from "lucide-react";

export type NotificationStatus = "success" | "warning" | "danger" | "info";

export interface Notification {
  id: string;
  text: string;
  status: NotificationStatus;
  createdAt?: string;
}

interface NotificationSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[];
}

// Updated styles to match the App's "Premium Light" theme
const statusStyles: Record<
  NotificationStatus,
  { icon: React.ElementType; color: string; bg: string; border: string }
> = {
  success: {
    icon: CheckCircle,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-100",
  },
  warning: {
    icon: AlertTriangle,
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-100",
  },
  danger: {
    icon: XCircle,
    color: "text-rose-600",
    bg: "bg-rose-50",
    border: "border-rose-100",
  },
  info: {
    icon: Info,
    color: "text-indigo-600",
    bg: "bg-indigo-50",
    border: "border-indigo-100",
  },
};

const NotificationSidebar: React.FC<NotificationSidebarProps> = ({
  isOpen,
  onClose,
  notifications,
}) => {
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      // Prevent body scroll when sidebar is open
      document.body.style.overflow = 'hidden';
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  return (
    <>
      {/* Overlay */}
      <div
        className={`
          fixed inset-0 bg-black/30 backdrop-blur-sm
          transition-opacity duration-300 ease-out z-[90]
          ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}
        `}
      />

      {/* Sidebar - Moved to RIGHT side for standard UX */}
      <div
        ref={sidebarRef}
        className={`
          fixed inset-y-0 right-0 w-full max-w-sm
          bg-white/95 backdrop-blur-2xl
          shadow-2xl border-l border-white/50
          transition-transform duration-300 ease-out z-[100]
          ${isOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        <div className="flex flex-col h-full">
            
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-white/50">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-100 rounded-xl text-indigo-600 relative">
                    <Bell className="w-6 h-6" />
                    {notifications.length > 0 && (
                        <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
                    )}
                </div>
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Notifications</h2>
                    <p className="text-xs text-gray-500 font-medium">You have {notifications.length} updates</p>
                </div>
            </div>
            <button 
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
            >
                <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50/50">
            
            {notifications.length === 0 && (
              <div className="flex flex-col items-center justify-center h-64 text-center px-6">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-400">
                    <Bell className="w-8 h-8" />
                </div>
                <h3 className="text-gray-900 font-semibold text-lg">All caught up!</h3>
                <p className="text-sm text-gray-500 mt-1">
                  We’ll remind you about expiring passports, visas, and important travel dates here.
                </p>
              </div>
            )}

            {notifications.map((noti) => {
              const { icon: Icon, color, bg, border } = statusStyles[noti.status];

              return (
                <div
                  key={noti.id}
                  className={`
                    relative flex items-start gap-4 p-4 rounded-2xl
                    bg-white shadow-sm border ${border}
                    hover:shadow-md transition-shadow cursor-pointer
                    group
                  `}
                >
                  <div className={`p-2.5 rounded-xl shrink-0 ${bg} ${color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  
                  <div className="flex flex-col flex-1 min-w-0">
                    <span className="text-[15px] font-medium text-gray-800 leading-snug">
                      {noti.text}
                    </span>
                    {noti.createdAt && (
                      <span className="flex items-center gap-1 mt-2 text-[11px] text-gray-400 font-medium">
                        <Clock className="w-3 h-3" />
                        {new Date(noti.createdAt).toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Footer (Optional) */}
           {notifications.length > 0 && (
              <div className="p-4 bg-white border-t border-gray-100">
                  <button 
                    onClick={onClose} // Or handle "Mark all as read" logic
                    className="w-full py-3 rounded-xl bg-gray-100 text-gray-600 font-bold text-sm hover:bg-gray-200 transition-colors"
                  >
                      Close
                  </button>
              </div>
           )}

        </div>
      </div>
    </>
  );
};

export default NotificationSidebar;