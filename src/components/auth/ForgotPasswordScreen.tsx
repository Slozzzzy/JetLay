// src/components/auth/ForgotPasswordScreen.tsx
import React, { useState } from 'react';
import Header from '@/components/core/Header';
import { supabase } from '@/lib/supabaseClient';
import { ScreenProps } from '@/types';
import { 
    Mail, 
    KeyRound, 
    ArrowRight, 
    Loader2, 
    ChevronLeft 
} from 'lucide-react';

type ForgotPasswordProps = Omit<ScreenProps, 'profile' | 'setProfile'>;

const ForgotPasswordScreen: React.FC<ForgotPasswordProps> = ({ showScreen, showAlert }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handlePasswordReset = async () => {
    if (!email.trim()) {
      showAlert('Please enter your email address.', 'error');
      return;
    }

    setIsLoading(true);

    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL ??
      (typeof window !== 'undefined' ? window.location.origin : '');

    const redirectPath = `${baseUrl}/auth/callback?type=recovery&next=/auth/createnew-password`;

    const { error } = await supabase.auth.resetPasswordForEmail(
      email.trim().toLowerCase(),
      { redirectTo: redirectPath }
    );

    setIsLoading(false);

    if (error) {
      showAlert(error.message, 'error');
    } else {
      showAlert('Password reset link sent to your email.', 'success');
      showScreen('welcomeBack');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 pb-20">
      <Header
        title="Forgot Password"
        onBack={() => showScreen('welcomeBack')}
        showProfileIcon={false}
        showScreen={showScreen}
        profile={null}
      />

      <div className="flex-1 px-6 flex justify-center items-center">
        <div className="bg-white/80 backdrop-blur-xl rounded-[32px] p-8 shadow-2xl ring-1 ring-white/60 w-full max-w-md text-center">

          <div className="mb-6 flex justify-center">
            <div className="p-4 bg-purple-100 rounded-full text-purple-600 shadow-sm">
              <KeyRound className="w-8 h-8" />
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-3">Password Reset</h2>

          {/* 🔥 FIXED HERE (escape apostrophe) */}
          <p className="text-gray-500 mb-8 text-sm leading-relaxed">
            Enter your email address and we&apos;ll send you a link to reset your password.
          </p>

          <div className="relative mb-8">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="email"
              placeholder="Email Address"
              className="w-full pl-11 pr-4 py-3.5 rounded-xl border-0 ring-1 ring-gray-200 bg-gray-50 text-gray-900 placeholder:text-gray-400 focus:bg-white focus:ring-2 focus:ring-purple-500 transition-all outline-none font-medium"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <button
            disabled={isLoading}
            className="
              group relative w-full overflow-hidden rounded-xl mb-6
              bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 
              bg-[length:200%_auto] p-4 shadow-lg shadow-indigo-500/20 
              transition-all duration-500 
              hover:bg-right hover:shadow-xl hover:shadow-purple-500/30 hover:-translate-y-0.5 
              active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed
            "
            onClick={handlePasswordReset}
          >
            <div className="relative flex items-center justify-center gap-2">
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 text-white animate-spin" />
                  <span className="text-lg font-bold text-white">Sending...</span>
                </>
              ) : (
                <>
                  <span className="text-lg font-bold text-white tracking-wide">
                    Send Reset Link
                  </span>
                  <ArrowRight className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </div>
          </button>

          <button
            className="flex items-center justify-center gap-2 w-full text-purple-600 font-bold text-sm hover:text-purple-800 transition-colors"
            onClick={() => showScreen('welcomeBack')}
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Sign In
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordScreen;
