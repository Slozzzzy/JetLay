// src/components/screens/VisaScreen.tsx
"use client";

import React, { useState, useEffect } from 'react';
import Header from '@/components/core/Header';
import { ScreenProps } from '@/types';

const VisaScreen: React.FC<ScreenProps> = ({ showScreen, profile }) => {
  const nationalities = ["Thai", "Japanese", "French", "American"];
  const destinations = ["Thailand", "Japan", "France", "USA"];
  const [nationality, setNationality] = useState('Thai');
  const [destination, setDestination] = useState('France');

  // Auto-change destination if it's the same as nationality
  useEffect(() => {
    const nationalityToCountry: Record<string, string> = {
      Thai: "Thailand",
      Japanese: "Japan",
      French: "France",
      American: "USA",
    };

  const forbiddenDestination = nationalityToCountry[nationality];

    if (destination === forbiddenDestination) {
      const newDest = destinations.find((c) => c !== forbiddenDestination);
      setDestination(newDest!);
    }
  }, [nationality, destination]);

  const handleCheckRequirements = () => {
    localStorage.setItem(
      "visaSearch",
      JSON.stringify({ nationality, destination })
    );

    showScreen("visaResult");
  };

  return (
    <div className="flex flex-col min-h-screen bg-purple-50 pb-20">
      <Header title="Visa Requirement" onBack={() => showScreen('dashboard')} showProfileIcon={true} showScreen={showScreen} profile={profile} />
      <div className="p-6 flex-1 max-w-3xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-900">Nationality</label>
            <select className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm" value={nationality} onChange={(e) => setNationality(e.target.value)}>
              {nationalities.map((nat) => (
                <option key={nat} value={nat}>{nat}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-900">Destination</label>
            <select
              className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
            >
              {destinations
                .filter((country) => {
                  const map: Record<string, string> = {
                    Thai: "Thailand",
                    Japanese: "Japan",
                    French: "France",
                    American: "USA",
                  };
                  return country !== map[nationality];
                })
                .map((country) => (
                  <option key={country} value={country}>{country}</option>
                ))}
            </select>
          </div>
        </div>
        <button className="w-full mt-6 py-3 bg-yellow-400 text-gray-900 font-bold rounded-xl shadow-md hover:bg-yellow-500 flex items-center justify-center" onClick={handleCheckRequirements}>
            Check Requirements
        </button>
        <p className="text-center text-sm text-gray-500 mt-3">Mock result based on selected countries.</p>
      </div>
    </div>
  );
};

export default VisaScreen;