// src/components/screens/DocumentListScreen.tsx
import React from "react";
import Header from "@/components/core/Header";
import { ScreenProps } from "@/types";

interface DocumentListProps extends ScreenProps {
  goBack: () => void; // dynamic back function
}

const DocumentListScreen: React.FC<DocumentListProps> = ({
  showScreen,
  profile,
  goBack,
}) => {
  return (
    <div className="flex flex-col min-h-screen bg-purple-50 pb-20">
      {/* Header with dynamic back */}
      <Header
        title="Your Documents"
        onBack={goBack}
        showProfileIcon={true}
        showScreen={showScreen}
        profile={profile}
      />

      <div className="p-6 flex-1 max-w-3xl mx-auto w-full space-y-3">
        {/* Mock Data */}
        <div className="flex items-center justify-between p-4 bg-white rounded-xl shadow-md border border-gray-200">
          <div>
            <strong className="text-gray-900">Passport</strong>
            <span className="text-sm text-red-600"> • Expires: 2025-11-10</span>
          </div>
          <span className="px-3 py-1 text-xs font-semibold bg-red-100 text-red-800 rounded-full">
            Expiring soon
          </span>
        </div>

        <div className="flex items-center justify-between p-4 bg-white rounded-xl shadow-md border border-gray-200">
          <div>
            <strong className="text-gray-900">Visa (France)</strong>
            <span className="text-sm text-green-600">
              {" "}
              • Expires: 2026-05-02
            </span>
          </div>
          <span className="px-3 py-1 text-xs font-semibold bg-green-100 text-green-800 rounded-full">
            Valid
          </span>
        </div>

        {/* Upload button */}
        <button
          className="w-full mt-6 py-3 bg-yellow-400 text-gray-900 font-bold rounded-xl shadow-md hover:bg-yellow-500"
          onClick={() => showScreen("uploadForm")}>
          Upload New Document
        </button>
      </div>
    </div>
  );
};

export default DocumentListScreen;
