import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Header from '@/components/core/Header';
import { ScreenProps } from '@/types';
import {
  Plane,
  ArrowRight,
  TrendingDown,
  X,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/* Types                                                              */
/* ------------------------------------------------------------------ */
type Deal = {
  from: string;
  to: string;
  airline: string;
  tripType: 'One way' | 'Round trip';
  cabin: 'Economy' | 'Business' | 'Premium';
  dateText: string;
  priceTHB: number;
  discountPct?: number;
};

type RoundTrip = {
  days: number;
  rangeText: string;
  fromTo: string;
  priceTHB: number;
};

type Destination = {
  city: string;
  img: string;
  stats: string;
};

type Theme = 'vibrant' | 'pastel' | 'calm' | 'sunset' | 'black';

/* ------------------------------------------------------------------ */
/* Helpers                                                            */
/* ------------------------------------------------------------------ */
const formatTHB = (n: number) => `฿ ${n.toLocaleString('en-US')}`;

const getInitialTheme = (): Theme => {
  if (typeof window !== 'undefined') {
    const savedTheme = localStorage.getItem('jetlay_theme');
    if (savedTheme && ['vibrant', 'pastel', 'calm', 'sunset', 'black'].includes(savedTheme)) {
      return savedTheme as Theme;
    }
  }
  return 'vibrant';
};

const getInitialDarkMode = (): boolean => {
  if (typeof window !== 'undefined') {
    const savedTheme = localStorage.getItem('jetlay_theme');
    if (savedTheme === 'black') return true; 
    const savedMode = localStorage.getItem('jetlay_dark_mode');
    return savedMode === 'true';
  }
  return false;
};

/* ------------------------------------------------------------------ */
/* Ad Modal                                                           */
/* ------------------------------------------------------------------ */
const AdModal: React.FC<{
  open: boolean;
  onClose: () => void;
  onCTA?: () => void;
}> = ({ open, onClose, onCTA }) => {
  if (!open) return null;
  return (
    <div aria-modal role="dialog" className="fixed inset-0 z-[90] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative mx-4 w-full max-w-md overflow-hidden rounded-3xl bg-white/90 dark:bg-gray-900/90 backdrop-blur ring-1 ring-black/10 dark:ring-white/10 shadow-[0_20px_80px_rgba(0,0,0,0.25)]">
        <div className="h-2 w-full bg-gradient-to-r from-purple-600 via-fuchsia-500 to-pink-500" />
        <button
          onClick={onClose}
          className="absolute right-3 top-3 rounded-full bg-white/70 dark:bg-gray-700/70 p-1 text-gray-600 dark:text-gray-300 shadow ring-1 ring-black/10 hover:bg-white dark:hover:bg-gray-700 cursor-pointer"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="p-5">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-purple-50 dark:bg-purple-900 px-3 py-1 text-xs font-semibold text-purple-700 dark:text-purple-300 ring-1 ring-purple-200 dark:ring-purple-700">
            <Sparkles className="h-4 w-4" />
            New on JetLay
          </div>

          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
            Upgrade to{' '}
            <span className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
              Ultimate&nbsp;JetLay
            </span>
          </h3>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Auto reminders, 20GB secure storage, Google Calendar sync, and priority support.
          </p>

          <div className="mt-4 rounded-xl bg-gradient-to-br from-purple-100 via-pink-100 to-rose-100 dark:from-gray-700 dark:via-pink-800 dark:to-rose-800 p-3 ring-1 ring-black/5 dark:ring-white/10">
            <ul className="space-y-2 text-sm text-gray-800 dark:text-gray-200">
              <li>• Smart visa & passport expiry alerts</li>
              <li>• Share folders with travel companions</li>
              <li>• Document OCR & quick search</li>
            </ul>
          </div>

          <div className="mt-5 flex items-center gap-3">
            <button
              onClick={onCTA}
              className="flex-1 rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 px-4 py-2.5 text-center text-sm font-semibold text-white shadow hover:shadow-lg active:translate-y-px cursor-pointer"
            >
              Try 14 days free
            </button>
            <button
              onClick={onClose}
              className="rounded-xl px-4 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 ring-1 ring-black/10 dark:ring-white/10 cursor-pointer"
            >
              Not now
            </button>
          </div>

          <p className="mt-2 text-center text-[11px] text-gray-400 dark:text-gray-500">
            Cancel anytime. No credit card required for trial.
          </p>
        </div>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Cards                                                              */
/* ------------------------------------------------------------------ */
const LatestDealCard: React.FC<{ deal: Deal }> = ({ deal }) => (
  <div
    className="
      relative rounded-2xl bg-white/85 dark:bg-gray-800/85 backdrop-blur
      ring-1 ring-black/10 dark:ring-white/10 shadow-[0_6px_30px_rgba(0,0,0,0.06)] dark:shadow-[0_6px_30px_rgba(255,255,255,0.06)]
      hover:shadow-[0_12px_40px_rgba(0,0,0,0.10)] dark:hover:shadow-[0_12px_40px_rgba(255,255,255,0.10)]
      transition-all duration-300
      p-4 cursor-pointer
    "
  >
    {deal.discountPct ? (
      <div className="absolute right-3 top-3 rounded-full bg-emerald-500 px-2 py-1 text-xs font-bold text-white ring-1 ring-emerald-600/50 shadow">
        {deal.discountPct}%
      </div>
    ) : null}

    <div className="mb-3 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
      <Plane className="h-4 w-4 text-gray-400 dark:text-gray-500" />
      <span>{deal.airline}</span>
      <span>•</span>
      <span>{deal.tripType}</span>
      <span>•</span>
      <span>{deal.cabin}</span>
    </div>

    <div className="mb-1 text-lg font-semibold text-gray-900 dark:text-white">
      {deal.from} <ArrowRight className="mx-1 inline h-4 w-4 text-gray-400 dark:text-gray-500" /> {deal.to}
    </div>

    <div className="flex items-end justify-between">
      <div className="text-sm text-gray-400 line-through dark:text-gray-500">{formatTHB(Math.round(deal.priceTHB * 1.45))}</div>
      <div className="text-right">
        <div className="text-xs text-gray-500 dark:text-gray-400">{deal.dateText}</div>
        <div className="text-xl font-bold text-indigo-600 dark:text-indigo-400">{formatTHB(deal.priceTHB)}</div>
      </div>
    </div>

    <div className="mt-3 h-10 w-full rounded-lg bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-gray-700 dark:to-purple-900 ring-1 ring-black/5 dark:ring-white/10">
      <svg viewBox="0 0 100 30" className="h-full w-full text-indigo-500 dark:text-indigo-400">
        <path d="M0,18 C20,22 35,26 55,20 C70,15 85,12 100,20" fill="none" stroke="currentColor" strokeWidth="2" />
        <circle cx="100" cy="20" r="2.5" fill="currentColor" />
      </svg>
    </div>
  </div>
);

const RoundTripCard: React.FC<{ item: RoundTrip; onSearch?: () => void }> = ({ item, onSearch }) => (
  <div
    className="
      rounded-2xl bg-white/85 dark:bg-gray-800/85 backdrop-blur
      ring-1 ring-black/10 dark:ring-white/10 shadow-[0_6px_30px_rgba(0,0,0,0.06)] dark:shadow-[0_6px_30px_rgba(255,255,255,0.06)]
      hover:shadow-[0_12px_40px_rgba(0,0,0,0.10)] dark:hover:shadow-[0_12px_40px_rgba(255,255,255,0.10)] transition-all duration-300
      p-4
    "
  >
    <div className="mb-2 flex items-baseline gap-2">
      <div className="text-3xl font-extrabold text-indigo-600 drop-shadow-sm dark:text-indigo-400">{item.days}</div>
      <div className="text-sm font-semibold text-indigo-400 dark:text-indigo-500">Day Trip</div>
    </div>

    <div className="mb-1 text-[15px] font-semibold text-gray-900 dark:text-white">{item.rangeText}</div>
    <div className="mb-4 text-sm text-gray-500 dark:text-gray-400">{item.fromTo}</div>

    <div className="flex items-center justify-between">
      <div className="text-[15px] font-bold text-indigo-600 dark:text-indigo-400">{formatTHB(item.priceTHB)}</div>
      <button
        onClick={onSearch}
        className="cursor-pointer rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow hover:bg-indigo-700 hover:shadow-md active:translate-y-px ring-1 ring-indigo-700/40"
      >
        Search
      </button>
    </div>
  </div>
);

/* ------------------------------------------------------------------ */
/* Top Destinations Carousel                                          */
/* ------------------------------------------------------------------ */
const DestinationsCarousel: React.FC<{
  title: string;
  items: Destination[];
  onSelect?: (city: string) => void;
}> = ({ title, items, onSelect }) => {
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  const scrollBy = (delta: number) => {
    if (!scrollerRef.current) return;
    scrollerRef.current.scrollBy({ left: delta, behavior: 'smooth' });
  };

  return (
    <div>
      <h3 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">{title}</h3>

      <div className="relative">
        {/* Left */}
        <button
          onClick={() => scrollBy(-320)}
          className="cursor-pointer absolute left-[-12px] top-1/2 z-10 -translate-y-1/2 rounded-full bg-white dark:bg-gray-700 p-2 text-gray-700 dark:text-gray-300 shadow ring-1 ring-black/10 dark:ring-white/10 hover:bg-gray-50 dark:hover:bg-gray-600"
          aria-label="Prev"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        {/* scroller */}
        <div
          ref={scrollerRef}
          className="no-scrollbar relative flex gap-6 overflow-x-auto scroll-smooth pr-8"
        >
          {items.map((d) => (
            <button
              key={d.city}
              onClick={() => onSelect?.(d.city)}
              // ADDED cursor-pointer HERE
              className="cursor-pointer group w-[300px] shrink-0 text-left"
            >
              {/* Image Container */}
              <div className="overflow-hidden rounded-[22px] ring-1 ring-black/10 dark:ring-white/10 shadow-md">
                <div className="relative h-[200px] w-full">
                  <Image
                    src={d.img}
                    alt={d.city}
                    fill
                    sizes="300px"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              </div>
              <div className="mt-3">
                <div className="text-lg font-semibold text-gray-900 dark:text-white">{d.city}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{d.stats}</div>
              </div>
            </button>
          ))}
        </div>

        {/* Right */}
        <button
          onClick={() => scrollBy(320)}
          className="cursor-pointer absolute right-[-12px] top-1/2 z-10 -translate-y-1/2 rounded-full bg-white dark:bg-gray-700 p-2 text-gray-700 dark:text-gray-300 shadow ring-1 ring-black/10 dark:ring-white/10 hover:bg-gray-50 dark:hover:bg-gray-600"
          aria-label="Next"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Main Screen                                                        */
/* ------------------------------------------------------------------ */
const DashboardScreen: React.FC<ScreenProps> = ({
  showScreen,
  profile,
  handleNotificationClick,
}) => {
  const userName = profile?.first_name || 'Traveler';
  const mockNotificationCount = 3;

  const [isDarkMode, setIsDarkMode] = useState(getInitialDarkMode);
  const [theme, setTheme] = useState<Theme>(getInitialTheme);
  
  useEffect(() => {
    localStorage.setItem('jetlay_dark_mode', isDarkMode.toString());
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem('jetlay_theme', theme);
  }, [theme]);
  
  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  const themeBackgrounds: Record<Theme, string> = {
    vibrant: 'from-purple-400 via-pink-300 to-rose-300 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950', 
    pastel: 'from-purple-200 via-pink-200 to-rose-200 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950',  
    calm: 'from-indigo-300 via-purple-300 to-pink-200 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900', 
    sunset: 'from-orange-300 via-pink-300 to-rose-400 dark:from-gray-950 dark:via-black dark:to-gray-950', 
    black: 'from-black via-gray-950 to-gray-900 dark:from-black dark:via-gray-950 dark:to-gray-900', 
  };

  const roundTrips: RoundTrip[] = [
    { days: 5, rangeText: 'Thu, Dec 11– Mon, Dec 15', fromTo: 'Hong Kong  ⇄  Tsushima', priceTHB: 11379 },
    { days: 7, rangeText: 'Tue, Jan 13– Mon, Jan 19', fromTo: 'Bangkok  ⇄  Tsushima', priceTHB: 13572 },
    { days: 2, rangeText: 'Mon, Dec 15– Mon, Dec 22', fromTo: 'Kuala Lumpur  ⇄  Tsushima', priceTHB: 17809 },
  ];
  const destinations: Destination[] = [
    { city: 'Paris, France', img: 'https://www.royalcaribbean.com/media-assets/pmc/content/dam/shore-x/paris-le-havre-leh/lh17-paris-sightseeing-without-lunch/stock-photo-skyline-of-paris-with-eiffel-tower-at-sunset-in-paris-france-eiffel-tower-is-one-of-the-most-752725282.jpg?w=1024', stats: '32,150 accommodations' },
    { city: 'Tokyo, Japan', img: 'https://res.cloudinary.com/aenetworks/image/upload/c_fill,ar_2,w_3840,h_1920,g_auto/dpr_auto/f_auto/q_auto:eco/v1/gettyimages-1390815938?_a=BAVAZGID0', stats: '25,800 accommodations' },
    { city: 'New York, USA', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/New_york_times_square-terabass.jpg/1200px-New_york_times_square-terabass.jpg', stats: '40,090 accommodations' },
    { city: 'London, UK', img: 'https://studying-in-uk.org/wp-content/uploads/2019/05/study-in-london-1068x641.jpg', stats: '38,910 accommodations' },
    { city: 'Dubai, UAE', img: 'https://www.investindubai.gov.ae/-/media/gathercontent/poi/b/burj-khalifa/fallback-image/burj-khalifa-det-3.jpg', stats: '15,700 accommodations' },
  ];

  return (
    <div className={`${isDarkMode ? 'dark' : ''} relative flex min-h-screen flex-col bg-gradient-to-br ${themeBackgrounds[theme]} transition-all duration-700`}>
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="absolute inset-0 opacity-[0.3] dark:opacity-[0.1]"
          style={{
            backgroundImage:
              'repeating-linear-gradient(120deg, rgba(255,255,255,0.3) 0, rgba(255,255,255,0.3) 1px, transparent 1px, transparent 16px)',
          }}
        />
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-purple-400/40 blur-3xl dark:bg-purple-900/50" />
        <div className="absolute bottom-10 right-0 h-96 w-96 rounded-full bg-pink-300/40 blur-3xl dark:bg-pink-900/50" />
      </div>

      <Header
        title={`Hello, ${userName}`}
        onBack={() => {}}
        showProfileIcon
        showScreen={showScreen}
        profile={profile}
        showNotificationIcon
        notificationCount={mockNotificationCount}
        onNotificationClick={handleNotificationClick}
      />

      <div className="mx-auto w-full max-w-6xl px-4 pb-24 pt-6">
        {/* Controls */}
        <div className="mb-4 flex items-center justify-end gap-2">
          <button
            onClick={toggleDarkMode}
            className="cursor-pointer rounded-xl border border-gray-300 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 shadow hover:bg-gray-50 dark:hover:bg-gray-700"
            aria-label={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
          
          <select
            value={theme}
            onChange={(e) => {
              const selectedTheme = e.target.value as Theme;
              setTheme(selectedTheme);
              
              if (selectedTheme === 'black') {
                setIsDarkMode(true);
              } else {
                setIsDarkMode(false); 
              }
            }}
            className="cursor-pointer rounded-xl border border-gray-300 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 px-3 py-2 text-sm shadow outline-none focus:ring-2 focus:ring-purple-300 dark:text-gray-300"
          >
            <option value="vibrant">🎨 JetLay Vibrant</option>
            <option value="pastel">💗 Soft Pastel</option>
            <option value="calm">💜 Luxury Calm</option>
            <option value="sunset">🌅 Sunset Warm</option>
            <option value="black">⚫ JetLay Black</option>
          </select>
        </div>

        {/* Hero banner */}
        <div className="mb-6 rounded-[22px] bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl ring-1 ring-white/70 dark:ring-gray-700/70 shadow-[inset_0_0_0.5px_rgba(255,255,255,0.9),0_12px_28px_rgba(17,24,39,0.08)] dark:shadow-xl">
          <div className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-800 dark:text-white drop-shadow-[0_1px_0_rgba(255,255,255,0.9)] dark:drop-shadow-none tracking-tight">
                Welcome back{profile?.first_name ? `, ${profile.first_name}` : ''} 👋
              </h2>
              <p className="text-[15px] text-slate-700 dark:text-gray-300 drop-shadow-[0_1px_0_rgba(255,255,255,0.8)] dark:drop-shadow-none">
                Plan, upload, and manage your journey effortlessly.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden md:flex">
                <input
                  placeholder="Search documents, visas…"
                  className="w-64 rounded-xl border border-white/70 dark:border-gray-700/70 bg-white/85 dark:bg-gray-900/85 px-3 py-2 text-sm shadow-inner outline-none focus:ring-2 focus:ring-purple-300 dark:text-gray-100"
                />
              </div>
              <button
                onClick={() => showScreen('visa')}
                className="cursor-pointer rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 px-4 py-2 font-semibold text-white shadow hover:shadow-lg active:translate-y-px"
              >
                Start a visa check
              </button>
            </div>
          </div>
        </div>
        
        {/* Quick Actions */}
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: 'New Upload', on: () => showScreen('uploadForm') },
            { label: 'Visa Check', on: () => showScreen('visa') },
            { label: 'Create Reminder', on: () => showScreen('calendar') },
            { label: 'Support', on: () => alert('support@jetlay.app') },
          ].map((a) => (
            <button
              key={a.label}
              onClick={a.on}
              className="cursor-pointer rounded-xl border border-purple-100 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 shadow-sm transition hover:shadow active:translate-y-px"
            >
              {a.label}
            </button>
          ))}
        </div>

        {/* Main cards */}
        <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { id: 'visa', icon: '/visa.png', title: 'Visa Requirement', detail: 'Check country entry rules.' },
            { id: 'upload', icon: '/document.png', title: 'Document Upload', detail: 'Store and track your files.' },
            { id: 'calendar', icon: '/calendar.png', title: 'Calendar', detail: 'Plan your travel deadlines.' },
            { id: 'reviews', icon: '/review.png', title: 'Traveler Reviews', detail: 'Share and read experiences.' },
          ].map((card) => (
            <div key={card.id} className="relative h-36 overflow-visible">
              <button
                onClick={() => showScreen(card.id)}
                // ADDED cursor-pointer HERE
                className="cursor-pointer group absolute inset-0 transform-gpu rounded-2xl border border-white/70 dark:border-gray-700 bg-white/90 dark:bg-gray-800/90 px-4 py-2 shadow-md transition-all duration-300 ease-out hover:scale-105 hover:shadow-2xl focus:ring-2 focus:ring-purple-400 dark:shadow-lg"
              >
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <div className="flex-shrink-0 flex h-12 items-center justify-center transition-transform duration-300 group-hover:scale-110">
                    <Image src={card.icon} alt={card.title} width={44} height={44} className="object-contain" />
                  </div>
                  
                  <div className="flex flex-col justify-center items-center">
                    <h3 className="text-[15px] font-semibold text-gray-900 dark:text-white transition-colors group-hover:text-gray-950 dark:group-hover:text-gray-100">
                      {card.title}
                    </h3>
                    <p className="text-[12px] text-gray-500 dark:text-gray-400 opacity-0 absolute">
                      {card.detail}
                    </p>
                  </div>
                </div>
              </button>
            </div>
          ))}
        </div>

        {/* --- Top Destinations (FRAMED) --- */}
        <section className="mb-8 rounded-[22px] bg-white/70 dark:bg-gray-800/70 p-6 backdrop-blur-xl ring-1 ring-white/60 dark:ring-gray-700/60 shadow-[0_4px_30px_rgba(0,0,0,0.05)]">
          <DestinationsCarousel
            title="Top destinations worldwide"
            items={destinations}
            onSelect={(city) => alert(`Explore ${city}`)}
          />
        </section>

        {/* Round-trip Section (FRAMED) */}
        <section className="rounded-[22px] bg-white/70 dark:bg-gray-800/70 p-6 backdrop-blur-xl ring-1 ring-white/60 dark:ring-gray-700/60 shadow-[0_4px_30px_rgba(0,0,0,0.05)]">
          <h3 className="mb-1 text-2xl font-bold text-gray-900 dark:text-white">Round-trip flights to Tsushima</h3>
          <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">Perfect 3–7 day plans for an affordable Tsushima experience.</p>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {roundTrips.map((r) => (
              <RoundTripCard key={r.days} item={r} onSearch={() => alert(`Searching ${r.days}-day trip…`)} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default DashboardScreen;