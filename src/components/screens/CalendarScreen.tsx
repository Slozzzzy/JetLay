// src/components/screens/CalendarScreen.tsx
import React from 'react';
import Header from '@/components/core/Header';
import { ScreenProps } from '@/types';
import { Calendar as CalendarIcon, ExternalLink, Plus, Clock } from 'lucide-react';

const CalendarScreen: React.FC<ScreenProps> = ({
  showScreen,
  profile,
}) => {
  // Read embed URL from env OR fallback to placeholder
  // Note: For a real app, you might want to dynamically generate this based on the user's email if using GCal integration
  const calendarEmbedUrl =
    process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_EMBED_URL ||
    'https://calendar.google.com/calendar/embed?src=en.th%23holiday%40group.v.calendar.google.com&ctz=Asia%2FBangkok';

  const handleOpenFullCalendar = () => {
    window.open('https://calendar.google.com/calendar/r', '_blank');
  };

  const handleAddEvent = () => {
    // Opens GCal "Create Event" page
    window.open('https://calendar.google.com/calendar/render?action=TEMPLATE&text=New+Trip+Deadline', '_blank');
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 pb-20">
      <Header
        title="Travel Calendar"
        onBack={() => showScreen('dashboard')}
        showProfileIcon={true}
        showScreen={showScreen}
        profile={profile}
      />

      <div className="p-6 flex-1 max-w-5xl mx-auto w-full flex flex-col justify-center">
        
        {/* Glassmorphism Container */}
        <div className="bg-white/80 backdrop-blur-xl rounded-[32px] p-8 shadow-2xl ring-1 ring-white/60 flex flex-col h-full">
            
            {/* Header Section inside Card */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
                             <CalendarIcon className="w-6 h-6" />
                        </div>
                        Your Schedule
                    </h2>
                    <p className="text-sm text-gray-500 mt-1 ml-1">
                        Track your visa deadlines, flights, and reminders.
                    </p>
                </div>

                {/* Add Event Button (Small) */}
                <button 
                    onClick={handleAddEvent}
                    className="flex items-center justify-center gap-2 px-5 py-3 bg-white border border-purple-200 text-purple-700 font-bold rounded-2xl shadow-sm hover:bg-purple-50 transition-all active:scale-95"
                >
                    <Plus className="w-5 h-5" />
                    <span>Add Event</span>
                </button>
            </div>

            {/* Calendar Iframe Container */}
            <div className="relative w-full flex-1 min-h-[500px] rounded-2xl overflow-hidden border border-gray-200 shadow-inner bg-white">
                 <iframe
                    src={calendarEmbedUrl}
                    className="absolute inset-0 w-full h-full"
                    frameBorder={0}
                    scrolling="no"
                    title="Google Calendar"
                 />
            </div>

            {/* Footer Action */}
            <div className="mt-6">
                 <button 
                    onClick={handleOpenFullCalendar}
                    className="
                        group relative w-full overflow-hidden rounded-[24px] 
                        bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 
                        bg-[length:200%_auto] p-4 shadow-xl shadow-indigo-500/30 
                        transition-all duration-500 
                        hover:bg-right hover:shadow-2xl hover:shadow-purple-500/40 hover:-translate-y-1 
                        active:scale-[0.98]
                    "
                >
                    <div className="relative flex items-center justify-center gap-3">
                        <ExternalLink className="w-5 h-5 text-white/90" />
                        <span className="text-lg font-bold text-white tracking-wide">
                            Open Full Google Calendar
                        </span>
                    </div>
                </button>
            </div>

        </div>
      </div>
    </div>
  );
};

export default CalendarScreen;