// src/components/screens/ReviewsScreen.tsx
import React from 'react';
import Image from 'next/image';
import Header from '@/components/core/Header';
import { ScreenProps } from '@/types';

const ReviewsScreen: React.FC<ScreenProps> = ({ showScreen, profile }) => {
  const reviews = [
    { name: 'Mmay M', stars: 5, text: 'Bangkok → Paris trip. Visa approved in 5 days. Uploading documents to JETLAY was super smooth!', avatarBg: '#581c87', img: 'Visa+Document+Preview' },
    { name: 'honny M', stars: 4, text: 'JETLAY alerted me about my passport expiry before booking my Singapore trip. Lifesaver!', avatarBg: '#eab308', img: 'Singapore+F1+Track+Preview' },
    { name: 'Fern B.', stars: 4, text: 'Docs synced to Google Calendar perfectly! Reminder saved me.', avatarBg: '#6b21a8', img: null },
    { name: 'Bank G.', stars: 3, text: 'Visa took 10 days. Make sure to book flights early!', avatarBg: '#1e1b4b', img: null },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-purple-50 pb-20">
      <Header title="Reviews" onBack={() => showScreen('dashboard')} showProfileIcon={true} showScreen={showScreen} profile={profile} />
      <div className="p-6 flex-1 max-w-6xl mx-auto w-full text-center">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {reviews.map((review, index) => (
            <div key={index} className="bg-white rounded-xl p-5 shadow-lg border border-gray-200 flex flex-col gap-3">
              <div className="flex items-center gap-3 font-semibold text-gray-900">
                <div className="w-9 h-9 rounded-full text-white flex items-center justify-center text-sm" style={{ backgroundColor: review.avatarBg }}>{review.name[0]}</div>
                <span>{review.name}</span>
              </div>
              <div className="text-yellow-500 text-xl">{'★'.repeat(review.stars) + '☆'.repeat(5 - review.stars)}</div>
              <p className="text-gray-600 text-sm text-left leading-relaxed">{review.text}</p>
              {review.img && ( <Image width={400} height={120} className="w-full h-32 object-cover rounded-lg mt-2 bg-gray-100" src={`https://placehold.co/400x120/f3f4f6/6b21a8?text=${review.img}`} alt="Review Visual" /> )}
              <span className="text-xs text-gray-400 mt-auto pt-2 text-left">2 weeks ago (demo)</span>
            </div>
          ))}
        </div>
        <button className="w-64 py-3 mt-8 text-white font-bold rounded-xl shadow-lg transition" style={{ background: 'linear-gradient(90deg, #d8b4fe, #fbcfe8)', color: '#1e1b4b' }} onClick={() => showScreen('addReview')}>
          Add your reviews
        </button>
      </div>
    </div>
  );
};

export default ReviewsScreen;