import React, { useEffect, useRef } from 'react';

// --- NEW: Import icons for status ---
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  XCircleIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/solid';

type NotificationSidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

// --- NEW: Updated data structure with 'status' ---
type NotificationStatus = 'success' | 'warning' | 'danger' | 'info';

type Notification = {
  id: number;
  text: string;
  status: NotificationStatus;
};

// Mock data 
const notifications: Notification[] = [
  { id: 1, text: 'Your passport will expired in 6 months', status: 'danger' },
  { id: 2, text: 'America flight in 83 hours', status: 'info' },
  { id: 3, text: 'France visa expired in 9 months', status: 'warning' },
  { id: 4, text: 'New document upload required', status: 'warning' },
  { id: 5, text: 'Japan visa approved', status: 'success' },
];

// --- NEW: Helper map to link status to icons and colors ---
const statusStyles: Record<NotificationStatus, { icon: React.ElementType; color: string }> = {
  success: { icon: CheckCircleIcon, color: 'text-green-400' },
  warning: { icon: ExclamationCircleIcon, color: 'text-yellow-400' },
  danger: { icon: XCircleIcon, color: 'text-red-400' },
  info: { icon: InformationCircleIcon, color: 'text-blue-400' },
};

const NotificationSidebar: React.FC<NotificationSidebarProps> = ({ isOpen, onClose }) => {
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Close sidebar when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  return (
    <>
      {/* --- Main Sidebar (Using a darker gray for more contrast) --- */}
      <div
        ref={sidebarRef}
        className={`
          fixed top-0 left-0 h-full w-80 bg-gray-900 text-white shadow-lg
          transition-transform duration-300 ease-in-out z-40
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* --- NEW: Updated padding and layout --- */}
        {/* pt-20 to clear your sticky header (which is z-50) */}
        <div className="p-6 pt-20 flex flex-col h-full">
          <h2 className="text-2xl font-bold mb-6 text-white">Notifications</h2>
          
          {/* --- NEW: Scrollable list with new styling --- */}
          {/* flex-1 makes this div take up remaining height, overflow-y-auto makes it scroll */}
          <div className="flex flex-col gap-3 overflow-y-auto flex-1 pr-2">
            {notifications.map((noti) => {
              // Get the correct icon and color from our helper map
              const { icon: Icon, color } = statusStyles[noti.status];

              return (
                <div
                  key={noti.id}
                  className="
                    flex items-start gap-3 p-3 rounded-lg 
                    hover:bg-gray-700 transition-colors duration-150 cursor-pointer
                  "
                >
                  {/* Status Icon */}
                  <Icon className={`h-6 w-6 ${color} flex-shrink-0 mt-0.5`} />

                  {/* Notification Text */}
                  <span className="text-base text-gray-100">{noti.text}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* --- Overlay --- */}
      {/* This dark overlay covers the main content when the sidebar is open */}
      <div
        onClick={onClose}
        className={`
          fixed inset-0 bg-black transition-opacity duration-300 ease-in-out z-30
          ${isOpen ? 'opacity-50' : 'opacity-0 pointer-events-none'}
        `}
      />
    </>
  );
};

export default NotificationSidebar;