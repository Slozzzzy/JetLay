// src/components/auth/CreateNewPassword.tsx
"use client";

import React, { useState, useEffect } from "react";
import Header from "@/components/core/Header";
import { supabase } from "@/lib/supabaseClient";
import { 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Loader2, 
  ChevronLeft,
  AlertTriangle,
  KeyRound,
  CheckCircle2
} from "lucide-react";

type Props = {
  showScreen?: (id: string) => void;
  showAlert?: (msg: string, type?: "success" | "error" | "info") => void;
};

const CreateNewPassword: React.FC<Props> = ({ showScreen, showAlert }) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Check if we have a recovery session
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        setErrorMessage(
          "Auth session missing! Please open the reset link from your email again."
        );
      }
    };

    checkSession();
  }, []);

  const goToWelcomeBack = () => {
    if (showScreen) showScreen("welcomeBack");
    else if (typeof window !== "undefined") window.location.href = "/";
  };

  const validatePassword = (pwd: string) => {
    const rules = [
      pwd.length >= 8,
      /[A-Z]/.test(pwd),
      /[a-z]/.test(pwd),
      /\d/.test(pwd),
      /[!@#$%^&*(),.?":{}|<>]/.test(pwd),
    ];
    return rules.every(Boolean);
  };
  
  const renderErrorBox = () => {
    if (!errorMessage) return null;
    const isPasswordError = errorMessage.includes("Invalid Password");

    return (
      <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex flex-col gap-2 text-left animate-fade-in-up">
        <div className="flex justify-between items-start">
            <div className="flex items-center gap-2 text-red-700 font-bold">
                <AlertTriangle className="w-5 h-5" />
                <span>{isPasswordError ? 'Password Requirements' : 'Error'}</span>
            </div>
            <button onClick={() => setErrorMessage("")} className="text-red-400 hover:text-red-600 font-bold text-xl leading-none">
                &times;
            </button>
        </div>

        {isPasswordError ? (
          <div className="text-sm text-red-600 pl-7">
            <p className="mb-1 font-medium">Your new password needs:</p>
            <ul className="space-y-1 text-xs opacity-90">
              <li className="flex items-center gap-1.5"><div className="w-1 h-1 bg-red-400 rounded-full"/> 8+ characters</li>
              <li className="flex items-center gap-1.5"><div className="w-1 h-1 bg-red-400 rounded-full"/> 1 Uppercase & 1 Lowercase</li>
              <li className="flex items-center gap-1.5"><div className="w-1 h-1 bg-red-400 rounded-full"/> 1 Number</li>
              <li className="flex items-center gap-1.5"><div className="w-1 h-1 bg-red-400 rounded-full"/> 1 Special character</li>
            </ul>
          </div>
        ) : (
          <p className="text-sm text-red-600 pl-7">{errorMessage}</p>
        )}
      </div>
    );
  };

  const handleResetPassword = async () => {
    setErrorMessage("");

    if (!password || !confirmPassword) {
      return setErrorMessage("Please fill in all fields.");
    }

    if (password !== confirmPassword) {
      setConfirmPassword("");
      return setErrorMessage("Passwords do not match.");
    }

    if (!validatePassword(password)) {
      setPassword("");
      setConfirmPassword("");
      return setErrorMessage("Invalid Password");
    }

    setLoading(true);
    try {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        setErrorMessage(
          "Auth session missing! Please open the reset link from your email again."
        );
        return;
      }

      const { error } = await supabase.auth.updateUser({ password });

      if (error) {
        setErrorMessage(error.message);
        return;
      }

      await supabase.auth.signOut();

      if (showAlert) {
        showAlert("Password updated successfully!", "success");
      }

      goToWelcomeBack();
    } catch (e) {
      console.error("Reset password error:", e);
      setErrorMessage("Unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 pb-20">
      <Header
        title="Create New Password"
        onBack={goToWelcomeBack}
        showProfileIcon={false}
        showScreen={showScreen ?? (() => {})}
        profile={null}
      />

      <div className="flex-1 px-6 flex justify-center items-center">
        
        {/* Glass Container */}
        <div className="bg-white/80 backdrop-blur-xl rounded-[32px] p-8 shadow-2xl ring-1 ring-white/60 w-full max-w-md text-center">

          {/* Icon Header */}
          <div className="mb-6 flex justify-center">
             <div className="p-4 bg-purple-100 rounded-full text-purple-600 shadow-sm relative">
                <Lock className="w-8 h-8" />
                <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-sm">
                    <KeyRound className="w-4 h-4 text-pink-500" />
                </div>
             </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Set New Password
          </h2>
          <p className="text-gray-500 mb-8 text-sm">
            Your new password must be different from previously used passwords.
          </p>

          {renderErrorBox()}

          <div className="space-y-4 mb-8">
            {/* New Password Input */}
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                    type={showPassword ? "text" : "password"}
                    placeholder="New Password"
                    className="w-full pl-11 pr-12 py-3.5 rounded-xl border-0 ring-1 ring-gray-200 bg-gray-50 text-gray-900 placeholder:text-gray-400 focus:bg-white focus:ring-2 focus:ring-purple-500 transition-all outline-none font-medium"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
            </div>

            {/* Confirm Password Input */}
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <CheckCircle2 className="h-5 w-5 text-gray-400" />
                </div>
                <input
                    type="password"
                    placeholder="Confirm New Password"
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl border-0 ring-1 ring-gray-200 bg-gray-50 text-gray-900 placeholder:text-gray-400 focus:bg-white focus:ring-2 focus:ring-purple-500 transition-all outline-none font-medium"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
            </div>
          </div>

          {/* Submit Button */}
          <button
            disabled={loading}
            className="
                group relative w-full overflow-hidden rounded-xl mb-6
                bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 
                bg-[length:200%_auto] p-4 shadow-lg shadow-indigo-500/20 
                transition-all duration-500 
                hover:bg-right hover:shadow-xl hover:shadow-purple-500/30 hover:-translate-y-0.5 
                active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed
            "
            onClick={handleResetPassword}
          >
            <div className="relative flex items-center justify-center gap-2">
                {loading ? (
                    <>
                        <Loader2 className="w-5 h-5 text-white animate-spin" />
                        <span className="text-lg font-bold text-white">Updating...</span>
                    </>
                ) : (
                    <>
                        <span className="text-lg font-bold text-white tracking-wide">Update Password</span>
                        <ArrowRight className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform" />
                    </>
                )}
            </div>
          </button>

          {/* Back link */}
          <button
            className="flex items-center justify-center gap-2 w-full text-purple-600 font-bold text-sm hover:text-purple-800 transition-colors"
            onClick={goToWelcomeBack}
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Sign In
          </button>

        </div>
      </div>
    </div>
  );
};

export default CreateNewPassword;