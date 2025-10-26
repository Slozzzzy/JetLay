// src/components/screens/UploadFormScreen.tsx
import React from 'react';
import Header from '@/components/core/Header';
import { ScreenProps } from '@/types';

const UploadFormScreen: React.FC<ScreenProps> = ({ showScreen, profile }) => (
  <div className="flex flex-col min-h-screen bg-purple-50 pb-20">
    <Header title="Upload Document" onBack={() => showScreen('upload')} showProfileIcon={true} showScreen={showScreen} profile={profile} />
    <div className="p-6 flex-1 max-w-2xl mx-auto w-full">
        <label className="block text-sm font-medium text-gray-900">Document Type</label>
        <select className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm mb-4">
          <option>Passport</option><option>Visa</option><option>Travel Insurance</option><option>Photo</option>
        </select>
        <label className="block text-sm font-medium text-gray-900">Choose File</label>
        <div className="flex items-center space-x-3 mt-1 mb-4">
            <label htmlFor="docUploadFile" className="px-4 py-2 bg-gray-200 text-gray-900 font-semibold rounded-lg cursor-pointer hover:bg-gray-300">
                Choose File
            </label>
            <input type="file" id="docUploadFile" className="hidden" />
            <span className="text-sm text-gray-500">No file chosen</span>
        </div>
        <label className="block text-sm font-medium text-gray-900">Expiry Date</label>
        <input type="date" className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm mb-6" />
        <button className="w-full py-3 bg-gray-900 text-white font-bold rounded-xl shadow-md hover:bg-gray-700" onClick={() => showScreen('upload')}>
          Save
        </button>
    </div>
  </div>
);

export default UploadFormScreen;