// src/components/screens/UserProfileScreen.tsx
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { supabase } from '@/lib/supabaseClient';
import type { Profile, ScreenProps } from '@/types';

interface UserProfileProps extends ScreenProps {
  handleSignOut: () => void;
}

const UserProfileScreen: React.FC<UserProfileProps> = ({ showScreen, showAlert, profile, setProfile, handleSignOut }) => {
    // Local state to manage form changes before saving
    const [localProfile, setLocalProfile] = useState<Profile | null>(profile);
    const [loading, setLoading] = useState(!profile); 

    useEffect(() => {
        setLocalProfile(profile ?? null);
        setLoading(!profile);
    }, [profile]);


    useEffect(() => {
    if (profile) return; // Alredy have profile

        let cancelled = false;
        (async () => {
            setLoading(true);

            // Fetch profile from server endpoint which reads HttpOnly cookies
            try {
                const resp = await fetch('/api/profile');
                if (!resp.ok) {
                    const json = await resp.json().catch(() => ({}));
                    console.error('profile fetch failed', json);
                    showAlert(json.error || 'Cannot load your profile.', 'error');
                    setLoading(false);
                    return;
                }

                const { profile: data } = await resp.json();
                if (cancelled) return;

                setLocalProfile(data);
                setProfile(data);
                setLoading(false);
            } catch (err) {
                console.error('profile fetch error', err);
                showAlert('Cannot load your profile.', 'error');
                setLoading(false);
            }
        })();

    return () => { cancelled = true; };
  }, [profile, setProfile, showAlert]);

  if (loading || !localProfile) {
    return <div className="p-6 text-center text-gray-600">Loading profile...</div>;
  }

    const handleUpdateProfile = async () => {
        if (!localProfile) return;
        setLoading(true);

        try {
            const resp = await fetch('/api/profile', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
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
                showAlert(json.error || 'Failed to update profile!', 'error');
                setLoading(false);
                return;
            }

            const updated = json.profile ?? localProfile;
            setLocalProfile(updated);
            setProfile(updated);
            showAlert('Profile Saved!', 'success');
        } catch (err) {
            console.error('update error', err);
            showAlert('Failed to update profile!', 'error');
        } finally {
            setLoading(false);
        }
    };
    
    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !localProfile?.id) return;

        try {
            const fileExt = file.name.split('.').pop();
            const filePath = `avatars/${localProfile.id}.${fileExt}`;

            const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file, { upsert: true });
            if (uploadError) throw uploadError;

            const { data: publicURLData } = supabase.storage.from('avatars').getPublicUrl(filePath);
            const publicURL = publicURLData.publicUrl;

                        // Update profile on the server (uses HttpOnly cookies)
                        const updResp = await fetch('/api/profile', {
                            method: 'PATCH',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ avatar_url: publicURL }),
                        });
                        const updJson = await updResp.json().catch(() => ({}));
                        if (!updResp.ok) throw updJson;
            
            // Update both local and main state
            const updatedProfile = { ...localProfile, avatar_url: publicURL };
            setLocalProfile(updatedProfile);
            setProfile(updatedProfile);
            showAlert('Profile picture updated!', "success");
        } catch (_error){
            showAlert('Failed to upload image.', "error");
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-purple-50 p-6 justify-center items-center">
            <div className="w-full max-w-md">
                <div className="relative mb-6 text-center">
                    <button className="absolute top-1 left-0 text-gray-600 font-semibold flex items-center" onClick={() => showScreen('dashboard')}>
                    &larr; Back
                    </button>
                    <h1 className="text-3xl font-bold text-gray-900">User Profile</h1>
                </div>

                <div className="flex justify-center mb-6">
                    {localProfile.avatar_url ? (
                    <Image src={localProfile.avatar_url} alt="Profile" width={120} height={120} className="w-32 h-32 rounded-full object-cover shadow-lg" />
                    ) : (
                    <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center text-gray-400 text-6xl">👤</div>
                    )}
                </div>

                <input type="text" placeholder="First Name" value={localProfile.first_name || ''} onChange={(e) => setLocalProfile({ ...localProfile, first_name: e.target.value })} className="w-full p-4 mb-4 border border-gray-300 rounded-lg" />
                <input type="text" placeholder="Last Name" value={localProfile.last_name || ''} onChange={(e) => setLocalProfile({ ...localProfile, last_name: e.target.value })} className="w-full p-4 mb-4 border border-gray-300 rounded-lg" />
                <input type="date" placeholder="Birth Date" value={localProfile.birth_date || ''} onChange={(e) => setLocalProfile({ ...localProfile, birth_date: e.target.value })} className="w-full p-4 mb-6 border border-gray-300 rounded-lg" />
                <input type="tel" placeholder="Phone Number" value={localProfile.phone || ''} onChange={(e) => setLocalProfile({ ...localProfile, phone: e.target.value })} className="w-full p-4 mb-6 border border-gray-300 rounded-lg" />

                <div className="flex items-center justify-between w-full p-4 mb-8 border border-gray-300 rounded-lg">
                    <label className="text-gray-500">Profile Picture</label>
                    <label htmlFor="profilePicture" className="px-4 py-2 bg-gray-200 text-gray-900 font-semibold rounded-lg cursor-pointer hover:bg-gray-300">Choose File</label>
                    <input type="file" id="profilePicture" accept=".jpg,.jpeg,.png" className="hidden" onChange={handleAvatarUpload} />
                </div>

                <button className="w-full py-4 text-white font-bold text-lg rounded-full shadow-lg" style={{ background: 'linear-gradient(90deg, #a78bfa, #f472b6)' }} onClick={handleUpdateProfile}>
                    Save Changes
                </button>
                
                <button className="w-full py-3 mt-4 bg-red-600 text-white font-bold rounded-xl shadow-md hover:bg-red-700" onClick={handleSignOut}>
                    Log Out
                </button>
            </div>
        </div>
    );
};

export default UserProfileScreen;