// src/components/auth/LoginScreen.tsx
import React, { useState } from 'react';
import Image from 'next/image';
import Header from '@/components/core/Header';
import { ScreenProps } from '@/types';
import { supabase } from '@/lib/supabaseClient';
import { 
    Mail, 
    Lock, 
    Eye, 
    EyeOff, 
    ArrowRight, 
    Loader2, 
    LogIn
} from 'lucide-react';

type LoginProps = Omit<ScreenProps, 'profile' | 'setProfile'>;

const LoginScreen: React.FC<LoginProps> = ({ showScreen, showAlert }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      showAlert('Please enter both email and password.', 'error');
      return;
    }

    try {
      setIsLoading(true);

      let authResult;

      try {
        authResult = await supabase.auth.signInWithPassword({ email, password });
      } catch (networkErr) {
        console.error('Network/auth request failed:', networkErr);

        const msg = networkErr instanceof Error ? networkErr.message : String(networkErr);

        if (typeof navigator !== 'undefined' && !navigator.onLine) {
          showAlert('You appear to be offline. Check your network connection.', 'error');
        } else {
          showAlert('Network error contacting auth server. Check NEXT_PUBLIC_SUPABASE_URL and CORS.', 'error');
        }

        try {
          await supabase.auth.signOut().catch(() => {});
        } catch {}

        try {
          Object.keys(localStorage)
            .filter((k) => /supabase|sb-|auth/i.test(k))
            .forEach((k) => localStorage.removeItem(k));
        } catch {}

        setIsLoading(false);
        return;
      }

      const { data, error } = authResult ?? {};

      if (error) {
        console.error('Sign-in error object:', error);
        showAlert(error.message || 'Login failed.', 'error');
        return;
      }

      showAlert('Login successful!', 'success');
      showScreen('dashboard');
    } catch (err) {
      console.error('Login error (exception):', err);
      const msg = err instanceof Error ? err.message : String(err);

      if (msg.toLowerCase().includes('network') || msg.includes('Failed to fetch')) {
        try {
          await supabase.auth.signOut().catch(() => {});
        } catch {}

        try {
          Object.keys(localStorage)
            .filter((k) => /supabase|sb-|auth/i.test(k))
            .forEach((k) => localStorage.removeItem(k));
        } catch {}

        showAlert(
          'Network error contacting auth server. Cleared local session; please try again.',
          'error'
        );
      } else {
        showAlert('An unexpected error occurred. Please try again.', 'error');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleLogin();
  };

  const handleGoogleLogin = async () => {
    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL ??
      (typeof window !== 'undefined' ? window.location.origin : '');

    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${baseUrl}/auth/callback?source=google&next=/`,
      },
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 pb-20">
      <Header
        title="Welcome Back"
        onBack={() => showScreen('welcomeChoice')}
        showProfileIcon={false}
        showScreen={showScreen}
        profile={null}
      />

      <div className="flex-1 px-6 flex justify-center items-center">
        <div className="bg-white/80 backdrop-blur-xl rounded-[32px] p-8 shadow-2xl ring-1 ring-white/60 w-full max-w-md text-center">
          <div className="mb-6 flex justify-center">
            <div className="p-3 bg-purple-100 rounded-full text-purple-600">
              <LogIn className="w-8 h-8" />
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
          <p className="text-gray-500 mb-8 text-sm">Sign in to continue your journey.</p>

          <div className="space-y-4 mb-2">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                placeholder="Email Address"
                className="w-full pl-11 pr-4 py-3.5 rounded-xl border-0 ring-1 ring-gray-200 bg-gray-50 text-gray-900 placeholder:text-gray-400 focus:bg-white focus:ring-2 focus:ring-purple-500 transition-all outline-none font-medium"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={onKeyDown}
                autoComplete="email"
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                className="w-full pl-11 pr-12 py-3.5 rounded-xl border-0 ring-1 ring-gray-200 bg-gray-50 text-gray-900 placeholder:text-gray-400 focus:bg-white focus:ring-2 focus:ring-purple-500 transition-all outline-none font-medium"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={onKeyDown}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="flex justify-end w-full mb-6">
            <span
              className="text-purple-600 cursor-pointer font-semibold text-sm hover:text-purple-800 hover:underline"
              onClick={() => showScreen('forgotPassword')}
            >
              Forgot Password?
            </span>
          </div>

          <button
            disabled={isLoading}
            className="
              group relative w-full overflow-hidden rounded-xl mb-4
              bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 
              bg-[length:200%_auto] p-4 shadow-lg shadow-indigo-500/20 
              transition-all duration-500 
              hover:bg-right hover:shadow-xl hover:shadow-purple-500/30 hover:-translate-y-0.5 
              active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed
            "
            onClick={handleLogin}
          >
            <div className="relative flex items-center justify-center gap-2">
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 text-white animate-spin" />
                  <span className="text-lg font-bold text-white">Signing In...</span>
                </>
              ) : (
                <>
                  <span className="text-lg font-bold text-white tracking-wide">Sign In</span>
                  <ArrowRight className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </div>
          </button>

          <div className="relative flex py-2 items-center mb-4">
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="flex-shrink-0 mx-4 text-gray-400 text-xs font-semibold uppercase tracking-wider">
              Or continue with
            </span>
            <div className="flex-grow border-t border-gray-200"></div>
          </div>

          <button
            onClick={handleGoogleLogin}
            className="flex items-center justify-center w-full py-3.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors shadow-sm text-gray-700 font-bold"
          >
            <Image
              src="https://fonts.gstatic.com/s/i/productlogos/googleg/v6/24px.svg"
              alt="Google G Logo"
              width={20}
              height={20}
              className="mr-3"
            />
            Sign in with Google
          </button>

          <p className="mt-8 text-sm text-gray-500">
            Don&apos;t have an account?{' '}
            <span
              className="text-purple-600 font-bold cursor-pointer hover:underline decoration-2 underline-offset-2"
              onClick={() => showScreen('createAccount')}
            >
              Sign up
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
