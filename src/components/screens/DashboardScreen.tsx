// src/components/screens/DashboardScreen.tsx
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Header from "@/components/core/Header";
import { ScreenProps } from "@/types";
import {
  Plane,
  ArrowRight,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/* Types                                                              */
/* ------------------------------------------------------------------ */
type Deal = {
  from: string;
  to: string;
  airline: string;
  tripType: "One way" | "Round trip";
  cabin: "Economy" | "Business" | "Premium";
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

type TravelNewsItem = {
  id: string;
  source: string;
  sourceUrl: string;
  title: string;
  snippet: React.ReactNode;
  date: string;
};

type Theme = "vibrant" | "pastel" | "calm" | "sunset" | "black";

/* ------------------------------------------------------------------ */
/* Helpers                                                            */
/* ------------------------------------------------------------------ */
const formatTHB = (n: number) => `฿ ${n.toLocaleString("en-US")}`;

const getInitialTheme = (): Theme => {
  if (typeof window !== "undefined") {
    const savedTheme = localStorage.getItem("jetlay_theme");
    if (
      savedTheme &&
      ["vibrant", "pastel", "calm", "sunset", "black"].includes(savedTheme)
    ) {
      return savedTheme as Theme;
    }
  }
  return "vibrant";
};

/* ------------------------------------------------------------------ */
/* Colors Without Dark Mode                                           */
/* ------------------------------------------------------------------ */
const themeBackgrounds: Record<Theme, string> = {
  vibrant: "from-[#FAD0E8] via-[#E7B1FF] to-[#D8B4FE]",
  pastel: "from-[#FFE2F7] via-[#F3C6FF] to-[#E3D1FF]",
  calm: "from-[#E0D4FF] via-[#D1C9FF] to-[#C5B9FF]",
  sunset: "from-[#FFB7C3] via-[#FF9BD0] to-[#D89AFF]",
  black: "from-black via-gray-900 to-black",
};

/* ------------------------------------------------------------------ */
/* Latest Deal Card                                                   */
/* ------------------------------------------------------------------ */
const LatestDealCard: React.FC<{ deal: Deal }> = ({ deal }) => (
  <div className="relative rounded-2xl bg-white/85 backdrop-blur ring-1 ring-black/10 shadow hover:shadow-lg transition-all duration-300 p-4 cursor-pointer">
    {deal.discountPct ? (
      <div className="absolute right-3 top-3 rounded-full bg-emerald-500 px-2 py-1 text-xs font-bold text-white ring-1 ring-emerald-600/50 shadow">
        {deal.discountPct}%
      </div>
    ) : null}

    <div className="mb-3 flex items-center gap-2 text-sm text-gray-500">
      <Plane className="h-4 w-4 text-gray-400" />
      <span>{deal.airline}</span>
      <span>•</span>
      <span>{deal.tripType}</span>
      <span>•</span>
      <span>{deal.cabin}</span>
    </div>

    <div className="mb-1 text-lg font-semibold text-gray-900">
      {deal.from}{" "}
      <ArrowRight className="mx-1 inline h-4 w-4 text-gray-400" /> {deal.to}
    </div>

    <div className="flex items-end justify-between">
      <div className="text-sm text-gray-400 line-through">
        {formatTHB(Math.round(deal.priceTHB * 1.45))}
      </div>
      <div className="text-right">
        <div className="text-xs text-gray-500">{deal.dateText}</div>
        <div className="text-xl font-bold text-indigo-600">
          {formatTHB(deal.priceTHB)}
        </div>
      </div>
    </div>
  </div>
);

/* ------------------------------------------------------------------ */
/* Round Trip Card                                                    */
/* ------------------------------------------------------------------ */
const RoundTripCard: React.FC<{ item: RoundTrip; onSearch?: () => void }> = ({
  item,
  onSearch,
}) => (
  <div className="rounded-2xl bg-white/85 backdrop-blur ring-1 ring-black/10 shadow hover:shadow-lg transition-all duration-300 p-4">
    <div className="mb-2 flex items-baseline gap-2">
      <div className="text-3xl font-extrabold text-indigo-600 drop-shadow-sm">{item.days}</div>
      <div className="text-sm font-semibold text-indigo-400">Day Trip</div>
    </div>

    <div className="mb-1 text-[15px] font-semibold text-gray-900">{item.rangeText}</div>
    <div className="mb-4 text-sm text-gray-500">{item.fromTo}</div>

    <div className="flex items-center justify-between">
      <div className="text-[15px] font-bold text-indigo-600">{formatTHB(item.priceTHB)}</div>
      <button
        onClick={onSearch}
        className="rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow hover:bg-indigo-700 hover:shadow-md active:translate-y-px"
      >
        Search
      </button>
    </div>
  </div>
);

/* ------------------------------------------------------------------ */
/* Travel News List Component                                         */
/* ------------------------------------------------------------------ */
const TravelNewsList: React.FC<{
  items: TravelNewsItem[];
}> = ({ items }) => {
  const [showAll, setShowAll] = useState(false);

  // If showAll is true, show everything. Otherwise, take first 4.
  const displayedItems = showAll ? items : items.slice(0, 4);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-2xl font-bold text-gray-900">Travel Updates</h3>
        
        {/* Only show the toggle button if there are more than 4 items */}
        {items.length > 4 && (
          <button 
            onClick={() => setShowAll(!showAll)}
            className="text-sm text-indigo-600 font-medium hover:underline focus:outline-none"
          >
            {showAll ? "Show less" : "View all"}
          </button>
        )}
      </div>

      <div className="flex flex-col gap-3">
        {displayedItems.map((news) => (
          <a 
            key={news.id}
            href={news.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group block p-4 rounded-2xl bg-white/50 hover:bg-white/90 transition-all duration-300 ring-1 ring-black/5 hover:shadow-md cursor-pointer"
          >
            <div className="flex flex-col">
              {/* Header: Source & Date */}
              <div className="flex items-center justify-between mb-1.5">
                 <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                    {news.source}
                 </span>
                 <span className="text-[11px] text-gray-400">
                    {news.date}
                 </span>
              </div>
              
              {/* Title */}
              <h4 className="text-lg font-bold text-[#1a0dab] group-hover:text-indigo-600 group-hover:underline decoration-indigo-300 underline-offset-2 mb-1.5">
                {news.title}
              </h4>
              
              {/* Snippet */}
              <div className="text-[13px] text-gray-600 leading-relaxed">
                 {news.snippet}
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Main Dashboard                                                     */
/* ------------------------------------------------------------------ */
const DashboardScreen: React.FC<ScreenProps> = ({
  showScreen,
  profile,
  handleNotificationClick,
}) => {
  const userName = profile?.first_name || "Auto";
  const mockNotificationCount = 3;
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    localStorage.setItem("jetlay_theme", theme);
  }, [theme]);

  const roundTrips: RoundTrip[] = [
    {
      days: 5,
      rangeText: "Thu, Dec 11– Mon, Dec 15",
      fromTo: "Hong Kong ⇄ Tsushima",
      priceTHB: 11379,
    },
    {
      days: 7,
      rangeText: "Tue, Jan 13– Mon, Jan 19",
      fromTo: "Bangkok ⇄ Tsushima",
      priceTHB: 13572,
    },
    {
      days: 2,
      rangeText: "Mon, Dec 15– Mon, Dec 22",
      fromTo: "Kuala Lumpur ⇄ Tsushima",
      priceTHB: 17809,
    },
  ];

  /* ------------------------------------------------------------------ */
  /* Travel News Data                                                   */
  /* ------------------------------------------------------------------ */
  const travelNewsData: TravelNewsItem[] = [
    {
      id: "1",
      source: "Finnair",
      sourceUrl: "https://www.finnair.com",
      title: "Travel documents to the USA, UK, Canada",
      date: "1 hour ago",
      snippet: (
        <>
          Citizens of the USA <span className="text-pink-600 font-medium">must have a valid US passport</span> or other valid travel document that allows entry to the USA.
        </>
      ),
    },
    {
      id: "2",
      source: "IWMA",
      sourceUrl: "https://iwma.org",
      title: "Traveling to wire Southeast Asia? Don't Miss Thailand's...",
      date: "12 Aug 2025",
      snippet: (
        <>
          Thailand has introduced a <span className="text-pink-600 font-medium">mandatory Digital Arrival Card (TDAC)</span> for all foreign visitors – including those entering under visa exemption.
        </>
      ),
    },
    {
      id: "3",
      source: "UNHCR",
      sourceUrl: "https://help.unhcr.org",
      title: "Travel documents for refugees and stateless persons",
      date: "Just now",
      snippet: (
        <>
          Refugees and stateless persons often do not have national passports. In this case, a <span className="text-pink-600 font-medium">travel document can help them travel internationally</span>.
        </>
      ),
    },
    {
      id: "4",
      source: "USCIS (.gov)",
      sourceUrl: "https://www.uscis.gov",
      title: "I-131, Application for Travel Documents, Parole...",
      date: "28 Oct 2025",
      snippet: (
        <>
           Use this form to <span className="text-pink-600 font-medium">apply for travel documents</span>, parole documents, or arrival/departure records.
        </>
      ),
    },
    {
      id: "5",
      source: "Bangkok Airways",
      sourceUrl: "https://www.bangkokair.com",
      title: "Travel Document Requirements",
      date: "2 hours ago",
      snippet: (
        <>
          An international traveling passenger is responsible for <span className="text-pink-600 font-medium">preparing and checking validity of your passport and other travel documents</span>.
        </>
      ),
    },
    {
      id: "6",
      source: "Thai Airways",
      sourceUrl: "https://www.thaiairways.com",
      title: "Passport Validity Rules",
      date: "5 hours ago",
      snippet: (
        <>
          Passports of individuals traveling overseas must have a <span className="text-pink-600 font-medium">validity of more than 6 months</span>. An exception may be made depending on the country...
        </>
      ),
    },
    {
      id: "7",
      source: "GOV.UK",
      sourceUrl: "https://www.gov.uk/foreign-travel-advice/thailand",
      title: "Thailand travel advice",
      date: "29 Oct 2025",
      snippet: (
        <>
          <span className="text-pink-600 font-medium">FCDO travel advice for Thailand</span>. Includes safety and security, insurance, entry requirements and legal differences.
        </>
      ),
    },
    {
      id: "8",
      source: "CAAT",
      sourceUrl: "https://www.facebook.com/caat.thailand/",
      title: "Domestic Flight Rules",
      date: "7 months ago",
      snippet: (
        <>
          When traveling on domestic flights within Thailand, <span className="text-pink-600 font-medium">non-Thai passengers are required to present a boarding pass</span> along with one of the following...
        </>
      ),
    },
  ];

  return (
    <div
      className={`
        relative flex min-h-screen flex-col 
        bg-gradient-to-br ${themeBackgrounds[theme]}
        transition-all duration-700
      `}
    >
      {/* Soft Glow Layer */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-32 left-10 h-80 w-80 bg-pink-200/40 blur-[120px]" />
        <div className="absolute bottom-0 right-10 h-80 w-80 bg-purple-300/40 blur-[130px]" />
      </div>

      <Header
        title="JetLay"  /* CHANGED: Replaced `Hello, ${userName}` with "JetLay" */
        onBack={() => {}}
        showProfileIcon
        showScreen={showScreen}
        profile={profile}
        showNotificationIcon
        notificationCount={mockNotificationCount}
        onNotificationClick={handleNotificationClick}
      />

      <div className="mx-auto w-full max-w-6xl px-4 pb-24 pt-6">
        {/* Hero banner */}
        <div className="mb-6 rounded-[26px] bg-white/80 backdrop-blur-xl ring-1 ring-white/70 shadow-[inset_0_0_0.5px_rgba(255,255,255,0.9),0_12px_28px_rgba(17,24,39,0.08)]">
          {/* เปลี่ยน p-5 เป็น p-8 เพื่อเพิ่มพื้นที่ว่างรอบๆ */}
          <div className="p-8">
            {/* เปลี่ยน text-2xl เป็น text-3xl */}
            <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight mb-2">
              Welcome back, {userName} 👋
            </h2>
            {/* เปลี่ยน text-[15px] เป็น text-lg (ใหญ่ขึ้นนิดหน่อยให้อ่านง่าย) */}
            <p className="text-lg text-slate-700">
              Plan, upload, and manage your journey effortlessly.
            </p>
          </div>
        </div>

        {/* Main cards */}
        <div className="mb-8 grid grid-cols-2 gap-5 sm:grid-cols-4">
          {[
            {
              id: "visa",
              icon: "/visa.png",
              title: "Visa Requirement",
            },
            {
              id: "upload",
              icon: "/document.png",
              title: "Document Upload",
            },
            {
              id: "calendar",
              icon: "/calendar.png",
              title: "Calendar",
            },
            {
              id: "reviews",
              icon: "/review.png",
              title: "Traveler Reviews",
            },
          ].map((card) => (
            /* 1. เพิ่มความสูงการ์ดจาก h-36 เป็น h-48 */
            <div key={card.id} className="relative h-48 overflow-visible">
              <button
                onClick={() => showScreen(card.id)}
                /* 2. เพิ่มความโค้งมนเป็น rounded-[26px] และเพิ่ม Padding */
                className="group absolute inset-0 rounded-[26px] border border-white/70 bg-white/95 p-4 shadow-md transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:bg-white"
              >
                <div className="flex h-full flex-col items-center justify-center text-center">
                  
                  {/* 3. ขยายพื้นที่รอบไอคอน และเพิ่มระยะห่างด้านล่าง (mb-4) */}
                  <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-slate-50 transition-transform duration-300 group-hover:scale-110 group-hover:bg-indigo-50">
                    <Image
                      src={card.icon}
                      alt={card.title}
                      width={56}  /* 4. ขยายขนาดไอคอน (จาก 44 เป็น 56) */
                      height={56}
                      className="object-contain drop-shadow-sm"
                    />
                  </div>

                  <div className="flex flex-col justify-center items-center px-2">
                    {/* 5. ขยายตัวหนังสือเป็น text-lg และเพิ่มความหนา */}
                    <h3 className="text-lg font-bold text-slate-800 group-hover:text-indigo-700">
                      {card.title}
                    </h3>
                  </div>
                </div>
              </button>
            </div>
          ))}
        </div>

        {/* Travel Updates Section */}
        <section className="mb-8 rounded-[22px] bg-white/70 p-6 backdrop-blur-xl ring-1 ring-white/60 shadow-[0_4px_30px_rgba(0,0,0,0.05)]">
          <TravelNewsList items={travelNewsData} />
        </section>

        {/* Round-trip */}
        <section className="rounded-[22px] bg-white/70 p-6 backdrop-blur-xl ring-1 ring-white/60 shadow-[0_4px_30px_rgba(0,0,0,0.05)]">
          <h3 className="mb-1 text-2xl font-bold text-gray-900">
            Round-trip flights to Tsushima
          </h3>
          <p className="mb-4 text-sm text-gray-600">
            Perfect 3–7 day plans for an affordable Tsushima experience.
          </p>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {roundTrips.map((r) => (
              <RoundTripCard
                key={r.days}
                item={r}
                onSearch={() => alert(`Searching ${r.days}-day trip…`)}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default DashboardScreen;