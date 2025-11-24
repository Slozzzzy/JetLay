// src/components/core/NotificationSidebar.tsx
"use client";

import React, { useEffect, useRef } from "react";
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  XCircleIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/solid";

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

const statusStyles: Record<
  NotificationStatus,
  { icon: React.ElementType; color: string; border: string }
> = {
  success: {
    icon: CheckCircleIcon,
    color: "text-emerald-400",
    border: "border-emerald-400",
  },
  warning: {
    icon: ExclamationCircleIcon,
    color: "text-amber-300",
    border: "border-amber-300",
  },
  danger: {
    icon: XCircleIcon,
    color: "text-rose-400",
    border: "border-rose-400",
  },
  info: {
    icon: InformationCircleIcon,
    color: "text-sky-300",
    border: "border-sky-300",
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
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  return (
    <>
      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`
          fixed top-0 left-0 h-full w-80
          bg-gradient-to-b from-[#0b132b] via-[#131b3b] to-[#1c2541]
          text-white shadow-2xl border-r border-white/10
          backdrop-blur-xl
          transition-transform duration-300 ease-out z-40
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* pt-20 so it clears your sticky header */}
        <div className="p-6 pt-20 flex flex-col h-full">
          <h2 className="text-2xl font-semibold mb-4">Notifications</h2>
          <p className="text-xs text-slate-300 mb-4">
            We’ll remind you about expiring passports, visas and important travel dates.
          </p>

          <div className="flex flex-col gap-3 overflow-y-auto flex-1 pr-1">
            {notifications.length === 0 && (
              <div className="mt-4 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200">
                ✨ You’re all set! No important notifications right now.
              </div>
            )}

            {notifications.map((noti) => {
              const { icon: Icon, color, border } = statusStyles[noti.status];

              return (
                <div
                  key={noti.id}
                  className={`
                    flex items-start gap-3 p-3 rounded-xl
                    bg-white/5 hover:bg-white/10
                    transition duration-150 cursor-pointer
                    border-l-4 ${border}
                  `}
                >
                  <Icon className={`h-5 w-5 ${color} mt-0.5`} />
                  <div className="flex flex-col">
                    <span className="text-[15px] text-slate-50 leading-snug">
                      {noti.text}
                    </span>
                    {noti.createdAt && (
                      <span className="mt-1 text-[11px] text-slate-300">
                        {new Date(noti.createdAt).toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Overlay */}
      <div
        onClick={onClose}
        className={`
          fixed inset-0 bg-black/60 backdrop-blur-sm
          transition-opacity duration-300 ease-out z-30
          ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}
        `}
      />
    </>
  );
};

export default NotificationSidebar;
