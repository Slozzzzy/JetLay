// src/components/sections/FlightDealsSection.tsx
import React from 'react';
import { Plane, ArrowRight, TrendingDown } from 'lucide-react';

type Deal = {
  from: string;
  to: string;
  airline: string;
  tripType: 'One way' | 'Round trip';
  cabin: 'Economy' | 'Business' | 'Premium';
  dateText: string;           // e.g. "Fri, Nov 21"
  priceTHB: number;           // e.g. 9258
  discountPct?: number;       // e.g. 33
};

type RoundTrip = {
  days: number;               // e.g. 5,7,8
  rangeText: string;          // "Thu, Dec 11– Mon, Dec 15"
  fromTo: string;             // "Hong Kong  ⇄  Tsushima"
  priceTHB: number;
};

const formatTHB = (n: number) =>
  `฿ ${n.toLocaleString('en-US')}`;

const LatestDealCard: React.FC<{ deal: Deal }> = ({ deal }) => {
  return (
    <div className="relative rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      {deal.discountPct ? (
        <div className="absolute right-3 top-3 rounded-full bg-emerald-500 px-2 py-1 text-xs font-bold text-white">
          {deal.discountPct}%
        </div>
      ) : null}

      <div className="mb-3 flex items-center gap-2 text-sm text-gray-500">
        <Plane className="h-4 w-4" />
        <span>{deal.airline}</span>
        <span>•</span>
        <span>{deal.tripType}</span>
        <span>•</span>
        <span>{deal.cabin}</span>
      </div>

      <div className="mb-1 text-lg font-semibold text-gray-900">
        {deal.from} <ArrowRight className="mx-1 inline h-4 w-4" /> {deal.to}
      </div>

      <div className="flex items-end justify-between">
        <div className="text-sm text-gray-500 line-through opacity-60">
          {/* mock old price */}
          {formatTHB(Math.round(deal.priceTHB * 1.45))}
        </div>
        <div className="text-right">
          <div className="text-xs text-gray-500">{deal.dateText}</div>
          <div className="text-xl font-bold text-indigo-600">{formatTHB(deal.priceTHB)}</div>
        </div>
      </div>

      {/* mock mini chart */}
      <div className="mt-3 h-10 w-full">
        <svg viewBox="0 0 100 30" className="h-full w-full text-indigo-500">
          <path d="M0,18 C20,22 35,26 55,20 C70,15 85,12 100,20" fill="none" stroke="currentColor" strokeWidth="2" />
          <circle cx="100" cy="20" r="2.5" fill="currentColor" />
        </svg>
      </div>
    </div>
  );
};

const RoundTripCard: React.FC<{ item: RoundTrip; onSearch?: () => void }> = ({ item, onSearch }) => {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="mb-2 flex items-baseline gap-2">
        <div className="text-3xl font-extrabold text-indigo-600">{item.days}</div>
        <div className="text-sm font-semibold text-indigo-400">Day Trip</div>
      </div>

      <div className="mb-1 text-[15px] font-semibold text-gray-900">{item.rangeText}</div>
      <div className="mb-3 text-sm text-gray-500">{item.fromTo}</div>

      <div className="flex items-center justify-between">
        <div className="text-[15px] font-bold text-indigo-600">{formatTHB(item.priceTHB)}</div>
        <button
          onClick={onSearch}
          className="rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-indigo-700 active:translate-y-px"
        >
          Search
        </button>
      </div>
    </div>
  );
};

const FlightDealsSection: React.FC<{
  latestDeal: Deal;
  roundTrips: RoundTrip[];
  onSearchDeal?: () => void;
  onSearchRoundTrip?: (days: number) => void;
}> = ({ latestDeal, roundTrips, onSearchDeal, onSearchRoundTrip }) => {
  return (
    <section className="space-y-6">
      {/* Latest */}
      <div>
        <h3 className="mb-1 text-2xl font-bold text-gray-900">Latest Flight Deals to Tsushima</h3>
        <p className="mb-4 text-sm text-gray-600">
          These are the best offers we found in the next 60 days. Don’t miss out!
        </p>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <LatestDealCard deal={latestDeal} />
          {/* side tip card */}
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-800">
            <div className="mb-1 flex items-center gap-2 font-semibold">
              <TrendingDown className="h-4 w-4" />
              Tip
            </div>
            <p className="text-sm">
              Prices often drop mid-week. Set a reminder and we’ll nudge you when it’s cheaper.
            </p>
            <button className="mt-3 rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-emerald-700 active:translate-y-px">
              Create alert
            </button>
          </div>
        </div>
      </div>

      {/* Round trips */}
      <div>
        <h3 className="mb-1 text-2xl font-bold text-gray-900">Round-trip flights to Tsushima</h3>
        <p className="mb-4 text-sm text-gray-600">
          Perfect 3–7 day plans for an affordable Tsushima experience.
        </p>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {roundTrips.map((r) => (
            <RoundTripCard
              key={r.days}
              item={r}
              onSearch={() => onSearchRoundTrip?.(r.days)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FlightDealsSection;
