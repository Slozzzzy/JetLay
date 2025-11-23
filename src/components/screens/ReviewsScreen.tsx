// src/components/screens/ReviewsScreen.tsx
import React from 'react';
import Image from 'next/image';
import Header from '@/components/core/Header';
import { ScreenProps } from '@/types';
import { Star } from 'lucide-react';

type Review = {
  name: string;
  stars: number;           // 0–5 (ints OK; supports halves too if you ever need)
  text: string;
  avatarBg: string;
  img: string | null;
  when?: string;           // optional label like "2 weeks ago"
};

const StarRow: React.FC<{ value: number; size?: number; showNumber?: boolean }> = ({ value, size = 18, showNumber = false }) => {
  // supports halves if value like 3.5 (we'll just round down for fill logic here)
  const full = Math.floor(value);
  const hasHalf = value - full >= 0.5;
  const stars = [1, 2, 3, 4, 5];

  return (
    <div className="flex items-center gap-1" aria-label={`Rated ${value} out of 5`} role="img">
      {stars.map((n) => {
        const filled = n <= full;
        const half = !filled && n === full + 1 && hasHalf;
        return (
          <span key={n} className="inline-flex relative" style={{ width: size, height: size }}>
            {/* base outline */}
            <Star className="text-gray-300" style={{ width: size, height: size }} />
            {/* filled overlay */}
            <Star
              className={`${half ? 'clip-half' : ''} ${filled || half ? 'fill-yellow-400 text-yellow-400' : ''} absolute inset-0`}
              style={{ width: size, height: size }}
            />
          </span>
        );
      })}
      {showNumber && <span className="ml-2 text-sm text-gray-700">{value.toFixed(1)}</span>}
      <style jsx>{`
        .clip-half {
          clip-path: inset(0 50% 0 0);
        }
      `}</style>
    </div>
  );
};

const ReviewsScreen: React.FC<ScreenProps> = ({ showScreen, profile }) => {
  const reviews: Review[] = [
    { name: 'Mmay M',  stars: 5, text: 'Bangkok → Paris trip. Visa approved in 5 days. Uploading documents to JETLAY was super smooth!', avatarBg: '#581c87', img: 'Visa+Document+Preview', when: '2 weeks ago (demo)' },
    { name: 'honny M', stars: 4, text: 'JETLAY alerted me about my passport expiry before booking my Singapore trip. Lifesaver!', avatarBg: '#eab308', img: 'Singapore+F1+Track+Preview', when: '1 month ago (demo)' },
    { name: 'Fern B.', stars: 4, text: 'Docs synced to Google Calendar perfectly! Reminder saved me.', avatarBg: '#6b21a8', img: null, when: '1 month ago (demo)' },
    { name: 'Bank G.', stars: 3, text: 'Visa took 10 days. Make sure to book flights early!', avatarBg: '#1e1b4b', img: null, when: '2 months ago (demo)' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-purple-50 pb-20">
      <Header
        title="Reviews"
        onBack={() => showScreen('dashboard')}
        showProfileIcon={true}
        showScreen={showScreen}
        profile={profile}
      />
      <div className="p-6 flex-1 max-w-6xl mx-auto w-full text-center">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {reviews.map((review, index) => (
            <div key={index} className="bg-white rounded-xl p-5 shadow-lg border border-gray-200 flex flex-col gap-3">
              <div className="flex items-center gap-3 font-semibold text-gray-900">
                <div
                  className="w-9 h-9 rounded-full text-white flex items-center justify-center text-sm"
                  style={{ backgroundColor: review.avatarBg }}
                  aria-hidden
                >
                  {review.name[0]}
                </div>
                <span>{review.name}</span>
              </div>

              {/* ⭐ Star display */}
              <StarRow value={review.stars} />

              <p className="text-gray-600 text-sm text-left leading-relaxed">{review.text}</p>

              {review.img && (
                <Image
                  width={400}
                  height={120}
                  className="w-full h-32 object-cover rounded-lg mt-2 bg-gray-100"
                  src={`https://placehold.co/400x120/f3f4f6/6b21a8?text=${review.img}`}
                  alt="Review Visual"
                />
              )}

              <span className="text-xs text-gray-400 mt-auto pt-2 text-left">{review.when ?? '—'}</span>
            </div>
          ))}
        </div>

        <button
          className="cursor-pointer w-64 py-3 mt-8 text-white font-bold rounded-xl shadow-lg transition"
          style={{ background: 'linear-gradient(90deg, #d8b4fe, #fbcfe8)', color: '#1e1b4b' }}
          onClick={() => showScreen('addReview')}
        >
          Add your reviews
        </button>
      </div>
    </div>
  );
};

export default ReviewsScreen;