// src/components/screens/VisaScreen.tsx
"use client";

import React, { useState, useEffect } from 'react';
import Header from '@/components/core/Header';
import { ScreenProps } from '@/types';
import { Search, Globe, MapPin } from 'lucide-react'; // Added icons

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
    // Changed background to a soft gradient to match the theme
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 pb-20">
      <Header 
        title="Visa Requirement" 
        onBack={() => showScreen('dashboard')} 
        showProfileIcon={true} 
        showScreen={showScreen} 
        profile={profile} 
      />
      
      <div className="p-6 flex-1 max-w-3xl mx-auto w-full flex flex-col justify-center">
        
        {/* Card Container for Inputs */}
        <div className="bg-white/80 backdrop-blur-xl rounded-[32px] p-8 shadow-xl ring-1 ring-white/60 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Nationality Input */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700 ml-1">
                <Globe className="w-4 h-4 text-indigo-500" />
                Nationality
              </label>
              <div className="relative">
                <select 
                  className="block w-full p-4 bg-gray-50 border-0 ring-1 ring-gray-200 rounded-2xl text-lg font-semibold text-gray-900 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all appearance-none cursor-pointer hover:bg-white" 
                  value={nationality} 
                  onChange={(e) => setNationality(e.target.value)}
                >
                  {nationalities.map((nat) => (
                    <option key={nat} value={nat}>{nat}</option>
                  ))}
                </select>
                {/* Custom Arrow */}
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                  <svg className="h-5 w-5 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                </div>
              </div>
            </div>

            {/* Destination Input */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700 ml-1">
                <MapPin className="w-4 h-4 text-pink-500" />
                Destination
              </label>
              <div className="relative">
                <select
                  className="block w-full p-4 bg-gray-50 border-0 ring-1 ring-gray-200 rounded-2xl text-lg font-semibold text-gray-900 shadow-sm focus:ring-2 focus:ring-pink-500 focus:bg-white transition-all appearance-none cursor-pointer hover:bg-white"
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
                {/* Custom Arrow */}
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                  <svg className="h-5 w-5 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- BIGGER & BEAUTIFUL BUTTON --- */}
        <button 
          onClick={handleCheckRequirements}
          className="
            group relative w-full overflow-hidden rounded-[24px] 
            bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 
            bg-[length:200%_auto] p-5 shadow-xl shadow-indigo-500/30 
            transition-all duration-500 
            hover:bg-right hover:shadow-2xl hover:shadow-purple-500/40 hover:-translate-y-1 
            active:scale-[0.98]
          "
        >
          <div className="relative flex items-center justify-center gap-3">
             <div className="p-2 bg-white/20 rounded-full backdrop-blur-sm group-hover:bg-white/30 transition-colors">
                <Search className="w-6 h-6 text-white" strokeWidth={3} />
             </div>
             <span className="text-xl font-bold text-white tracking-wide">
                Check Requirements
             </span>
          </div>
        </button>
        {/* ------------------------------- */}

        <p className="text-center text-sm text-gray-400 mt-6 font-medium">
        </p>
      </div>
    </div>
  );
};

export default VisaScreen;