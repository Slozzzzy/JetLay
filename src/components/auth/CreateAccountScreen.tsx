// src/components/auth/CreateAccountScreen.tsx
import React, { useState } from "react";
import Image from "next/image";
import Header from "@/components/core/Header";
import { supabase } from "@/lib/supabaseClient";
import { ScreenProps } from "@/types";

interface CreateAccountProps
  extends Omit<ScreenProps, "profile" | "setProfile"> {
  handleGoogleLogin: () => void;
}

const CreateAccountScreen: React.FC<CreateAccountProps> = ({
  showScreen,
  showAlert,
  handleGoogleLogin,
}) => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Local state to manage form errors, as shown in your image
  const [errorMessage, setErrorMessage] = useState("");

  // --- ADDED ---: State to toggle password visibility
  const [showPassword, setShowPassword] = useState(false);

  // Password validation function based on your image
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

  // Function to render the error box
  const renderErrorBox = () => {
    if (!errorMessage) return null;

    // Check if it's the specific password error to show the rules
    const isPasswordError = errorMessage.includes("Invalid Password");

    return (
      <div
        className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-6 text-left"
        role="alert">
        <div className="flex justify-between items-start">
          <strong className="font-bold">
            {isPasswordError ? "Invalid Password" : "Error"}
          </strong>
          {/* Close button */}
          <button
            onClick={() => setErrorMessage("")}
            className="text-xl font-bold leading-none -mt-1">
            &times;
          </button>
        </div>

        {isPasswordError ? (
          <>
            <p className="block sm:inline text-sm">Password must contain:</p>
            <ul className="list-disc list-inside text-sm mt-1">
              <li>At least 8 characters</li>
              <li>At least 1 uppercase</li>
              <li>At least 1 lowercase</li>
              <li>At least 1 number</li>
              <li>At least 1 special character</li>
            </ul>
          </>
        ) : (
          // For other errors like "Fill in all fields"
          <span className="block sm:inline text-sm">{errorMessage}</span>
        )}
      </div>
    );
  };

  const handleSignUp = async () => {
    // Clear any previous errors
    setErrorMessage("");

    if (!email || !password || !fullName) {
      setErrorMessage("Please fill in all fields.");
      return;
    }

    // Validate the password
    if (!validatePassword(password)) {
      setErrorMessage("Invalid Password");
      // --- ADDED ---: Reset password field if invalid
      setPassword("");
      return;
    }

    const [firstName, ...lastNameParts] = fullName.split(" ");
    const lastName = lastNameParts.join(" ");

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
          avatar_url: "", // Default empty avatar
        },
      },
    });

    if (error) {
      setErrorMessage(error.message);
    } else if (data.user) {
      showAlert(
        "Sign up successful! Please check your email to verify your account.",
        "success"
      );
      showScreen("welcomeBack");
    }
  };

  // Helper to clear errors when user starts typing again
  const handleInputChange =
    (setter: React.Dispatch<React.SetStateAction<string>>) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setter(e.target.value);
      if (errorMessage) {
        setErrorMessage("");
      }
    };

  return (
    <div className="flex flex-col min-h-screen bg-purple-50">
      <Header
        title={"Create Your Account"}
        onBack={() => showScreen("welcomeChoice")}
        showProfileIcon={false}
        showScreen={showScreen}
        profile={null}
      />
      <div className="flex-1 p-6 flex justify-center items-start pt-12">
        <div className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-md text-center">
          {/* Render the error box here */}
          {renderErrorBox()}

          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Create Your Account
          </h2>
          <p className="text-gray-500 mb-6">
            Fill in your details below to get started.
          </p>

          <input
            type="text"
            placeholder="Full Name"
            className="w-full p-3 mb-4 border border-gray-300 rounded-lg"
            value={fullName}
            onChange={handleInputChange(setFullName)}
          />
          <input
            type="email"
            placeholder="Email Address"
            className="w-full p-3 mb-4 border border-gray-300 rounded-lg"
            value={email}
            onChange={handleInputChange(setEmail)}
          />

          {/* --- MODIFIED ---: Wrapped password input to add button */}
          <div className="relative w-full mb-4">
            <input
              type={showPassword ? "text" : "password"} // Set type dynamically
              placeholder="Password"
              className="w-full p-3 border border-gray-300 rounded-lg pr-10" // Add padding to right for icon
              value={password}
              onChange={handleInputChange(setPassword)}
            />
            <button
              type="button" // Important to prevent form submission
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center justify-center h-full w-10 text-gray-500 hover:text-gray-700"
              aria-label={showPassword ? "Hide password" : "Show password"}>
              {showPassword ? (
                // Eye-off icon
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.243 4.243l-4.243-4.243"
                  />
                </svg>
              ) : (
                // Eye icon
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              )}
            </button>
          </div>

          <button
            className="w-full py-3 mb-4 font-bold text-lg rounded-xl shadow-lg transition"
            style={{
              background: "linear-gradient(90deg, #d8b4fe, #fbcfe8)",
              color: "#1e1b4b",
            }}
            onClick={handleSignUp}>
            Sign Up
          </button>
          <button
            onClick={handleGoogleLogin}
            className="flex items-center justify-center w-full py-3 bg-white border border-gray-300 rounded-lg">
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
            className="text-purple-700 cursor-pointer font-semibold mt-4 block text-sm"
            onClick={() => showScreen("welcomeBack")}>
            Already have an account? Sign in.
          </span>
        </div>
      </div>
    </div>
  );
};

export default CreateAccountScreen;
