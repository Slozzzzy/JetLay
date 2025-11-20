// src/components/auth/LoginScreen.tsx
import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Header from '@/components/core/Header';
import { ScreenProps } from '@/types';
import DashboardScreen from '@/components/screens/DashboardScreen';
import { stringify } from 'querystring';

interface LoginProps extends Omit<ScreenProps, 'profile' | 'setProfile'> {
  handleGoogleLogin: () => void;
}

const LoginScreen: React.FC<LoginProps> = ({ showScreen, showAlert, handleGoogleLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async () => {
      if (!email || !password) {
        showAlert('Please enter both email and password.', 'error');
        return;
      }

      try {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });

        // Safely parse JSON — some responses may have an empty body
        let result: unknown = {};
        try {
          // If body is empty, this will throw; we catch and keep result as {}
          result = await response.json();
        } catch (parseErr) {
          // ignore parse errors (empty response)
          result = {};
        }

        if (!response.ok) {
          let serverError: string | undefined;
          if (typeof result === 'object' && result !== null && 'error' in result) {
            const e = (result as { error?: unknown }).error;
            if (typeof e === 'string') serverError = e;
          }

          showAlert(serverError ?? 'Login failed.', 'error');
          return;
        }

        showAlert('Login successful!', 'success');
        showScreen('dashboard');
      } catch (err) {
        console.error('Login error:', err);
        showAlert('An unexpected error occurred. Please try again.', 'error');
      }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleLogin();
  };

  return (
    <div className="flex flex-col min-h-screen bg-purple-50">
      <Header
        title={'Welcome Back'}
        onBack={() => showScreen('welcomeChoice')}
        showProfileIcon={false}
        showScreen={showScreen}
        profile={null}
      />
      <div className="flex-1 p-6 flex justify-center items-start pt-12">
        <div className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-md text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
          <p className="text-gray-500 mb-6">Sign in to continue your journey.</p>

          {/* Email */}
          <input
            type="email"
            placeholder="Email Address"
            className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={onKeyDown}
            autoComplete="email"
          />

          {/* Password with show/hide */}
          <div className="relative mb-4">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              className="w-full p-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={onKeyDown}
              autoComplete="current-password"
            />
            <button
              type="button"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800"
              onClick={() => setShowPassword((s) => !s)}
            >
              {showPassword ? (
                // Eye Off
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                    d="M3 3l18 18M10.584 10.587A2 2 0 0012 14a2 2 0 001.414-.586M9.88 4.603A9.956 9.956 0 0112 4c4.418 0 8.167 2.866 9.543 6.86a.999.999 0 010 .681 10.048 10.048 0 01-3.04 4.29M6.455 6.455C4.417 7.83 3 9.778 2.457 11.54a1 1 0 000 .682C3.833 16.217 7.582 19.083 12 19.083c1.15 0 2.257-.19 3.286-.542" />
                </svg>
              ) : (
                // Eye
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>

          <div className="flex justify-end w-full mb-4">
            <span
              className="text-purple-700 cursor-pointer font-semibold text-sm hover:text-purple-500"
              onClick={() => showScreen('forgotPassword')}
            >
              Forgot Password?
            </span>
          </div>

          <button
            disabled={isLoading}
            className="w-full py-3 mb-4 font-bold text-lg rounded-xl shadow-lg transition disabled:opacity-70"
            style={{ background: 'linear-gradient(90deg, #d8b4fe, #fbcfe8)', color: '#1e1b4b' }}
            onClick={handleLogin}
          >
            {isLoading ? 'Signing In…' : 'Sign In'}
          </button>

          <button
            onClick={handleGoogleLogin}
            className="flex items-center justify-center w-full py-3 bg-white border border-gray-300 rounded-lg"
          >
            <Image
              src="https://fonts.gstatic.com/s/i/productlogos/googleg/v6/24px.svg"
              alt="Google G Logo"
              width={24}
              height={24}
              className="mr-3"
            />
            Sign in with Google
          </button>

          <span
            className="text-purple-700 cursor-pointer font-semibold mt-4 block text-sm hover:text-purple-500"
            onClick={() => showScreen('createAccount')}
          >
            Need an account? Sign up.
          </span>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;