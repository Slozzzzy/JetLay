// src/components/screens/UserProfileScreen.tsx
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { supabase } from '@/lib/supabaseClient';
import type { Profile, ScreenProps } from '@/types';
import { 
  Camera, 
  User, 
  Phone, 
  Calendar, 
  LogOut, 
  CheckCircle,
  ChevronLeft,
  Loader2,
  AlertCircle
} from 'lucide-react';

interface UserProfileProps extends ScreenProps {
  handleSignOut: () => void;
}

const getAccessToken = async () => {
  const { data, error } = await supabase.auth.getSession();
  if (error || !data.session) return null;
  return data.session.access_token;
};

const UserProfileScreen: React.FC<UserProfileProps> = ({ showScreen, showAlert, profile, setProfile, handleSignOut }) => {
    // Local state to manage form changes before saving
    const [localProfile, setLocalProfile] = useState<Profile | null>(profile);
    const [loading, setLoading] = useState(!profile); 
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        setLocalProfile(profile ?? null);
        setLoading(!profile);
    }, [profile]);


    // ---------- LOAD PROFILE FROM API ----------
    useEffect(() => {
    if (profile) return; // Already have profile

        let cancelled = false;
        (async () => {
            setLoading(true);

            // Fetch profile from server endpoint which reads HttpOnly cookies
            try {
                const token = await getAccessToken();
                if (!token) {
                    if (!cancelled) {
                        showAlert?.('Not authenticated', 'error');
                        handleSignOut();
                    }
                    return;
                }

                const resp = await fetch('/api/profile', {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                },
            });

                const json: { profile?: Profile; error?: string } =
                    await resp.json().catch(() => ({}) as { profile?: Profile; error?: string });

                if (!resp.ok) {
                    console.error('profile fetch failed', json);
                    if (!cancelled) {
                        showAlert?.(json.error || 'Cannot load your profile.', 'error');
                        setLoading(false);
                    }
                    return;
                }

                 const data = json.profile as Profile | null;
                if (cancelled || !data) {
                    setLoading(false);
                    return;
                }

                setLocalProfile(data);
                setProfile(data);
                setLoading(false);
            } catch (err) {
                console.error('profile fetch error', err);
                if (!cancelled) {
                    showAlert?.('Cannot load your profile.', 'error');
                    setLoading(false);
                }
            }
        })();

    return () => { cancelled = true; };
  }, [profile, setProfile, showAlert, handleSignOut]);

  if (loading || !localProfile) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-purple-50 text-gray-500 gap-3">
             <Loader2 className="w-10 h-10 animate-spin text-purple-600" />
             <p className="font-medium">Loading profile...</p>
        </div>
    );
  }

    // ---------- SAVE PROFILE ----------
    const handleUpdateProfile = async () => {
        if (!localProfile) return;
        setSaving(true);

        try {
            const token = await getAccessToken();
            if (!token) {
                showAlert?.('Not authenticated', 'error');
                return;
            }

            const resp = await fetch('/api/profile', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    first_name: localProfile.first_name,
                    last_name: localProfile.last_name,
                    phone: localProfile.phone,
                    birth_date: localProfile.birth_date,
                }),
            });

            const json = await resp.json().catch(() => ({}));
            if (!resp.ok) {
                console.error('profile update failed', json);
                showAlert?.(json.error || 'Failed to update profile!', 'error');
                return;
            }

            const updated = json.profile ?? localProfile;
            setLocalProfile(updated);
            setProfile(updated);
            showAlert?.('Profile Saved!', 'success');
        } catch (err) {
            console.error('update error', err);
            showAlert?.('Failed to update profile!', 'error');
        } finally {
            setSaving(false);
        }
    };
    
    // ---------- AVATAR UPLOAD ----------
    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !localProfile?.id) return;

        try {
            // upload to Supabase Storage (uses current auth session)
            const fileExt = file.name.split('.').pop();
            const filePath = `avatars/${localProfile.id}.${fileExt}`;

            const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file, { upsert: true });
            if (uploadError) throw uploadError;

            const { data: publicURLData } = supabase.storage.from('avatars').getPublicUrl(filePath);
            const publicURL = publicURLData.publicUrl;


            // update avatar_url via API (with token)
            const token = await getAccessToken();
                if (!token) {
                    showAlert?.('Not authenticated', 'error');
                    return;
                }

            // Update profile on the server (uses HttpOnly cookies)
            const updResp = await fetch('/api/profile', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' ,
                Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ avatar_url: publicURL }),
            });
            const updJson = await updResp.json().catch(() => ({}));
                if (!updResp.ok) {
                    console.error('avatar profile update failed', updJson);
                    throw new Error(updJson.error || 'Failed to update avatar URL');
                }
            
            // Update both local and main state
            const updatedProfile = { ...localProfile, avatar_url: publicURL };
            setLocalProfile(updatedProfile);
            setProfile(updatedProfile);
            showAlert?.('Profile picture updated!', "success");
        } catch (error){
            console.error('avatar upload error', error);
            showAlert?.('Failed to upload image.', "error");
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 pb-10">
            
            {/* Header Area */}
            <div className="relative pt-6 px-6 mb-6 flex items-center justify-between">
                <button 
                    onClick={() => showScreen('dashboard')}
                    className="p-3 rounded-full bg-white/80 hover:bg-white shadow-sm border border-white/50 transition-all text-gray-700"
                >
                    <ChevronLeft className="w-6 h-6" />
                </button>
                <h1 className="text-2xl font-bold text-gray-800">Edit Profile</h1>
                <div className="w-12" /> {/* Spacer to center title */}
            </div>

            <div className="flex-1 px-6 max-w-lg mx-auto w-full flex flex-col items-center">
                
                {/* Avatar Section */}
                <div className="relative group mb-8">
                    <div className="w-36 h-36 rounded-full p-1 bg-gradient-to-br from-purple-400 to-pink-400 shadow-xl">
                        <div className="w-full h-full rounded-full overflow-hidden bg-white relative">
                            {localProfile.avatar_url ? (
                                <Image src={localProfile.avatar_url} alt="Profile" fill className="object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-300">
                                    <User className="w-16 h-16" />
                                </div>
                            )}
                        </div>
                    </div>
                    
                    {/* Camera Button Overlay */}
                    <label 
                        htmlFor="profilePicture" 
                        className="absolute bottom-1 right-1 p-2.5 bg-gray-900 text-white rounded-full shadow-lg cursor-pointer hover:bg-gray-800 hover:scale-105 transition-all border-2 border-white"
                    >
                        <Camera className="w-5 h-5" />
                        <input type="file" id="profilePicture" accept=".jpg,.jpeg,.png" className="hidden" onChange={handleAvatarUpload} />
                    </label>
                </div>

                {/* Form Container */}
                <div className="w-full bg-white/80 backdrop-blur-xl rounded-[32px] p-8 shadow-2xl ring-1 ring-white/60 space-y-5">
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase ml-1">First Name</label>
                            <input 
                                type="text" 
                                value={localProfile.first_name || ''} 
                                onChange={(e) => setLocalProfile({ ...localProfile, first_name: e.target.value })} 
                                className="w-full rounded-xl bg-gray-50 border-0 px-4 py-3 text-gray-900 font-semibold focus:bg-white focus:ring-2 focus:ring-purple-500 transition-all outline-none"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Last Name</label>
                            <input 
                                type="text" 
                                value={localProfile.last_name || ''} 
                                onChange={(e) => setLocalProfile({ ...localProfile, last_name: e.target.value })} 
                                className="w-full rounded-xl bg-gray-50 border-0 px-4 py-3 text-gray-900 font-semibold focus:bg-white focus:ring-2 focus:ring-purple-500 transition-all outline-none"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase ml-1 flex items-center gap-1">
                            <Calendar className="w-3 h-3" /> Birth Date
                        </label>
                        <input 
                            type="date" 
                            value={localProfile.birth_date || ''} 
                            onChange={(e) => setLocalProfile({ ...localProfile, birth_date: e.target.value })} 
                            className="w-full rounded-xl bg-gray-50 border-0 px-4 py-3 text-gray-900 font-medium focus:bg-white focus:ring-2 focus:ring-purple-500 transition-all outline-none"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase ml-1 flex items-center gap-1">
                            <Phone className="w-3 h-3" /> Phone Number
                        </label>
                        <input 
                            type="tel" 
                            value={localProfile.phone || ''} 
                            onChange={(e) => setLocalProfile({ ...localProfile, phone: e.target.value })} 
                            className="w-full rounded-xl bg-gray-50 border-0 px-4 py-3 text-gray-900 font-medium focus:bg-white focus:ring-2 focus:ring-purple-500 transition-all outline-none"
                        />
                    </div>

                    {/* Actions */}
                    <div className="pt-4 space-y-3">
                        <button 
                            onClick={handleUpdateProfile}
                            disabled={saving}
                            className="
                                group relative w-full overflow-hidden rounded-[24px] 
                                bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 
                                bg-[length:200%_auto] p-4 shadow-xl shadow-indigo-500/30 
                                transition-all duration-500 
                                hover:bg-right hover:shadow-2xl hover:shadow-purple-500/40 hover:-translate-y-1 
                                active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed
                            "
                        >
                            <div className="relative flex items-center justify-center gap-2">
                                {saving ? (
                                    <>
                                        <Loader2 className="w-5 h-5 text-white animate-spin" />
                                        <span className="text-lg font-bold text-white">Saving...</span>
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle className="w-5 h-5 text-white" />
                                        <span className="text-lg font-bold text-white tracking-wide">Save Changes</span>
                                    </>
                                )}
                            </div>
                        </button>
                        
                        <button 
                            onClick={handleSignOut}
                            className="w-full py-4 text-gray-500 font-bold hover:text-red-600 hover:bg-red-50 rounded-[24px] transition-colors flex items-center justify-center gap-2"
                        >
                            <LogOut className="w-5 h-5" />
                            Sign Out
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfileScreen;