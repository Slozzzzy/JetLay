// src/components/auth/CreateAccountScreen.tsx
import React, { useState } from 'react';
import Image from 'next/image';
import Header from '@/components/core/Header';
import { supabase } from '@/lib/supabaseClient';
import { ScreenProps } from '@/types';
import { 
    User, 
    Mail, 
    Lock, 
    Eye, 
    EyeOff, 
    AlertTriangle,
    ArrowRight
} from 'lucide-react';

type CreateAccountProps = Omit<ScreenProps, 'profile' | 'setProfile'>;

const CreateAccountScreen: React.FC<CreateAccountProps> = ({ showScreen, showAlert }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const validatePassword = (password: string): boolean => {
    const minLength = 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    return (
      password.length >= minLength &&
      hasUppercase &&
      hasLowercase &&
      hasNumber &&
      hasSpecialChar
    );
  };

  const renderErrorBox = () => {
    if (!errorMessage) return null;

    const isPasswordError = errorMessage.includes('Invalid Password');

    return (
      <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex flex-col gap-2 text-left animate-shake">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2 text-red-700 font-bold">
            <AlertTriangle className="w-5 h-5" />
            <span>{isPasswordError ? 'Password Requirements' : 'Registration Error'}</span>
          </div>
          <button
            onClick={() => setErrorMessage('')}
            className="text-red-400 hover:text-red-600 font-bold text-xl leading-none"
          >
            &times;
          </button>
        </div>

        {isPasswordError ? (
          <div className="text-sm text-red-600 pl-7">
            <p className="mb-1 font-medium">Your password needs:</p>
            <ul className="list-disc list-inside space-y-0.5 text-xs opacity-90">
              <li>8+ characters</li>
              <li>1 Uppercase & 1 Lowercase</li>
              <li>1 Number</li>
              <li>1 Special character</li>
            </ul>
          </div>
        ) : (
          <span className="text-sm text-red-600 pl-7">{errorMessage}</span>
        )}
      </div>
    );
  };

  const handleSignUp = async () => {
    setErrorMessage('');

    if (!email || !password || !fullName) {
      setErrorMessage('Please fill in all fields.');
      return;
    }

    if (!validatePassword(password)) {
      setErrorMessage('Invalid Password');
      setPassword('');
      return;
    }

    const [firstName, ...lastNameParts] = fullName.split(' ');
    const lastName = lastNameParts.join(' ');

    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL ??
      (typeof window !== 'undefined' ? window.location.origin : '');

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${baseUrl}/auth/callback?type=signup`,
        data: {
          first_name: firstName,
          last_name: lastName,
          avatar_url: '',
        },
      },
    });

    if (error) {
      setErrorMessage(error.message);
    } else if (data.user) {
      showAlert('Sign up successful! Check your email.', 'success');
      showScreen('welcomeBack');
    }
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

  const handleInputChange =
    (setter: React.Dispatch<React.SetStateAction<string>>) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setter(e.target.value);
      if (errorMessage) setErrorMessage('');
    };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 pb-20">
      <Header
        title="Create Account"
        onBack={() => showScreen('welcomeChoice')}
        showProfileIcon={false}
        showScreen={showScreen}
        profile={null}
      />

      <div className="flex-1 px-6 flex justify-center items-center">
        <div className="bg-white/80 backdrop-blur-xl rounded-[32px] p-8 shadow-2xl ring-1 ring-white/60 w-full max-w-md text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Join JetLay 🚀</h2>
          <p className="text-gray-500 mb-8 text-sm">Create an account to start your journey.</p>

          {renderErrorBox()}

          <div className="space-y-4 mb-6">
            {/* Full Name */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Full Name"
                className="w-full pl-11 pr-4 py-3.5 rounded-xl border-0 ring-1 ring-gray-200 bg-gray-50 text-gray-900 placeholder:text-gray-400 focus:bg-white focus:ring-2 focus:ring-purple-500 transition-all outline-none font-medium"
                value={fullName}
                onChange={handleInputChange(setFullName)}
              />
            </div>

            {/* Email */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                placeholder="Email Address"
                className="w-full pl-11 pr-4 py-3.5 rounded-xl border-0 ring-1 ring-gray-200 bg-gray-50 text-gray-900 placeholder:text-gray-400 focus:bg-white focus:ring-2 focus:ring-purple-500 transition-all outline-none font-medium"
                value={email}
                onChange={handleInputChange(setEmail)}
              />
            </div>

            {/* Password */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                autoComplete="new-password"
                className="w-full pl-11 pr-12 py-3.5 rounded-xl border-0 ring-1 ring-gray-200 bg-gray-50 text-gray-900 placeholder:text-gray-400 focus:bg-white focus:ring-2 focus:ring-purple-500 transition-all outline-none font-medium"
                value={password}
                onChange={handleInputChange(setPassword)}
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

          <button
            className="
              group relative w-full overflow-hidden rounded-xl mb-4
              bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 
              bg-[length:200%_auto] p-4 shadow-lg shadow-indigo-500/20 
              transition-all duration-500 
              hover:bg-right hover:shadow-xl hover:shadow-purple-500/30 hover:-translate-y-0.5 
              active:scale-[0.98]
            "
            onClick={handleSignUp}
          >
            <div className="relative flex items-center justify-center gap-2">
              <span className="text-lg font-bold text-white tracking-wide">Create Account</span>
              <ArrowRight className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform" />
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
            Sign up with Google
          </button>

          <p className="mt-8 text-sm text-gray-500">
            Already have an account?{' '}
            <span
              className="text-purple-600 font-bold cursor-pointer hover:underline decoration-2 underline-offset-2"
              onClick={() => showScreen('welcomeBack')}
            >
              Log in
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CreateAccountScreen;
