// src/components/screens/AddReviewScreen.tsx
import React, { useMemo, useState } from 'react';
import Header from '@/components/core/Header';
import { ScreenProps } from '@/types';
import { Star } from 'lucide-react';

type StarRatingProps = {
  value: number;                    // 0–5
  onChange: (v: number) => void;
  label?: string;
};

const StarRating: React.FC<StarRatingProps> = ({ value, onChange, label = 'Rating' }) => {
  const [hover, setHover] = useState<number | null>(null);

  const current = hover ?? value;
  const stars = useMemo(() => [1, 2, 3, 4, 5], []);

  const handleKey = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      e.preventDefault();
      onChange(Math.min(5, (value || 0) + 1));
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      e.preventDefault();
      onChange(Math.max(0, (value || 0) - 1));
    } else if (e.key === '0') {
      onChange(0);
    }
  };

  return (
    <div className="mb-5">
      <label className="block text-sm font-semibold text-gray-900 mb-2">{label}</label>
      <div
        role="radiogroup"
        aria-label={label}
        tabIndex={0}
        onKeyDown={handleKey}
        className="flex items-center gap-2"
      >
        {stars.map((n) => {
          const filled = n <= current;
          return (
            <button
              key={n}
              type="button"
              role="radio"
              aria-checked={value === n}
              aria-label={`${n} star${n > 1 ? 's' : ''}`}
              onMouseEnter={() => setHover(n)}
              onMouseLeave={() => setHover(null)}
              onFocus={() => setHover(n)}
              onBlur={() => setHover(null)}
              onClick={() => onChange(n)}
              className="cursor-pointer p-1 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
            >
              <Star
                className={`w-7 h-7 transition-transform ${filled ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'} ${hover ? 'scale-110' : ''}`}
              />
            </button>
          );
        })}
        <span className="ml-2 text-sm text-gray-700">{current ? `${current}/5` : 'No rating'}</span>
        
        {/* ADDED FRAME TO CLEAR BUTTON */}
        <button
          type="button"
          onClick={() => onChange(0)}
          className="cursor-pointer ml-3 px-3 py-1 text-xs font-medium text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-800 hover:border-gray-400 transition-colors"
        >
          Clear
        </button>
      </div>
    </div>
  );
};

const AddReviewScreen: React.FC<ScreenProps> = ({ showScreen, profile }) => {
  const [title, setTitle] = useState('');
  const [experience, setExperience] = useState('');
  const [mapLink, setMapLink] = useState('');
  const [rating, setRating] = useState<number>(0);
  const [files, setFiles] = useState<File[]>([]);

  const canPost = title.trim().length > 0 && experience.trim().length > 0 && rating > 0;

  const handlePost = () => {
    // TODO: send to your backend/Supabase here
    // Example payload:
    // { title, experience, mapLink, rating, files }
    showScreen('reviews');
  };

  return (
    <div className="flex flex-col min-h-screen bg-purple-50 pb-20">
      <Header
        title="Add Review"
        onBack={() => showScreen('reviews')}
        showProfileIcon={true}
        showScreen={showScreen}
        profile={profile}
      />
      <div className="p-6 flex-1 max-w-md mx-auto w-full">
        <div className="bg-white p-8 rounded-2xl shadow-xl">
          <div className="mb-5">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title (e.g., Bangkok → Paris)"
              className="w-full p-3 border border-gray-300 rounded-lg h-12"
            />
          </div>

          {/* ⭐ New star rating */}
          <StarRating value={rating} onChange={setRating} label="Your rating" />

          <div className="mb-5">
            <textarea
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              placeholder="Your experience...."
              className="w-full p-3 border border-gray-300 rounded-lg min-h-[150px]"
            />
          </div>
          <div className="mb-5">
            <input
              type="url"
              value={mapLink}
              onChange={(e) => setMapLink(e.target.value)}
              placeholder="Google Map place link (optional)"
              className="w-full p-3 border border-gray-300 rounded-lg h-12"
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-900 mb-2">Attach photos</label>
            <div className="flex items-center space-x-3">
              <label
                htmlFor="reviewFile"
                className="cursor-pointer px-4 py-2 bg-gray-200 text-gray-900 font-semibold rounded-lg hover:bg-gray-300"
              >
                Choose File
              </label>
              <input
                type="file"
                multiple
                id="reviewFile"
                className="hidden"
                onChange={(e) => setFiles(Array.from(e.target.files ?? []))}
              />
              <span className="text-sm text-gray-500">
                {files.length ? `${files.length} file(s) selected` : 'No file chosen'}
              </span>
            </div>
          </div>
          <button
            className={`cursor-pointer w-full py-3 text-white font-bold rounded-xl shadow-lg transition ${
              canPost ? 'opacity-100' : 'opacity-60 cursor-not-allowed'
            }`}
            style={{ background: 'linear-gradient(90deg, #d8b4fe, #fbcfe8)', color: '#1e1b4b' }}
            onClick={handlePost}
            disabled={!canPost}
          >
            Post Review
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddReviewScreen;