// src/components/core/Header.tsx
import React from "react";
import Image from "next/image";
import type { Profile } from "@/types";
import { ThemeControl } from "./ThemeProvider"; // <-- Import ThemeControl

type HeaderProps = {
  title: string;
  onBack: () => void;
  showProfileIcon: boolean;
  showScreen: (id: string) => void;
  profile: Profile | null;

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
  showNotificationIcon = false,
  onNotificationClick,
  notificationCount = 0,
}) => (
  <header className="relative flex items-center justify-between p-4 bg-white border-b border-gray-200 shadow-md top-0 z-50">
    {/* Left Side */}
    <div className="flex items-center gap-3">
      <button
        className="text-xl font-bold text-gray-500 hover:text-gray-700 transition"
        onClick={onBack}>
        &larr;
      </button>
      <Image
        width={40}
        height={40}
        className="rounded-lg"
        src="/raw-removebg-preview.png"
        alt="JETLAY Logo"
        onClick={() => showScreen("dashboard")}
      />
      <h2 className="text-2xl font-semibold text-gray-900 m-0">{title}</h2>
    </div>

    {/* Right Side Icons */}
    <div className="flex items-center gap-4">
      {/* Theme Control */}
      <ThemeControl className="!p-0" />

      {/* Notification Icon */}
      {showNotificationIcon && (
        <button
          onClick={onNotificationClick}
          className="relative flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 shadow-md cursor-pointer hover:bg-gray-200 transition"
          aria-label="Notifications">
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
          className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 shadow-md cursor-pointer hover:bg-gray-200 transition overflow-hidden"
          aria-label="User Profile">
          {profile?.avatar_url ? (
            <Image
              src={profile.avatar_url}
              alt="User Avatar"
              width={40}
              height={40}
              className="object-cover w-full h-full"
            />
          ) : (
            <span className="text-xl">👤</span>
          )}
        </button>
      )}
    </div>
  </header>
);

export default Header;
