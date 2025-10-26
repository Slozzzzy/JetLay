// src/components/auth/PersonalIdScreen.tsx
import React from 'react';
import { ScreenProps } from '@/types';

type PersonalIdProps = Omit<ScreenProps, 'profile' | 'setProfile' | 'showAlert'>;

const PersonalIdScreen: React.FC<PersonalIdProps> = ({ showScreen }) => (
  <div className="flex flex-col min-h-screen bg-purple-50 p-6 justify-center items-center">
    <div className="w-full max-w-md">
      <div className="relative mb-6 text-center">
        <button className="absolute top-1 left-0 text-gray-600 font-semibold flex items-center" onClick={() => showScreen('verifyEmail')}>&larr; Back</button>
        <h1 className="text-3xl font-bold text-gray-900">Personal ID</h1>
      </div>
      <div className="flex justify-center mb-6">
        <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center text-gray-400 text-6xl">👤</div>
      </div>
      <input type="text" placeholder="First Name" className="w-full p-4 mb-4 border border-gray-300 rounded-lg" />
      <input type="text" placeholder="Last Name" className="w-full p-4 mb-4 border border-gray-300 rounded-lg" />
      <input type="date" placeholder="Date of Birth" className="w-full p-4 mb-4 border border-gray-300 rounded-lg text-gray-500" />
      <input type="tel" placeholder="Phone Number" className="w-full p-4 mb-6 border border-gray-300 rounded-lg" />
      <div className="flex items-center justify-between w-full p-4 mb-8 border border-gray-300 rounded-lg">
        <label className="text-gray-500">Profile Picture</label>
        <label htmlFor="profilePicture" className="px-4 py-2 bg-gray-200 text-gray-900 font-semibold rounded-lg cursor-pointer hover:bg-gray-300">Choose File</label>
        <input type="file" id="profilePicture" accept=".jpg,.jpeg,.png" className="hidden" />
      </div>
      <button className="w-full py-4 text-white font-bold text-lg rounded-full shadow-lg" style={{ background: 'linear-gradient(90deg, #a78bfa, #f472b6)' }} onClick={() => showScreen('dashboard')}>
        Get Started
      </button>
    </div>
  </div>
);

export default PersonalIdScreen;