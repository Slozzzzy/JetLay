// src/components/auth/CreateAccountScreen.tsx
import React, { useState } from 'react';
import Image from 'next/image';
import Header from '@/components/core/Header';
import { PASSWORD_REGEX } from '@/app/api/auth/_utils/password';
import { ScreenProps } from '@/types';

interface CreateAccountProps extends Omit<ScreenProps, 'profile' | 'setProfile'> {
  handleGoogleLogin: () => void;
}

const CreateAccountScreen: React.FC<CreateAccountProps> = ({ showScreen, showAlert, handleGoogleLogin }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    if (!fullName || !email || !password) {
      showAlert('Please fill in all fields.');
      return;
    }
    if (!PASSWORD_REGEX.test(password)) {
      showAlert('Password must be at least 8 characters and include uppercase, lowercase, number, and special character.');
      return;
    }

    try {
      setLoading(true);

      const res = await fetch('/api/auth/create-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName: fullName.trim(), email: email.trim(), password }),
      });

      const result = await res.json();

      if (!res.ok) {
        showAlert(result.error || 'Sign up failed.');
        return;
        }

      
      showAlert('Sign up successful! Please check your email to verify your account.');
      showScreen('welcomeBack');
    } catch (err) {
      console.error('Sign up error:', err);
      showAlert('Unexpected error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-purple-50">
      <Header title={'Create Your Account'} onBack={() => showScreen('welcomeChoice')} showProfileIcon={false} showScreen={showScreen} profile={null} />
      <div className="flex-1 p-6 flex justify-center items-start pt-12">
        <div className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-md text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Your Account</h2>
          <p className="text-gray-500 mb-6">Fill in your details below to get started.</p>
          <input type="text" placeholder="Full Name" className="w-full p-3 mb-4 border border-gray-300 rounded-lg" value={fullName} onChange={(e) => setFullName(e.target.value)} />
          <input type="email" placeholder="Email Address" className="w-full p-3 mb-4 border border-gray-300 rounded-lg" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input type="password" placeholder="Password" className="w-full p-3 mb-4 border border-gray-300 rounded-lg" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button className="w-full py-3 mb-4 font-bold text-lg rounded-xl shadow-lg transition" style={{ background: 'linear-gradient(90deg, #d8b4fe, #fbcfe8)', color: '#1e1b4b' }}
          onClick = {handleSignUp}
          disabled = {loading}
        >
          {loading ? 'Creating…' : 'Sign Up'}
          </button>
          <button onClick={handleGoogleLogin} className="flex items-center justify-center w-full py-3 bg-white border border-gray-300 rounded-lg">
            <Image src="https://fonts.gstatic.com/s/i/productlogos/googleg/v6/24px.svg" alt="Google G Logo" width={24} height={24} className="mr-3" />
            Sign in with Google
          </button>
          <span className="text-purple-700 cursor-pointer font-semibold mt-4 block text-sm" onClick={() => showScreen('welcomeBack')}>
            Already have an account? Sign in.
          </span>
        </div>
      </div>
    </div>
  );
};

export default CreateAccountScreen;