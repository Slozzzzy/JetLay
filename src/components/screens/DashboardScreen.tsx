// src/components/screens/DashboardScreen.tsx
import React from "react";
import Image from "next/image";
import Header from "@/components/core/Header";
import { ScreenProps } from "@/types";

interface DashboardScreenProps extends ScreenProps {
  notificationCount: number;
}

const DashboardScreen: React.FC<DashboardScreenProps> = ({
  showScreen,
  profile,
  handleNotificationClick,
  notificationCount,
}) => {
  const dashboardCards = [
    {
      id: "visa",
      icon: "/visa.png",
      title: "Visa Requirement",
      detail: "Check country entry rules.",
    },
    {
      id: "upload",
      icon: "/document.png",
      title: "Document Upload",
      detail: "Store and track your files.",
    },
    {
      id: "calendar",
      icon: "/calendar.png",
      title: "Calendar",
      detail: "Plan your travel deadlines.",
    },
    {
      id: "reviews",
      icon: "/review.png",
      title: "Traveler Reviews",
      detail: "Share and read experiences.",
    },
  ];

  const userName = profile?.first_name || "User";

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-purple-200 via-pink-200 to-rose-200">
      <Header
        title={`Hello, ${userName}`}
        onBack={() => {}}
        showProfileIcon
        showScreen={showScreen}
        profile={profile}
        showNotificationIcon
        notificationCount={notificationCount}
        onNotificationClick={handleNotificationClick}
      />

      <div className="p-6 flex-1">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {dashboardCards.map((card) => (
            <div key={card.id} className="relative h-28 sm:h-32 overflow-visible">
              <button
                onClick={() => showScreen(card.id)}
                className="
                  group/card
                  absolute inset-0
                  bg-white
                  rounded-2xl
                  shadow-md
                  transition-all duration-300 ease-out
                  transform-gpu
                  hover:scale-110 hover:shadow-2xl
                  focus:ring-2 focus:ring-purple-400
                "
              >
                <div className="flex flex-col items-center justify-center h-full px-3">
                  <div className="flex items-center justify-center h-12 transition-transform duration-300 group-hover/card:scale-125">
                    <Image
                      src={card.icon}
                      alt={card.title}
                      width={44}
                      height={44}
                      className="object-contain"
                    />
                  </div>
                  <h3 className="mt-2 text-[15px] font-semibold text-gray-900 text-center transition-all duration-300 group-hover/card:text-[16px]">
                    {card.title}
                  </h3>
                  <p
                    className="
                      text-[12px] text-gray-500 text-center opacity-0 translate-y-1
                      transition-all duration-300 ease-out
                      group-hover/card:opacity-100 group-hover/card:translate-y-0
                    "
                  >
                    {card.detail}
                  </p>
                </div>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardScreen;
