// src/components/core/Header.tsx
import React from 'react';
import Image from 'next/image';
import { ChevronLeft } from 'lucide-react'; // Added icon for better look
import type { Profile } from '@/types';

type HeaderProps = {
  title: string;
  onBack: () => void;
  showProfileIcon: boolean;
  showScreen: (id: string) => void;
  profile: Profile | null;
  
  // --- ADDED THESE OPTIONAL PROPS ---
  showNotificationIcon?: boolean;
  onNotificationClick?: () => void;
  notificationCount?: number;
};

const Header: React.FC<HeaderProps> = ({ 
  title, 
  onBack, 
  showProfileIcon, 
  showScreen, 
  profile,
  // --- Set default values ---
  showNotificationIcon = false,
  onNotificationClick,
  notificationCount = 0
}) => (
  <header className="relative flex items-center justify-between p-4 bg-white border-b border-gray-200 shadow-md sticky top-0 z-50">
    
    {/* Left Side */}
    <div className="flex items-center gap-2">
      {/* --- EXPANDED BACK BUTTON --- */}
      <button
        className="group flex items-center justify-center w-11 h-11 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-all active:scale-95"
        onClick={onBack}
        aria-label="Go Back"
      >
        <ChevronLeft className="w-8 h-8 relative right-[1px]" />
      </button>

      <div className="flex items-center gap-3 ml-1">
        <Image
          width={40}
          height={40}
          className="rounded-lg"
          src="/raw-removebg-preview.png"
          alt="JETLAY Logo"
        />
        <h2 className="text-2xl font-semibold text-gray-900 m-0">{title}</h2>
      </div>
    </div>

    {/* Right Side Icons */}
    <div className="flex items-center gap-3">
      
      {/* Notification Icon */}
      {showNotificationIcon && (
        <button
          onClick={onNotificationClick}
          className="relative flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 shadow-md cursor-pointer hover:bg-gray-200 transition active:scale-95"
          aria-label="Notifications"
        >
          <span className="text-xl">🔔</span> 
          {notificationCount > 0 && (
            <span className="absolute top-1 right-1 block h-3 w-3 rounded-full bg-red-500 border-2 border-white" />
          )}
        </button>
      )}
  
      {/* Profile Icon */}
      {showProfileIcon && (
        <button
          onClick={() => showScreen("user")}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 shadow-md cursor-pointer hover:bg-gray-200 transition overflow-hidden active:scale-95"
          aria-label="User Profile"
        >
          {profile?.avatar_url ? (
              <Image src={profile.avatar_url} alt="User Avatar" width={40} height={40} className="object-cover w-full h-full" />
          ) : (
              <span className="text-xl">👤</span>
          )}
        </button>
      )}
    </div>
  </header>
);

export default Header;