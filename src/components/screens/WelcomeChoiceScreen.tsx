import React from "react";

type WelcomeChoiceScreenProps = {
  showScreen: (screen: string) => void;
};

const WelcomeChoiceScreen: React.FC<WelcomeChoiceScreenProps> = ({
  showScreen,
}) => (
  <div className="relative min-h-screen min-w-screen flex flex-col justify-center items-center text-center p-6 bg-gradient-to-br from-purple-200 via-pink-200 to-rose-200 grainy-bg">
    <style jsx global>{`
      .grainy-bg::after {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-image: url("https://www.transparenttextures.com/patterns/gplay.png");
        opacity: 0.05;
        pointer-events: none;
        animation: grain 8s steps(10) infinite;
      }
      @keyframes grain {
        0%,
        100% {
          transform: translate(0, 0);
        }
        10% {
          transform: translate(-5%, -10%);
        }
        20% {
          transform: translate(-15%, 5%);
        }
        30% {
          transform: translate(7%, -25%);
        }
        40% {
          transform: translate(-5%, 25%);
        }
        50% {
          transform: translate(-15%, 10%);
        }
        60% {
          transform: translate(15%, 0%);
        }
        70% {
          transform: translate(0%, 15%);
        }
        80% {
          transform: translate(3%, 35%);
        }
        90% {
          transform: translate(-10%, 10%);
        }
      }
    `}</style>
    <h1 className="text-5xl font-extrabold text-gray-900 mb-4">
      👋 Hey there !
    </h1>
    <div className="text-gray-800 space-y-1 mb-10">
      <p>
        This is JetLay, the app that helps you manage all the mess in document
        preparations.
      </p>
    </div>

    {/* --- NEW AND IMPROVED ICON --- */}
    <div className="relative w-32 h-32 mb-10 flex items-center justify-center">
      <div className="absolute w-24 h-32 bg-white/60 rounded-xl shadow-lg transform -rotate-6"></div>
      <div className="absolute w-24 h-32 bg-white/80 rounded-xl shadow-lg transform -rotate-2"></div>
      <div className="absolute w-24 h-32 bg-white rounded-xl shadow-xl flex flex-col items-center justify-center p-4 space-y-3">
        <div className="w-5/6 h-2 bg-gray-200 rounded-full"></div>
        <div className="w-5/6 h-2 bg-gray-200 rounded-full"></div>
        <div className="w-4/6 h-2 bg-gray-200 rounded-full"></div>
      </div>
    </div>

    <div className="flex flex-col gap-4 w-full max-w-xs">
      <button
        className="cursor-pointer w-full py-3 bg-white text-gray-900 font-bold text-lg rounded-full shadow-xl hover:scale-[1.03] transition duration-200"
        onClick={() => showScreen("createAccount")}>
        Create Account
      </button>
      <button
        className="cursor-pointer w-full py-3 bg-white/30 text-white font-bold text-lg rounded-full border border-white/50 backdrop-blur-sm hover:bg-white/40 hover:scale-[1.03] transition duration-200"
        onClick={() => showScreen("welcomeBack")}>
        Log In
      </button>
    </div>
  </div>
);

export default WelcomeChoiceScreen;
