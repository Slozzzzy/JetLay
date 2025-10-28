// src/components/screens/AddReviewScreen.tsx
import React from 'react';
import Header from '@/components/core/Header';
import { ScreenProps } from '@/types';

const AddReviewScreen: React.FC<ScreenProps> = ({ showScreen, profile }) => (
  <div className="flex flex-col min-h-screen bg-purple-50 pb-20">
    <Header title="Add Review" onBack={() => showScreen('reviews')} showProfileIcon={true} showScreen={showScreen} profile={profile} />
    <div className="p-6 flex-1 max-w-md mx-auto w-full">
      <div className="bg-white p-8 rounded-2xl shadow-xl">
        <div className="mb-5"><input type="text" placeholder="Title (e.g., Bangkok → Paris)" className="w-full p-3 border border-gray-300 rounded-lg h-12" /></div>
        <div className="mb-5"><textarea placeholder="Your experience...." className="w-full p-3 border border-gray-300 rounded-lg min-h-[150px]"></textarea></div>
        <div className="mb-5"><input type="url" placeholder="Google Map place link (optional)" className="w-full p-3 border border-gray-300 rounded-lg h-12" /></div>
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-900 mb-2">Attach photos</label>
          <div className="flex items-center space-x-3">
            <label htmlFor="reviewFile" className="px-4 py-2 bg-gray-200 text-gray-900 font-semibold rounded-lg cursor-pointer hover:bg-gray-300">Choose File</label>
            <input type="file" multiple id="reviewFile" className="hidden" />
            <span className="text-sm text-gray-500">No file chosen</span>
          </div>
        </div>
        <button className="w-full py-3 text-white font-bold rounded-xl shadow-lg transition" style={{ background: 'linear-gradient(90deg, #d8b4fe, #fbcfe8)', color: '#1e1b4b' }} onClick={() => showScreen('reviews')}>
          Post Review
        </button>
      </div>
    </div>
  </div>
);

export default AddReviewScreen;