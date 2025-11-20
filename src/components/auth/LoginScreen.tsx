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
      <Header title={'Welcome Back'} onBack={() => showScreen('welcomeChoice')} showProfileIcon={false} showScreen={showScreen} profile={null} />
      <div className="flex-1 p-6 flex justify-center items-start pt-12">
        <div className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-md text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
          <p className="text-gray-500 mb-6">Sign in to continue your journey.</p>
          <input type="email" placeholder="Email Address" className="w-full p-3 mb-4 border border-gray-300 rounded-lg" value={email} onChange={(e) => setEmail(e.target.value)} onKeyDown={onKeyDown} />
          <input type="password" placeholder="Password" className="w-full p-3 mb-4 border border-gray-300 rounded-lg" value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={onKeyDown} />
          <div className="flex justify-end w-full mb-4">
            <span className="text-purple-700 cursor-pointer font-semibold text-sm hover:text-purple-500" onClick={() => showScreen('forgotPassword')}>
              Forgot Password?
            </span>
          </div>
          <button className="w-full py-3 mb-4 font-bold text-lg rounded-xl shadow-lg transition" style={{ background: 'linear-gradient(90deg, #d8b4fe, #fbcfe8)', color: '#1e1b4b' }} 
          onClick={handleLogin}>
            Sign In
          </button>
          <button onClick={handleGoogleLogin} className="flex items-center justify-center w-full py-3 bg-white border border-gray-300 rounded-lg">
            <Image src="https://fonts.gstatic.com/s/i/productlogos/googleg/v6/24px.svg" alt="Google G Logo" width={24} height={24} className="mr-3"/>
            Sign in with Google
          </button>
          <span className="text-purple-700 cursor-pointer font-semibold mt-4 block text-sm hover:text-purple-500" onClick={() => showScreen('createAccount')}>
            Need an account? Sign up.
          </span>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;