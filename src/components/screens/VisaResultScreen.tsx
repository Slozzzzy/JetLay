// src/components/screens/VisaResultScreen.tsx
import React from 'react';
import Header from '@/components/core/Header';
import { ScreenProps } from '@/types';

const VisaResultScreen: React.FC<ScreenProps> = ({ showScreen, showAlert, profile }) => {
  const mockRequirements = [ 'Passport valid for 6 months beyond intended stay', 'Completed Visa Application Form', 'Two recent passport-sized photos (35mm x 45mm)', 'Proof of accommodation', 'Proof of Funds (Bank statements)', 'Travel Insurance', 'Round-trip flight ticket reservations' ];

  return (
    <div className="flex flex-col min-h-screen bg-purple-50 pb-20">
      <Header title={`Requirements Checklist`} onBack={() => showScreen('visa')} showProfileIcon={true} showScreen={showScreen} profile={profile} />
      <div className="p-6 flex-1 max-w-3xl mx-auto w-full">
          <div className="bg-white p-6 rounded-xl shadow-xl border border-purple-200">
              <h3 className="text-xl font-bold text-purple-700 mb-3">Visa Checklist</h3>
              <div className="space-y-3">
                  {mockRequirements.map((item, index) => (
                    <label key={index} className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-gray-200 cursor-pointer hover:bg-gray-50">
                      <span className="font-medium text-gray-900">{item}</span>
                      <input type="checkbox" defaultChecked={index < 3} className="w-5 h-5 text-purple-600 border-gray-300 rounded" />
                    </label>
                  ))}
              </div>
          </div>
        <div className="mt-6 space-y-3">
          <button className="w-full py-3 text-white font-bold rounded-xl shadow-md" style={{background: 'linear-gradient(90deg, #d8b4fe, #fbcfe8)', color: '#1e1b4b'}} onClick={() => showAlert('Open official embassy link (demo)', 'info')}>
            Open Official Source
          </button>
          <button className="w-full py-3 bg-gray-900 text-white font-bold rounded-xl shadow-md hover:bg-gray-700" onClick={() => showScreen('calendar')}>
            Add deadlines to Calendar
          </button>
        </div>
      </div>
    </div>
  );
};

export default VisaResultScreen;