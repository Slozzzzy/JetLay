// src/components/auth/CreateNewPassword.tsx
"use client";

import React, { useState, useEffect } from "react";
import Header from "@/components/core/Header";
import { supabase } from "@/lib/supabaseClient";

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

  // check if we have a recovery session
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
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6 text-left">
        <div className="flex justify-between items-start">
          <strong>{isPasswordError ? "Invalid Password" : "Error"}</strong>
          <button onClick={() => setErrorMessage("")} className="text-xl">×</button>
        </div>

        {isPasswordError ? (
          <>
            <p className="text-sm">Password must contain:</p>
            <ul className="text-sm ml-4 list-disc">
              <li>8+ characters</li>
              <li>1 uppercase</li>
              <li>1 lowercase</li>
              <li>1 number</li>
              <li>1 special character</li>
            </ul>
          </>
        ) : (
          <p className="text-sm">{errorMessage}</p>
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
    <div className="flex flex-col min-h-screen bg-purple-50">
      {/* Back button */}
      <Header
        title="Create New Password"
        onBack={goToWelcomeBack}
        showProfileIcon={false}
        showScreen={showScreen ?? (() => {})}
        profile={null}
      />

      <div className="flex-1 p-6 flex justify-center items-start pt-12">
        <div className="bg-white p-10 rounded-2xl shadow-2xl max-w-md w-full text-center">

          {renderErrorBox()}

          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Create New Password
          </h2>
          <p className="text-gray-500 mb-6">
            Enter your new password below.
          </p>

          {/* Password input */}
          <div className="relative w-full mb-4">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg pr-10"
            />

            {/* Eye icon toggle */}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 w-10 flex items-center justify-center text-gray-500 hover:text-gray-700"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                // Eye off
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth = {1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.243 4.243l-4.243-4.243" />
                </svg>
              ) : (
                // Eye
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6" >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                </svg>
              )}
            </button>
          </div>

          {/* Confirm password */}
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-3 mb-4 border border-gray-300 rounded-lg"
          />

          {/* Submit Button */}
          <button
            className="w-full py-3 font-bold text-lg rounded-xl shadow-lg transition hover:shadow-xl disabled:opacity-50"
            style={{
              background: "linear-gradient(90deg, #d8b4fe, #fbcfe8)",
              color: "#1e1b4b",
            }}
            disabled={loading}
            onClick={handleResetPassword}
          >
            {loading ? "Updating…" : "Update Password"}
          </button>

          {/* Back to Sign In */}
          <span
            className="mt-4 block text-purple-700 cursor-pointer font-semibold hover:text-purple-500"
            onClick={goToWelcomeBack}
          >
            Back to Sign In
          </span>
        </div>
      </div>
    </div>
  );
};

export default CreateNewPassword;
