// src/types/index.ts
export interface Profile {
  id: string;
  avatar_url?: string | null;
  phone?: string | null;
  birth_date?: string | null;
  created_at: string;
  updated_at: string;
  first_name?: string | null;
  last_name?: string | null;
}

// Props ทั่วไปที่ส่งจาก page.tsx ไปยัง screens ต่างๆ
export interface ScreenProps {
  showScreen: (screen: string) => void;
  showAlert: (message: string) => void;
  profile: Profile | null;
  setProfile: React.Dispatch<React.SetStateAction<Profile | null>>;
}