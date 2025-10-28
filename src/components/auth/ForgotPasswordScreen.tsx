// src/components/auth/ForgotPasswordScreen.tsx
import React, { useState } from 'react';
import Header from '@/components/core/Header';
import { supabase } from '@/lib/supabaseClient';
import { ScreenProps } from '@/types';

type ForgotPasswordProps = Omit<ScreenProps, 'profile' | 'setProfile'>;

const ForgotPasswordScreen: React.FC<ForgotPasswordProps> = ({ showScreen, showAlert }) => {
    const [email, setEmail] = useState('');

    const handlePasswordReset = async () => {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/reset-password`, // You need a page for this
        });

        if (error) {
            showAlert(error.message);
        } else {
            showAlert('Password reset link sent to your email.');
            showScreen('welcomeBack');
        }
    };

  return (
    <div className="flex flex-col min-h-screen bg-purple-50">
      <Header title={'Forgot Password'} onBack={() => showScreen('welcomeBack')} showProfileIcon={false} showScreen={showScreen} profile={null} />
      <div className="flex-1 p-6 flex justify-center items-start pt-12">
        <div className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-md text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Password Reset</h2>
          <p className="text-gray-500 mb-6">Enter your email address to receive a password reset link.</p>
          <input type="email" placeholder="Email Address" className="w-full p-3 mb-4 border border-gray-300 rounded-lg" value={email} onChange={(e) => setEmail(e.target.value)} />
          <button className="w-full py-3 mb-4 font-bold text-lg rounded-xl shadow-lg transition" style={{ background: 'linear-gradient(90deg, #d8b4fe, #fbcfe8)', color: '#1e1b4b' }} onClick={handlePasswordReset}>
            Send Reset Link
          </button>
          <span className="text-purple-700 cursor-pointer font-semibold mt-4 block text-sm hover:text-purple-500" onClick={() => showScreen('welcomeBack')}>
            Back to Sign In
          </span>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordScreen;