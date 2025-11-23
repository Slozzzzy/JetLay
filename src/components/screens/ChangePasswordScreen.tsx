// src/components/screens/ChangePasswordScreen.tsx
import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { ScreenProps } from '@/types';
import { Eye, EyeOff } from 'lucide-react'; // ✅ Modern eye icons

const ChangePasswordScreen: React.FC<ScreenProps> = ({ showScreen, showAlert }) => {
  const [email, setEmail] = useState<string>('');
  const [currentPassword, setCurrentPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  // 👁️ Visibility toggles
  const [showCurrentPassword, setShowCurrentPassword] = useState<boolean>(false);
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      setEmail(data.user?.email || '');
    })();
  }, []);

  const validate = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      showAlert('Please fill in all fields.', 'error');
      return false;
    }
    if (newPassword.length < 8) {
      showAlert('New password must be at least 8 characters.', 'error');
      return false;
    }
    if (newPassword !== confirmPassword) {
      showAlert('New password and confirmation do not match.', 'error');
      return false;
    }
    if (newPassword === currentPassword) {
      showAlert('New password must be different from current password.', 'error');
      return false;
    }
    return true;
  };

  const handleChangePassword = async () => {
    if (!validate()) return;
    setLoading(true);

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password: currentPassword,
      });
      if (signInError) {
        showAlert('Current password is incorrect.', 'error');
        setLoading(false);
        return;
      }

      const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });
      if (updateError) {
        showAlert(updateError.message || 'Failed to update password.', 'error');
        setLoading(false);
        return;
      }

      showAlert('Password updated successfully!', 'success');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setShowCurrentPassword(false);
      setShowNewPassword(false);
      setShowConfirmPassword(false);
      showScreen('user');
    } catch (e) {
      showAlert('Something went wrong while updating the password.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // 🔐 Reusable password field
  const renderPasswordField = (
    label: string,
    value: string,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    placeholder: string,
    isVisible: boolean,
    toggleVisibility: () => void
  ) => (
    <div className="mb-4">
      <label className="block text-sm text-gray-600 mb-2">{label}</label>
      <div className="relative">
        <input
          type={isVisible ? 'text' : 'password'}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="w-full py-3 px-4 border border-gray-300 rounded-lg pr-12 focus:border-purple-400 focus:ring-1 focus:ring-purple-400 outline-none transition duration-150 z-0"
        />
        <button
          type="button"
          onClick={toggleVisibility}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 active:scale-95 z-10"
          aria-label={isVisible ? 'Hide password' : 'Show password'}
        >
          {isVisible ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-purple-50 p-6 items-center">
      <div className="w-full max-w-md">
        <div className="relative mb-6 text-center">
          <button
            className="absolute top-1 left-0 text-gray-600 font-semibold flex items-center"
            onClick={() => showScreen('user')}
          >
            &larr; Back
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Change Password</h1>
        </div>

        {/* Email (read-only) */}
        <div className="mb-4">
          <label className="block text-sm text-gray-600 mb-2">Email</label>
          <input
            type="email"
            value={email}
            readOnly
            className="w-full py-3 px-4 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
          />
        </div>

        {/* Password fields */}
        {renderPasswordField(
          'Current Password',
          currentPassword,
          (e) => setCurrentPassword(e.target.value),
          'Enter current password',
          showCurrentPassword,
          () => setShowCurrentPassword(!showCurrentPassword)
        )}

        {renderPasswordField(
          'New Password',
          newPassword,
          (e) => setNewPassword(e.target.value),
          'At least 8 characters',
          showNewPassword,
          () => setShowNewPassword(!showNewPassword)
        )}

        <div className="mb-8">
          {renderPasswordField(
            'Confirm New Password',
            confirmPassword,
            (e) => setConfirmPassword(e.target.value),
            'Re-enter new password',
            showConfirmPassword,
            () => setShowConfirmPassword(!showConfirmPassword)
          )}
        </div>

        <button
          className={`w-full py-4 text-white font-bold text-lg rounded-full shadow-lg transition duration-150 ease-in-out ${
            loading ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-xl active:translate-y-0.5'
          }`}
          style={{ background: 'linear-gradient(90deg, #a78bfa, #f472b6)' }}
          onClick={handleChangePassword}
          disabled={loading}
        >
          {loading ? 'Updating…' : 'Update Password'}
        </button>

        {/* <p className="text-xs text-gray-500 mt-4 text-center">
          Tip: Avoid reusing passwords and consider a password manager.
        </p> */}
      </div>
    </div>
  );
};
//try
export default ChangePasswordScreen;
