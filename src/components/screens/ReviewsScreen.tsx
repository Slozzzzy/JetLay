// src/components/screens/ReviewsScreen.tsx
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Header from '@/components/core/Header';
import { ScreenProps } from '@/types';
import { 
  Star, 
  MapPin, 
  User, 
  MessageSquare, 
  X, 
  Loader2, 
  Plus,
  ExternalLink,
  Clock
} from 'lucide-react';

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
  size = 16,
  showNumber = false,
}) => {
  const full = Math.floor(value);
  const hasHalf = value - full >= 0.5;
  const stars = [1, 2, 3, 4, 5];

  return (
    <div className="flex items-center gap-0.5" aria-label={`Rated ${value} out of 5`} role="img">
      {stars.map((n) => {
        const filled = n <= full;
        const half = !filled && n === full + 1 && hasHalf;
        return (
          <div key={n} className="relative" style={{ width: size, height: size }}>
            <Star className="text-gray-200 fill-gray-200 absolute inset-0" style={{ width: size, height: size }} />
            {(filled || half) && (
              <div className={`absolute inset-0 overflow-hidden ${half ? 'w-1/2' : 'w-full'}`}>
                 <Star className="text-yellow-400 fill-yellow-400" style={{ width: size, height: size }} />
              </div>
            )}
          </div>
        );
      })}
      {showNumber && <span className="ml-2 text-sm font-bold text-gray-700">{value.toFixed(1)}</span>}
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
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 pb-20">
      <Header
        title="Traveler Reviews"
        onBack={() => showScreen('dashboard')}
        showProfileIcon={true}
        showScreen={showScreen}
        profile={profile}
      />

      <div className="p-6 flex-1 max-w-7xl mx-auto w-full">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
                <h2 className="text-3xl font-bold text-gray-900">Community Stories</h2>
                <p className="text-gray-500 mt-1">See where others have been and what they recommend.</p>
            </div>
            <button
                className="
                    group relative overflow-hidden rounded-[20px] 
                    bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 
                    bg-[length:200%_auto] px-6 py-3 shadow-lg shadow-indigo-500/30 
                    transition-all duration-500 
                    hover:bg-right hover:shadow-xl hover:shadow-purple-500/40 hover:-translate-y-0.5 
                    active:scale-[0.98]
                "
                onClick={() => showScreen('addReview')}
            >
                <div className="relative flex items-center justify-center gap-2">
                    <Plus className="w-5 h-5 text-white" strokeWidth={3} />
                    <span className="text-base font-bold text-white tracking-wide">Write a Review</span>
                </div>
            </button>
        </div>

        {loading && (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <Loader2 className="w-10 h-10 animate-spin text-purple-500 mb-3" />
            <p>Loading reviews...</p>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 flex items-center justify-center">
            {error}
          </div>
        )}

        {!loading && !error && reviews.length === 0 && (
          <div className="text-center py-20 bg-white/60 rounded-[32px] border border-white/50 shadow-sm">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                <MessageSquare className="w-8 h-8" />
            </div>
            <p className="text-gray-900 font-bold text-lg mb-1">No reviews yet</p>
            <p className="text-gray-500">Be the first to share your experience!</p>
          </div>
        )}

        {/* Review Grid */}
        {!loading && !error && reviews.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="
                    group bg-white rounded-[24px] p-5 
                    shadow-sm border border-gray-100 
                    hover:shadow-xl hover:shadow-purple-500/5 hover:border-purple-100 
                    transition-all duration-300 cursor-pointer flex flex-col h-full
                "
                onClick={() => setSelectedReview(review)}
              >
                {/* Header: Author */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="relative">
                    {review.profiles?.profile_pic ? (
                        <Image
                        src={review.profiles.profile_pic}
                        alt="Avatar"
                        width={40}
                        height={40}
                        className="w-10 h-10 rounded-full object-cover ring-2 ring-white shadow-sm"
                        />
                    ) : (
                        <div
                        className="w-10 h-10 rounded-full text-white flex items-center justify-center text-sm font-bold shadow-sm"
                        style={{ backgroundColor: review.profiles?.avatar_bg || '#a855f7' }}
                        >
                        {review.profiles ? review.profiles.first_name[0].toUpperCase() : <User className="w-5 h-5" />}
                        </div>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-gray-900 leading-none">
                        {review.profiles
                        ? `${review.profiles.first_name} ${review.profiles.last_name}`
                        : 'Anonymous'}
                    </span>
                    <span className="text-[11px] text-gray-400 mt-1 flex items-center gap-1">
                        {formatTimeAgo(review.created_at)}
                    </span>
                  </div>
                </div>

                {/* Image Thumbnail - Using object-cover for uniform grid */}
                {review.image_path && (
                  <div className="relative w-full h-48 mb-4 rounded-2xl overflow-hidden bg-gray-100">
                    <Image
                      src={review.image_path}
                      alt="Review image"
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )}

                {/* Content */}
                <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="font-bold text-gray-900 line-clamp-1 text-lg group-hover:text-purple-700 transition-colors">
                            {review.title}
                        </h3>
                    </div>
                    
                    <div className="mb-3">
                        <StarRow value={review.rating} />
                    </div>

                    <p className="text-gray-600 text-sm line-clamp-3 mb-4 leading-relaxed">
                        {review.description_text}
                    </p>
                </div>

                {/* Footer: Location */}
                {review.place_title && (
                  <div className="mt-auto pt-4 border-t border-gray-50 flex items-center text-xs text-purple-600 font-medium gap-1.5">
                    <MapPin className="w-3.5 h-3.5" />
                    <span className="truncate">{review.place_title}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal for Selected Review */}
      {selectedReview && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity"
            onClick={() => setSelectedReview(null)}
          />
          
          <div className="bg-white rounded-[32px] max-w-2xl w-full p-0 relative shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
            
            {/* Close Button */}
            <button
              onClick={() => setSelectedReview(null)}
              className="absolute top-4 right-4 z-50 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full backdrop-blur-md transition-colors border border-white/20"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Image Hero (Smart Vertical Handling) */}
            {selectedReview.image_path && (
                <div className="relative w-full h-72 md:h-96 bg-gray-900 shrink-0 overflow-hidden">
                    
                    {/* 1. Blurred Background Layer (Fills width) */}
                    <div className="absolute inset-0 opacity-60">
                       <Image
                           src={selectedReview.image_path}
                           alt="Background Ambience"
                           fill
                           className="object-cover blur-2xl scale-110"
                       />
                    </div>

                    {/* 2. Main Image Layer (Contained - shows full vertical image) */}
                    <div className="absolute inset-0 flex items-center justify-center p-4">
                        <div className="relative w-full h-full">
                            <Image
                                src={selectedReview.image_path}
                                alt="Review Highlight"
                                fill
                                className="object-contain drop-shadow-xl"
                            />
                        </div>
                    </div>

                    {/* 3. Gradient Overlay for Text Readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-10 pointer-events-none" />
                    
                    {/* 4. Overlay Text */}
                    <div className="absolute bottom-0 left-0 p-8 w-full z-20">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-3 shadow-sm leading-tight">{selectedReview.title}</h2>
                        <div className="flex items-center gap-3 text-white/95">
                            <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-2 border border-white/30">
                                <StarRow value={selectedReview.rating} size={18} />
                                <span className="text-sm font-bold">({selectedReview.rating.toFixed(1)})</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Content Body */}
            <div className={`p-8 overflow-y-auto ${!selectedReview.image_path ? 'pt-12' : ''}`}>
                
                {!selectedReview.image_path && (
                    <div className="mb-6">
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">{selectedReview.title}</h2>
                        <StarRow value={selectedReview.rating} size={24} showNumber />
                    </div>
                )}

                {/* Author Info */}
                <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        {selectedReview.profiles?.profile_pic ? (
                            <Image
                            src={selectedReview.profiles.profile_pic}
                            alt="Author"
                            width={48}
                            height={48}
                            className="w-12 h-12 rounded-full object-cover ring-2 ring-purple-50 shadow-sm"
                            />
                        ) : (
                            <div className="w-12 h-12 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold">
                                <User className="w-6 h-6" />
                            </div>
                        )}
                        <div>
                            <p className="font-bold text-gray-900 text-base">
                                {selectedReview.profiles 
                                    ? `${selectedReview.profiles.first_name} ${selectedReview.profiles.last_name}`
                                    : 'Anonymous'}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                                <Clock className="w-3.5 h-3.5" />
                                {formatTimeAgo(selectedReview.created_at)}
                            </div>
                        </div>
                    </div>
                </div>

                <p className="text-gray-700 text-lg leading-relaxed mb-8 whitespace-pre-line font-medium">
                    {selectedReview.description_text}
                </p>

                {selectedReview.map_link && (
                  <a
                    href={selectedReview.map_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="
                        flex items-center justify-center gap-2 w-full py-4 
                        bg-gray-50 hover:bg-gray-100 border border-gray-200 
                        rounded-2xl text-gray-700 font-bold transition-colors
                        active:scale-[0.98]
                    "
                  >
                    <MapPin className="w-5 h-5 text-purple-600" />
                    <span>{selectedReview.place_title || 'View Location on Maps'}</span>
                    <ExternalLink className="w-4 h-4 ml-1 opacity-50" />
                  </a>
                )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewsScreen;