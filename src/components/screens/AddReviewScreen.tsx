// src/components/screens/AddReviewScreen.tsx
import React, { useState } from 'react';
import Header from '@/components/core/Header';
import { ScreenProps } from '@/types';
import { 
  Star, 
  X, 
  MapPin, 
  Image as ImageIcon, 
  Loader2, 
  Send, 
  UploadCloud, 
  Type,
  FileText
} from 'lucide-react';
import Image from 'next/image';
import { supabase } from '@/lib/supabaseClient';

type StarRatingProps = {
  value: number;
  onChange: (v: number) => void;
  label?: string;
};

const StarRating: React.FC<StarRatingProps> = ({ value, onChange, label = 'Rating' }) => {
  const [hover, setHover] = useState<number | null>(null);
  const current = hover ?? value;
  const stars = [1, 2, 3, 4, 5];

  const getIcon = (index: number) => {
    const diff = current - index;
    // Simplified logic: if current rating covers this star, show full.
    if (diff >= 0) return <Star className="w-8 h-8 fill-yellow-400 text-yellow-400 drop-shadow-sm" />;
    return <Star className="w-8 h-8 text-gray-300 fill-gray-50" />;
  };

  const handleClick = (index: number) => {
    // Direct integer setting. No 0.5 logic.
    onChange(index);
  };

  return (
    <div className="mb-6 flex flex-col items-center">
      <label className="block text-sm font-bold text-gray-600 mb-2 uppercase tracking-wider">{label}</label>

      <div className="flex items-center gap-1 bg-white p-2 rounded-2xl border border-gray-100 shadow-sm">
        {stars.map((n) => (
          <div
            key={n}
            className="cursor-pointer transition-transform hover:scale-110 active:scale-95 p-1"
            onMouseEnter={() => setHover(n)}
            onMouseLeave={() => setHover(null)}
            onClick={() => handleClick(n)}
          >
            {getIcon(n)}
          </div>
        ))}
      </div>
      
      <div className="h-6 mt-1">
        {current > 0 && (
            <span className="text-sm font-bold text-purple-600 bg-purple-50 px-3 py-0.5 rounded-full">
            {current} / 5
            </span>
        )}
      </div>
    </div>
  );
};

const AddReviewScreen: React.FC<ScreenProps> = ({ showScreen, profile }) => {
  const [title, setTitle] = useState('');
  const [experienceText, setExperienceText] = useState('');
  const [mapLink, setMapLink] = useState('');
  const [rating, setRating] = useState<number>(0);
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const canPost = title.trim().length > 0 && experienceText.trim().length > 0 && rating > 0;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Take only the first file
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setError('Image must be less than 5MB');
      return;
    }
    
    // Clear old preview if it exists (since we only allow 1)
    if (previews.length > 0) {
        URL.revokeObjectURL(previews[0]);
    }

    const newPreview = URL.createObjectURL(file);
    
    // Replace state with single file
    setFiles([file]);
    setPreviews([newPreview]);
    setError(null);
  };

  const removeFile = (index: number) => {
    URL.revokeObjectURL(previews[index]);
    setFiles([]);
    setPreviews([]);
  };

  const uploadImagesToSupabase = async (files: File[]): Promise<string[]> => {
    const uploadedUrls: string[] = [];

    // Logic remains generic in case you want to revert later, but files array will only have 1 item
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      setUploadProgress(`Uploading image...`);

      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to upload image');
      }

      const data = await response.json();
      uploadedUrls.push(data.url);
    }

    setUploadProgress('');
    return uploadedUrls;
  };

  const handlePost = async () => {
    if (!canPost || isSubmitting) return;

    setIsSubmitting(true);
    setError(null);
    setUploadProgress('');

    try {
      let imageUrls: string[] = [];
      if (files.length > 0) {
        imageUrls = await uploadImagesToSupabase(files);
      }

      setUploadProgress('Creating review...');

      const session = await supabase.auth.getSession();
      const token = session?.data?.session?.access_token;

      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: title.trim(),
          rating,
          description_text: experienceText.trim(),
          map_link: mapLink.trim() || null,
          image_path: imageUrls.length > 0 ? imageUrls[0] : null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to post review');
      }

      previews.forEach(url => URL.revokeObjectURL(url));
      showScreen('reviews');
    } catch (err) {
      console.error('Error posting review:', err);
      setError(err instanceof Error ? err.message : 'Failed to post review');
    } finally {
      setIsSubmitting(false);
      setUploadProgress('');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 pb-20">
      <Header
        title="Add Review"
        onBack={() => showScreen('reviews')}
        showProfileIcon
        showScreen={showScreen}
        profile={profile}
      />

      <div className="p-6 flex-1 max-w-2xl mx-auto w-full">
        
        {/* Glass Container */}
        <div className="bg-white/80 backdrop-blur-xl rounded-[32px] p-8 shadow-2xl ring-1 ring-white/60">
          
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Share Your Journey</h2>
            <p className="text-gray-500 text-sm mt-1">Help others discover amazing places.</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm font-medium flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                {error}
            </div>
          )}

          {uploadProgress && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-100 rounded-2xl text-blue-600 text-sm font-medium flex items-center gap-3">
                <Loader2 className="w-4 h-4 animate-spin" />
                {uploadProgress}
            </div>
          )}

          {/* Star Rating - Prominent */}
          <StarRating value={rating} onChange={setRating} label="How was it?" />

          <div className="space-y-5">
            
            {/* Title Input */}
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Type className="h-5 w-5 text-gray-400" />
                </div>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Title (e.g., Hidden Gem in Paris)"
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl border-0 ring-1 ring-gray-200 bg-gray-50 text-gray-900 placeholder:text-gray-400 focus:bg-white focus:ring-2 focus:ring-purple-500 transition-all outline-none font-medium"
                    disabled={isSubmitting}
                />
            </div>

            {/* Experience Textarea */}
            <div className="relative">
                <div className="absolute top-3.5 left-4 pointer-events-none">
                    <FileText className="h-5 w-5 text-gray-400" />
                </div>
                <textarea
                    value={experienceText}
                    onChange={(e) => setExperienceText(e.target.value)}
                    placeholder="Tell us about your experience..."
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl border-0 ring-1 ring-gray-200 bg-gray-50 text-gray-900 placeholder:text-gray-400 focus:bg-white focus:ring-2 focus:ring-purple-500 transition-all outline-none font-medium min-h-[150px] resize-none"
                    disabled={isSubmitting}
                />
            </div>

            {/* Map Link Input */}
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <MapPin className="h-5 w-5 text-gray-400" />
                </div>
                <input
                    type="url"
                    value={mapLink}
                    onChange={(e) => setMapLink(e.target.value)}
                    placeholder="Google Maps Link (Optional)"
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl border-0 ring-1 ring-gray-200 bg-gray-50 text-gray-900 placeholder:text-gray-400 focus:bg-white focus:ring-2 focus:ring-purple-500 transition-all outline-none font-medium"
                    disabled={isSubmitting}
                />
            </div>

            {/* Photo Upload Section */}
            <div className="pt-2">
                <label className="flex items-center gap-2 text-sm font-bold text-gray-600 mb-3 ml-1">
                    <ImageIcon className="w-4 h-4 text-purple-500" />
                    PHOTO (Max 1)
                </label>
                
                {/* If a file is selected, show large preview. Else show upload box. */}
                {previews.length > 0 ? (
                    <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-gray-200 shadow-sm group">
                        <Image
                            src={previews[0]}
                            alt="Preview"
                            fill
                            className="object-cover"
                        />
                        <button
                            type="button"
                            onClick={() => removeFile(0)}
                            disabled={isSubmitting}
                            className="absolute top-2 right-2 bg-black/50 text-white p-1.5 rounded-full hover:bg-red-500 transition-colors backdrop-blur-sm"
                        >
                            <X size={18} />
                        </button>
                    </div>
                ) : (
                    <label className={`
                        flex flex-col items-center justify-center w-full aspect-video rounded-xl border-2 border-dashed border-gray-300 
                        cursor-pointer bg-gray-50 hover:bg-gray-100 hover:border-purple-400 transition-all
                        ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}
                    `}>
                        <div className="p-4 bg-white rounded-full shadow-sm mb-3">
                            <UploadCloud className="w-8 h-8 text-purple-600" />
                        </div>
                        <span className="text-sm font-bold text-gray-600">Click to upload a photo</span>
                        <span className="text-xs text-gray-400 mt-1">JPG, PNG (Max 5MB)</span>
                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleFileChange}
                            disabled={isSubmitting}
                        />
                    </label>
                )}
            </div>
          </div>

          {/* Submit Button */}
          <button
            className="
                group relative w-full overflow-hidden rounded-xl mt-6
                bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 
                bg-[length:200%_auto] p-4 shadow-lg shadow-indigo-500/20 
                transition-all duration-500 
                hover:bg-right hover:shadow-xl hover:shadow-purple-500/30 hover:-translate-y-0.5 
                active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed
            "
            onClick={handlePost}
            disabled={!canPost || isSubmitting}
          >
            <div className="relative flex items-center justify-center gap-2">
                {isSubmitting ? (
                    <>
                        <Loader2 className="w-5 h-5 text-white animate-spin" />
                        <span className="text-lg font-bold text-white">Posting...</span>
                    </>
                ) : (
                    <>
                        <Send className="w-5 h-5 text-white" />
                        <span className="text-lg font-bold text-white tracking-wide">Post Review</span>
                    </>
                )}
            </div>
          </button>

        </div>
      </div>
    </div>
  );
};

export default AddReviewScreen;