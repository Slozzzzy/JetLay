// src/components/auth/VerifyEmailScreen.tsx
import React from 'react';
import Header from '@/components/core/Header';
import { ScreenProps } from '@/types';

type VerifyEmailProps = Omit<ScreenProps, 'profile' | 'setProfile'>;

const VerifyEmailScreen: React.FC<VerifyEmailProps> = ({ showScreen, showAlert }) => (
  <div className="flex flex-col min-h-screen bg-purple-50">
    <Header title={'Verify Email'} onBack={() => showScreen('createAccount')} showProfileIcon={false} showScreen={showScreen} profile={null} />
    <div className="flex-1 p-6 flex justify-center items-start pt-12">
      <div className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-md text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Verify Your Email</h2>
        <p className="text-gray-500 mb-6">Please check your inbox for a verification link to complete the sign-up.</p>
        <button className="w-full py-3 mb-4 font-bold text-lg rounded-xl shadow-lg transition" style={{ background: 'linear-gradient(90deg, #d8b4fe, #fbcfe8)', color: '#1e1b4b' }} onClick={() => showScreen('welcomeBack')}>
          Back to Login
        </button>
        <span className="text-purple-700 cursor-pointer font-semibold mt-4 block text-sm hover:text-purple-500" onClick={() => showAlert('Resending link (demo)')}>
          Resend Link
        </span>
      </div>
    </div>
  </div>
);

export default VerifyEmailScreen;