// src/components/screens/VisaScreen.tsx
import React, { useState } from 'react';
import Header from '@/components/core/Header';
import { ScreenProps } from '@/types';

const VisaScreen: React.FC<ScreenProps> = ({ showScreen, profile }) => {
  const [nationality, setNationality] = useState('Thailand');
  const [destination, setDestination] = useState('France');

  return (
    <div className="flex flex-col min-h-screen bg-purple-50 pb-20">
      <Header title="Visa Requirement" onBack={() => showScreen('dashboard')} showProfileIcon={true} showScreen={showScreen} profile={profile} />
      <div className="p-6 flex-1 max-w-3xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-900">Nationality</label>
            <select className="cursor-pointer mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm" value={nationality} onChange={(e) => setNationality(e.target.value)}>
              <option>Thailand</option><option>Japan</option><option>France</option><option>USA</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-900">Destination</label>
            <select className="cursor-pointer mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm" value={destination} onChange={(e) => setDestination(e.target.value)}>
              <option>France</option><option>USA</option><option>Japan</option><option>Thailand</option>
            </select>
          </div>
        </div>
        <button className="cursor-pointer w-full mt-6 py-3 bg-yellow-400 text-gray-900 font-bold rounded-xl shadow-md hover:bg-yellow-500 flex items-center justify-center" onClick={() => showScreen('visaResult')}>
            Check Requirements
        </button>
        <p className="text-center text-sm text-gray-500 mt-3">Mock result based on selected countries.</p>
      </div>
    </div>
  );
};

export default VisaScreen;