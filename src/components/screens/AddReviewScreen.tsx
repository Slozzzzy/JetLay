// src/components/screens/AddReviewScreen.tsx
import React, { useState } from 'react';
import Header from '@/components/core/Header';
import { ScreenProps } from '@/types';
import { Star, X } from 'lucide-react';
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

  // เลือก icon ตามค่า
  const getIcon = (index: number) => {
    const diff = current - index;

    if (diff >= 0) return <Star className="w-7 h-7 fill-yellow-400 text-yellow-400" />;
    // if (diff >= -0.5) return <StarHalf className="w-7 h-7 text-yellow-400" />;
    return <Star className="w-7 h-7 text-gray-300" />;
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
    const selectedFiles = Array.from(e.target.files ?? []);
    
    // Validate file types
    const invalidFiles = selectedFiles.filter(file => !file.type.startsWith('image/'));
    if (invalidFiles.length > 0) {
      setError('Please select only image files');
      return;
    }

    // Validate file sizes (max 5MB each)
    const maxSize = 5 * 1024 * 1024;
    const oversizedFiles = selectedFiles.filter(file => file.size > maxSize);
    if (oversizedFiles.length > 0) {
      setError('Each image must be less than 5MB');
      return;
    }
    
    // Create preview URLs
    const newPreviews = selectedFiles.map(file => URL.createObjectURL(file));
    
    setFiles(selectedFiles);
    setPreviews(newPreviews);
    setError(null);
  };

  const removeFile = (index: number) => {
    // Revoke the preview URL to free memory
    URL.revokeObjectURL(previews[index]);
    
    setFiles(files.filter((_, i) => i !== index));
    setPreviews(previews.filter((_, i) => i !== index));
  };

  const uploadImagesToSupabase = async (files: File[]): Promise<string[]> => {
    const uploadedUrls: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      setUploadProgress(`Uploading image ${i + 1} of ${files.length}...`);

      // Create form data
      const formData = new FormData();
      formData.append('file', file);

      // Upload to our API endpoint
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
      // Upload images first if any
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
          Authorization: `Bearer ${token}`, // MUST pass this
        },
        body: JSON.stringify({
          title: title.trim(),
          rating,
          description_text: experienceText.trim(),
          map_link: mapLink.trim() || null,
          image_path: imageUrls.length > 0 ? imageUrls[0] : null, // single image
        }),
      });


      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to post review');
      }

      // Clean up preview URLs
      previews.forEach(url => URL.revokeObjectURL(url));

      // Success - redirect to reviews screen
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
          {error && (
            <div className="mb-5 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          {uploadProgress && (
            <div className="mb-5 p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-700 text-sm">
              {uploadProgress}
            </div>
          )}

          <div className="mb-5">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title (e.g., Bangkok → Paris)"
              className="w-full p-3 border border-gray-300 rounded-lg h-12"
              disabled={isSubmitting}
            />
          </div>

          <StarRating value={rating} onChange={setRating} label="Your rating" />

          {/* Experience */}
          <div className="mb-5">
            <textarea
              value={experienceText}
              onChange={(e) => setExperienceText(e.target.value)}
              placeholder="Your experience...."
              className="w-full p-3 border border-gray-300 rounded-lg min-h-[150px]"
              disabled={isSubmitting}
            />
          </div>

          <div className="mb-5">
            <input
              type="url"
              value={mapLink}
              onChange={(e) => setMapLink(e.target.value)}
              placeholder="Google Map place link (optional)"
              className="w-full p-3 border border-gray-300 rounded-lg h-12"
              disabled={isSubmitting}
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-900 mb-2">Attach photos</label>
            
            {/* Image Previews */}
            {previews.length > 0 && (
              <div className="grid grid-cols-2 gap-3 mb-3">
                {previews.map((preview, index) => (
                  <div key={index} className="relative group">
                    <Image
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      width={200}
                      height={150}
                      className="w-full h-32 object-cover rounded-lg border border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      disabled={isSubmitting}
                      className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center space-x-3">
              <label
                htmlFor="reviewFile"
                className={`px-4 py-2 bg-gray-200 text-gray-900 font-semibold rounded-lg cursor-pointer hover:bg-gray-300 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                Choose Files
              </label>
              <input
                type="file"
                multiple
                accept="image/*"
                id="reviewFile"
                className="hidden"
                onChange={handleFileChange}
                disabled={isSubmitting}
              />
            </div>
          </div>

          <button
            className={`w-full py-3 text-white font-bold rounded-xl shadow-lg transition ${
              canPost && !isSubmitting ? 'opacity-100 hover:opacity-90' : 'opacity-60 cursor-not-allowed'
            }`}
            style={{ background: 'linear-gradient(90deg, #d8b4fe, #fbcfe8)', color: '#1e1b4b' }}
            onClick={handlePost}
            disabled={!canPost || isSubmitting}
          >
            {isSubmitting ? 'Posting...' : 'Post Review'}
          </button>

        </div>
      </div>
    </div>
  );
};

export default AddReviewScreen;