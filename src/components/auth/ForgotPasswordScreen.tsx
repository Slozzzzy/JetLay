// src/components/auth/ForgotPasswordScreen.tsx
import React, { useState } from 'react';
import Header from '@/components/core/Header';
import { supabase } from '@/lib/supabaseClient';
import { ScreenProps } from '@/types';

type ForgotPasswordProps = Omit<ScreenProps, 'profile' | 'setProfile'>;

const ForgotPasswordScreen: React.FC<ForgotPasswordProps> = ({ showScreen, showAlert }) => {
    const [email, setEmail] = useState('');

    const handlePasswordReset = async () => {
      if (!email.trim()) {
        showAlert('Please enter your email address.', 'error');
        return;
      }

      const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ??
        (typeof window !== 'undefined' ? window.location.origin : '');
      
    
      const redirectPath = `${baseUrl}/auth/callback?type=recovery&next=/auth/createnew-password`;

      const { error } = await supabase.auth.resetPasswordForEmail(
        email.trim().toLowerCase(),
        {
          redirectTo: redirectPath, 
        }
      );

    if (error) {
      showAlert(error.message, 'error');
    } else {
      showAlert('Password reset link sent to your email.', 'success');
      showScreen('welcomeBack');
    }
  };

return (
    <div className="flex flex-col min-h-screen bg-purple-50">
      {/* Header stays fixed at top, like other auth screens */}
      <Header
        title={'Forgot Password'}
        onBack={() => showScreen('welcomeBack')}
        showProfileIcon={false}
        showScreen={showScreen}
        profile={null}
      />

      {/* Center card similar to your mockup: vertically & horizontally */}
      <div className="flex-1 px-6 pb-10 flex justify-center items-start md:items-center pt-12 md:pt-0">
        <div
          className="bg-white px-10 py-10 rounded-2xl w-full max-w-md text-center"
          style={{
            boxShadow: '0 30px 80px rgba(148, 163, 255, 0.35)', // big soft shadow like screenshot
          }}
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Password Reset
          </h2>
          <p className="text-gray-500 mb-7 text-sm md:text-base">
            Enter your email address to receive a password reset link.
          </p>

          <input
            type="email"
            placeholder="Email Address"
            className="w-full p-3 mb-5 border border-gray-200 rounded-lg text-sm md:text-base
                       focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {/* Gradient button, full width, with hover like your Sign In button */}
          <button
            className="w-full py-3 mb-5 font-bold text-lg rounded-xl shadow-lg transform transition
                       hover:shadow-xl hover:-translate-y-0.5"
            style={{
              background: 'linear-gradient(90deg, #c4b5fd, #f9a8d4)',
              color: '#1e1b4b',
            }}
            onClick={handlePasswordReset}
          >
            Send Reset Link
          </button>

          {/* Back link (purple + hover) */}
          <span
            className="text-purple-700 cursor-pointer font-semibold mt-2 block text-sm hover:text-purple-500"
            onClick={() => showScreen('welcomeBack')}
          >
            Back to Sign In
          </span>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordScreen;