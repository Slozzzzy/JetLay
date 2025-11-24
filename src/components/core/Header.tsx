// src/components/core/Header.tsx
import React from "react";
import Image from "next/image";
import type { Profile } from "@/types";
import { BellIcon } from "@heroicons/react/24/solid";

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
  <header className="relative flex items-center justify-between p-4 bg-white border-b border-gray-200 shadow-md sticky top-0 z-50">
    {/* Left */}
    <div className="flex items-center gap-3">
      <button
        className="text-xl font-bold text-gray-500 hover:text-gray-700 transition"
        onClick={onBack}
      >
        &larr;
      </button>
      <Image
        width={40}
        height={40}
        className="rounded-lg"
        src="/raw-removebg-preview.png"
        alt="JETLAY Logo"
      />
      <h2 className="text-2xl font-semibold text-gray-900 m-0">{title}</h2>
    </div>

    {/* Right */}
    <div className="flex items-center gap-4">
      {showNotificationIcon && (
        <button
          onClick={onNotificationClick}
          className="
            relative flex items-center justify-center w-10 h-10
            rounded-full bg-white/90 shadow-sm border border-gray-200
            hover:bg-gray-100 transition duration-150
          "
          aria-label="Notifications"
        >
          <BellIcon className="h-5 w-5 text-gray-700" />
          {notificationCount > 0 && (
            <span
              className="
                absolute top-1.5 right-1.5 h-2.5 w-2.5 rounded-full
                bg-red-500 border-2 border-white shadow-md
              "
            />
          )}
        </button>
      )}

      {showProfileIcon && (
        <button
          onClick={() => showScreen("user")}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 shadow-md cursor-pointer hover:bg-gray-200 transition overflow-hidden"
          aria-label="User Profile"
        >
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
