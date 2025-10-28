// src/components/core/Header.tsx
import React from 'react';
import Image from 'next/image';
import type { Profile } from '@/types';

type HeaderProps = {
  title: string;
  onBack: () => void;
  showProfileIcon: boolean;
  showScreen: (id: string) => void;
  profile: Profile | null;
};

const Header: React.FC<HeaderProps> = ({ title, onBack, showProfileIcon, showScreen, profile }) => (
  <header className="relative flex items-center justify-between p-4 bg-white border-b border-gray-200 shadow-md sticky top-0 z-50">
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

    {showProfileIcon && (
      <button
        onClick={() => showScreen("user")}
        className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 shadow-md cursor-pointer hover:bg-gray-200 transition overflow-hidden"
        aria-label="User Profile"
      >
        {profile?.avatar_url ? (
            <Image src={profile.avatar_url} alt="User Avatar" width={40} height={40} className="object-cover w-full h-full" />
        ) : (
            <span className="text-xl">👤</span>
        )}
      </button>
    )}
  </header>
);

export default Header;