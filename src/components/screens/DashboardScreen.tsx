// src/components/screens/DashboardScreen.tsx
import React from 'react';
import Image from 'next/image';
import Header from '@/components/core/Header';
import { ScreenProps } from '@/types';

const DashboardScreen: React.FC<ScreenProps> = ({ showScreen, profile, setProfile, showAlert }) => {
  const dashboardCards = [
    { id: 'visa', icon: '/visa.png', title: 'Visa Requirement', detail: 'Check country entry rules.' },
    { id: 'upload', icon: '/document.png', title: 'Document Upload', detail: 'Store and track your files.' },
    { id: 'calendar', icon: '/calendar.png', title: 'Calendar', detail: 'Plan your travel deadlines.' },
    { id: 'reviews', icon: '/review.png', title: 'Traveler Reviews', detail: 'Share and read experiences.' },
  ];
  
  const userName = profile?.first_name || 'User';

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-purple-200 via-pink-200 to-rose-200 grainy-bg">
      <style jsx global>{`
        /* ... grainy-bg styles ... */
      `}</style>
      <Header 
        title={`Hello, ${userName}`}
        onBack={() => { /* No back from dashboard */ }}
        showProfileIcon={true} 
        showScreen={showScreen}
        profile={profile}
      />
      <div className="p-6 flex-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-2">
          {dashboardCards.map((card) => (
            <div 
              key={card.id}
              className="bg-white rounded-2xl p-6 text-center shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer group hover:-translate-y-2 overflow-hidden"
              onClick={() => showScreen(card.id)}
            >
              <div className="transition-transform duration-300 group-hover:scale-110">
                  <div className="mb-3 flex justify-center items-center h-14">
                    <Image src={card.icon} alt={card.title} width={56} height={56} className="object-contain" />
                  </div>
                  <h3 className="font-semibold text-lg text-gray-900 truncate">{card.title}</h3>
              </div>
              <p className="text-gray-500 text-sm h-0 opacity-0 group-hover:h-auto group-hover:mt-2 group-hover:opacity-100 transition-all duration-300">
                  {card.detail}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardScreen;