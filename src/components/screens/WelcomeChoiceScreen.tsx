// src/components/screens/WelcomeChoiceScreen.tsx
import React from 'react';
import { Plane, FileText, ArrowRight, Sparkles } from 'lucide-react';

type WelcomeChoiceScreenProps = {
  showScreen: (screen: string) => void;
};

const WelcomeChoiceScreen: React.FC<WelcomeChoiceScreenProps> = ({ showScreen }) => (
  <div className="relative min-h-screen flex flex-col justify-center items-center text-center p-6 bg-gradient-to-br from-[#FAD0E8] via-[#E7B1FF] to-[#D8B4FE] overflow-hidden">
    
    {/* Decorative Background Blobs */}
    <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
    <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
    <div className="absolute bottom-[-20%] left-[20%] w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-4000"></div>

    <div className="relative z-10 flex flex-col items-center max-w-md w-full">
        
        {/* --- HERO ICON COMPOSITION --- */}
        <div className="relative w-40 h-40 mb-10 flex items-center justify-center">
            {/* Floating Documents */}
            <div className="absolute top-0 right-2 bg-white/40 p-3 rounded-2xl transform rotate-12 backdrop-blur-md shadow-lg animate-float-slow">
                <FileText className="w-8 h-8 text-indigo-600" />
            </div>
            <div className="absolute bottom-2 left-2 bg-white/40 p-3 rounded-2xl transform -rotate-12 backdrop-blur-md shadow-lg animate-float-delayed">
                <FileText className="w-8 h-8 text-pink-600" />
            </div>

            {/* Central Circle */}
            <div className="relative w-28 h-28 bg-white/80 rounded-[32px] shadow-2xl backdrop-blur-xl flex items-center justify-center ring-4 ring-white/40">
                <Plane className="w-14 h-14 text-indigo-600 fill-indigo-100" />
            </div>

            {/* Sparkle */}
            <div className="absolute -top-4 -right-4 text-yellow-400 animate-pulse">
                <Sparkles className="w-8 h-8 fill-current" />
            </div>
        </div>

        {/* Text Content */}
        <h1 className="text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
          JetLay
        </h1>
        <p className="text-lg text-slate-700 font-medium mb-12 leading-relaxed px-4">
           The app that helps you manage all the mess in document preparations.
        </p>

        {/* Buttons */}
        <div className="flex flex-col gap-4 w-full">
            {/* Create Account - Premium Gradient Button */}
            <button
                onClick={() => showScreen('createAccount')}
                className="
                    group relative w-full overflow-hidden rounded-[24px] 
                    bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 
                    bg-[length:200%_auto] p-4 shadow-xl shadow-indigo-500/30 
                    transition-all duration-500 
                    hover:bg-right hover:shadow-2xl hover:shadow-purple-500/40 hover:-translate-y-1 
                    active:scale-[0.98]
                "
            >
                <div className="relative flex items-center justify-center gap-2">
                    <span className="text-xl font-bold text-white tracking-wide">Create Account</span>
                    <ArrowRight className="w-6 h-6 text-white group-hover:translate-x-1 transition-transform" />
                </div>
            </button>

            {/* Log In - Glass Button */}
            <button
                onClick={() => showScreen('welcomeBack')}
                className="
                    w-full py-4 rounded-[24px] 
                    bg-white/40 backdrop-blur-md border border-white/60 
                    text-slate-800 font-bold text-lg
                    shadow-lg hover:bg-white/60 hover:shadow-xl transition-all active:scale-[0.98]
                "
            >
                Log In
            </button>
        </div>
    </div>
  </div>
);

export default WelcomeChoiceScreen;