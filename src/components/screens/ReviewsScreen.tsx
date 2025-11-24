// src/components/screens/ReviewsScreen.tsx
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Header from '@/components/core/Header';
import { ScreenProps } from '@/types';
import { Star } from 'lucide-react';

type Profile = {
  id: string;
  first_name: string;
  last_name: string;
  avatar_bg: string;
  profile_pic?: string | null;
};

type Review = {
  id: number;
  author_profile_id: string;
  title: string;
  rating: number;
  description_text: string;
  map_link?: string | null;
  place_title?: string | null;
  image_path?: string | null;
  created_at: string;
  profiles?: Profile;
};

const StarRow: React.FC<{ value: number; size?: number; showNumber?: boolean }> = ({
  value,
  size = 18,
  showNumber = false,
}) => {
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
            <Star className="text-gray-300" style={{ width: size, height: size }} />
            <Star
              className={`${half ? 'clip-half' : ''} ${
                filled || half ? 'fill-yellow-400 text-yellow-400' : ''
              } absolute inset-0`}
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
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/reviews');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch reviews');
      }

      setReviews(data.reviews || []);
    } catch (err) {
      console.error('Error fetching reviews:', err);
      setError(err instanceof Error ? err.message : 'Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? 's' : ''} ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} month${Math.floor(diffDays / 30) > 1 ? 's' : ''} ago`;
    return `${Math.floor(diffDays / 365)} year${Math.floor(diffDays / 365) > 1 ? 's' : ''} ago`;
  };

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
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-4 border-purple-300 border-t-purple-600 rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600">Loading reviews...</p>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">{error}</div>
        )}

        {!loading && !error && reviews.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg mb-4">No reviews yet</p>
            <p className="text-gray-500">Be the first to share your experience!</p>
          </div>
        )}

        {!loading && !error && reviews.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="bg-white rounded-xl p-5 shadow-lg border border-gray-200 flex flex-col gap-3 cursor-pointer hover:shadow-xl transition"
                onClick={() => setSelectedReview(review)}
              >
                <div className="flex items-center gap-3 font-semibold text-gray-900">
                  {review.profiles?.profile_pic ? (
                    <Image
                      src={review.profiles.profile_pic}
                      alt={`${review.profiles.first_name} ${review.profiles.last_name}`}
                      width={36}
                      height={36}
                      className="w-9 h-9 rounded-full object-cover"
                    />
                  ) : (
                    <div
                      className="w-9 h-9 rounded-full text-white flex items-center justify-center text-sm"
                      style={{ backgroundColor: review.profiles?.avatar_bg || '#6b21a8' }}
                      aria-hidden
                    >
                      {review.profiles ? review.profiles.first_name[0].toUpperCase() : 'A'}
                    </div>
                  )}
                  <span>
                    {review.profiles
                      ? `${review.profiles.first_name} ${review.profiles.last_name}`
                      : 'Anonymous'}
                  </span>
                </div>

                <StarRow value={review.rating} />

                <h3 className="font-semibold text-gray-900 text-left">{review.title}</h3>

                {/* SHOW IMAGE IF AVAILABLE */}
                {review.image_path && (
                  <Image
                    src={review.image_path}
                    alt="Review image"
                    width={400} // fixed width for layout purposes
                    height={0} // height will be determined by layout
                    className="w-full h-auto rounded-lg bg-gray-100 mt-2 object-cover"
                  />
                )}


                <p className="text-gray-600 text-sm text-left leading-relaxed">{review.description_text}</p>

                {review.map_link && (
                  <a
                    href={review.map_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-purple-600 hover:text-purple-800 underline text-left"
                  >
                    {review.place_title || 'Open in Google Maps'}
                  </a>
                )}
              </div>
            ))}
          </div>
        )}

        <button
          className="w-64 py-3 mt-8 text-white font-bold rounded-xl shadow-lg transition hover:opacity-90"
          style={{ background: 'linear-gradient(90deg, #d8b4fe, #fbcfe8)', color: '#1e1b4b' }}
          onClick={() => showScreen('addReview')}
        >
          Add your review
        </button>
      </div>

      {/* Modal for Selected Review */}
      {selectedReview && (
        <div className="fixed inset-0 z-50 bg-black/50 flex justify-center items-center p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-6 relative overflow-y-auto max-h-[90vh]">
            <button
              onClick={() => setSelectedReview(null)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-xl font-bold"
            >
              ✕
            </button>

            <h2 className="text-2xl font-bold mb-2">{selectedReview.title}</h2>

            <div className="flex items-center gap-3 mb-4">
              {selectedReview.profiles?.profile_pic ? (
                <Image
                  src={selectedReview.profiles.profile_pic}
                  alt={`${selectedReview.profiles.first_name} ${selectedReview.profiles.last_name}`}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-purple-500 text-white flex items-center justify-center">
                  {selectedReview.profiles?.first_name?.[0] || 'A'}
                </div>
              )}
              <span className="font-semibold">
                {selectedReview.profiles
                  ? `${selectedReview.profiles.first_name} ${selectedReview.profiles.last_name}`
                  : 'Anonymous'}
              </span>
            </div>

            <StarRow value={selectedReview.rating} size={24} showNumber />

            <p className="mt-4 text-gray-700">{selectedReview.description_text}</p>

            {selectedReview.image_path && (
              <div className="mt-4 flex justify-center">
                <Image
                  src={selectedReview.image_path}
                  alt="Review image"
                  height={256} // fixed height (64 * 4)
                  width={0} // width auto
                  className="h-74 w-auto object-cover rounded-lg"
                />
              </div>
            )}


            {selectedReview.map_link && (
              <a
                href={selectedReview.map_link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-600 underline mt-3 block"
              >
                {selectedReview.place_title || 'Open in Google Maps'}
              </a>
            )}

            <span className="text-xs text-gray-400 mt-4 block">
              {formatTimeAgo(selectedReview.created_at)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewsScreen;
