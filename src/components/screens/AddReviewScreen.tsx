// src/components/screens/AddReviewScreen.tsx
import React, { useState } from 'react';
import Header from '@/components/core/Header';
import { ScreenProps } from '@/types';
import { Star, StarHalf, StarOff } from 'lucide-react';

type StarRatingProps = {
  value: number; // 0–5 (0.5 step)
  onChange: (v: number) => void;
  label?: string;
};

const StarRating: React.FC<StarRatingProps> = ({ value, onChange, label = 'Rating' }) => {
  const [hover, setHover] = useState<number | null>(null);
  const current = hover ?? value;
  const stars = [1, 2, 3, 4, 5];

  // เลือก icon ตามค่า
  const getIcon = (index: number) => {
    const diff = current - index;

    if (diff >= 0) return <Star className="w-7 h-7 fill-yellow-400 text-yellow-400" />;
    if (diff >= -0.5) return <StarHalf className="w-7 h-7 text-yellow-400" />;
    return <StarOff className="w-7 h-7 text-gray-300" />;
  };

  // toggle แบบ 2-click
  const handleClick = (index: number) => {
    if (value === index) return onChange(index - 0.5); // เต็ม → ครึ่ง
    if (value === index - 0.5) return onChange(index); // ครึ่ง → เต็ม
    return onChange(index); // โดนดวงใหม่ → เต็ม
  };

  return (
    <div className="mb-5">
      <label className="block text-sm font-semibold text-gray-900 mb-2">{label}</label>

      <div className="flex items-center gap-2">
        {stars.map((n) => (
          <div
            key={n}
            className="cursor-pointer transition-transform hover:scale-110"
            onMouseEnter={() => setHover(n)}
            onMouseLeave={() => setHover(null)}
            onClick={() => handleClick(n)}
          >
            {getIcon(n)}
          </div>
        ))}

        <span className="ml-2 text-sm text-gray-700">
          {current ? `${current}/5` : 'No rating'}
        </span>

        {/* Clear button */}
        <button
          type="button"
          onClick={() => onChange(0)}
          className="
            ml-3 px-3 py-1.5
            text-xs font-medium
            text-gray-600
            border border-gray-300 rounded-lg
            hover:border-purple-400 hover:text-purple-600
            transition-all
          "
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
    showScreen('reviews');
  };

  return (
    <div className="flex flex-col min-h-screen bg-purple-50 pb-20">
      <Header
        title="Add Review"
        onBack={() => showScreen('reviews')}
        showProfileIcon
        showScreen={showScreen}
        profile={profile}
      />

      <div className="p-6 flex-1 max-w-md mx-auto w-full">
        <div className="bg-white p-8 rounded-2xl shadow-xl">

          {/* Title */}
          <div className="mb-5">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title (e.g., Bangkok → Paris)"
              className="w-full p-3 border border-gray-300 rounded-lg h-12"
            />
          </div>

          {/* Rating */}
          <StarRating value={rating} onChange={setRating} label="Your rating" />

          {/* Experience */}
          <div className="mb-5">
            <textarea
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              placeholder="Your experience...."
              className="w-full p-3 border border-gray-300 rounded-lg min-h-[150px]"
            />
          </div>

          {/* Map Link */}
          <div className="mb-5">
            <input
              type="url"
              value={mapLink}
              onChange={(e) => setMapLink(e.target.value)}
              placeholder="Google Map place link (optional)"
              className="w-full p-3 border border-gray-300 rounded-lg h-12"
            />
          </div>

          {/* File Upload */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Attach photos
            </label>

            <label className="cursor-pointer">
              <div
                className="
                  w-full h-12
                  flex items-center justify-between
                  px-4
                  border border-gray-300 rounded-lg bg-white
                  shadow-sm hover:border-purple-400 hover:shadow-md
                  transition-all
                "
              >
                <span className="text-sm text-gray-600">
                  {files.length ? `${files.length} file(s) selected` : "Choose file..."}
                </span>

                <span className="text-xs font-medium text-purple-600">
                  Browse
                </span>
              </div>

              <input
                type="file"
                multiple
                className="hidden"
                onChange={(e) => setFiles(Array.from(e.target.files ?? []))}
              />
            </label>
          </div>

          {/* Submit */}
          <button
            className={`
              w-full py-3 font-bold rounded-xl shadow-lg transition
              ${canPost ? '' : 'opacity-60 cursor-not-allowed'}
            `}
            style={{
              background: 'linear-gradient(90deg, #d8b4fe, #fbcfe8)',
              color: '#1e1b4b'
            }}
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
