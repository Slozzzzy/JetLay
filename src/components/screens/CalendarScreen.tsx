import React from 'react';
import Header from '@/components/core/Header';
import { ScreenProps } from '@/types';

const CalendarScreen: React.FC<ScreenProps> = ({
  showScreen,
  showAlert: _showAlert, // unused
  profile,
}) => {
  // Read embed URL from env OR fallback to placeholder
  const calendarEmbedUrl =
    process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_EMBED_URL ||
    'https://calendar.google.com/calendar/embed?src=YOUR_CALENDAR_ID&ctz=Asia%2FBangkok';

  return (
    <div className="flex flex-col min-h-screen bg-purple-50 pb-20">
      <Header
        title="Travel Calendar"
        onBack={() => showScreen('dashboard')}
        showProfileIcon={true}
        showScreen={showScreen}
        profile={profile}
      />

      <div className="p-6 flex-1 max-w-5xl mx-auto w-full">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Google Calendar (Synced Deadlines)
        </h3>

        <div className="w-full aspect-[4/3] max-h-[600px]">
          <iframe
            src={calendarEmbedUrl}
            className="w-full h-full border-0 rounded-xl shadow-lg"
            frameBorder={0}
            scrolling="no"
          />
        </div>
      </div>
    </div>
  );
};

export default CalendarScreen;
