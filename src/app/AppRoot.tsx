"use client";
import React, { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";
import type { Profile } from "@/types";
import { useSearchParams } from "next/navigation";

// Core Components
import CustomAlert from "@/components/core/CustomAlert";
import NotificationSidebar, {
  Notification as JetlayNotification,
} from "@/components/core/NotificationSidebar";

// Screen Components
import SplashScreen from "@/components/screens/SplashScreen";
import WelcomeChoiceScreen from "@/components/screens/WelcomeChoiceScreen";
import CreateAccountScreen from "@/components/auth/CreateAccountScreen";
import LoginScreen from "@/components/auth/LoginScreen";
import ForgotPasswordScreen from "@/components/auth/ForgotPasswordScreen";
import VerifyEmailScreen from "@/components/auth/VerifyEmailScreen";
import DashboardScreen from "@/components/screens/DashboardScreen";
import VisaScreen from "@/components/screens/VisaScreen";
import VisaResultScreen from "@/components/screens/VisaResultScreen";
import DocumentListScreen from "@/components/screens/DocumentListScreen";
import UploadFormScreen from "@/components/screens/UploadFormScreen";
import ReviewsScreen from "@/components/screens/ReviewsScreen";
import AddReviewScreen from "@/components/screens/AddReviewScreen";
import CalendarScreen from "@/components/screens/CalendarScreen";
import UserProfileScreen from "@/components/screens/UserProfileScreen";

const AppRoot = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [sessionReady, setSessionReady] = useState(false);

  const [currentScreen, setCurrentScreen] = useState("welcomeChoice");
  const [profile, setProfile] = useState<Profile | null>(null);
  const params = useSearchParams();

  // Alert system
  const [alertInfo, setAlertInfo] = useState({
    show: false,
    message: "",
    type: "info" as "success" | "error" | "info",
  });

  // Notification sidebar & data
  const [isNotiSidebarOpen, setIsNotiSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState<JetlayNotification[]>([]);
  const [notificationCount, setNotificationCount] = useState<number>(0);

  const showScreen = useCallback((id: string) => setCurrentScreen(id), []);

  const showAlert = useCallback(
    (message: string, type: "success" | "error" | "info" = "info") => {
      setAlertInfo({ show: true, message, type });
    },
    []
  );

  const closeAlert = useCallback(() => {
    setAlertInfo((prev) => ({ ...prev, show: false }));
  }, []);

  useEffect(() => {
    let mounted = true;

    const wait = (ms: number) => new Promise((res) => setTimeout(res, ms));
    const MIN_WAIT_MS = 2500;

    async function fetchProfile(userId: string) {
      try {
        const { data: profileData } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", userId)
          .single();

        if (profileData) {
          setProfile(profileData);
          return;
        }

        const userRes = await supabase
          .auth
          .getUser()
          .catch(() => ({ data: { user: null } }));
        const user = userRes?.data?.user ?? null;

        type UserMetaHolder = { user_metadata?: unknown };
        const maybeMeta = (user as unknown as UserMetaHolder)?.user_metadata;
        const meta: Record<string, unknown> =
          typeof maybeMeta === "object" && maybeMeta !== null
            ? (maybeMeta as Record<string, unknown>)
            : {};

        const getString = (key: string) => {
          const val = meta[key];
          return typeof val === "string" ? val : null;
        };

        const full_name =
          getString("full_name") ??
          getString("fullName") ??
          getString("name") ??
          null;
        const first_name =
          getString("first_name") ??
          getString("firstName") ??
          (full_name ? String(full_name).trim().split(/\s+/)[0] : null);
        const last_name =
          getString("last_name") ??
          getString("lastName") ??
          (full_name
            ? String(full_name).trim().split(/\s+/).slice(1).join(" ")
            : null);
        const avatar_url =
          getString("avatar_url") ??
          getString("avatar") ??
          getString("picture") ??
          null;

        try {
          const { data: inserted, error: insertErr } = await supabase
            .from("profiles")
            .insert({
              id: userId,
              first_name: first_name ?? null,
              last_name: last_name ?? null,
              full_name: full_name ?? null,
              avatar_url: avatar_url ?? "",
              phone: null,
              birth_date: null,
            })
            .select()
            .maybeSingle();

          if (insertErr) {
            console.warn("Failed to create profile for OAuth user:", insertErr);
            setProfile(null);
          } else {
            setProfile(inserted ?? null);
          }
        } catch (ie) {
          console.warn("Profile insert exception:", ie);
          setProfile(null);
        }
      } catch {
        setProfile(null);
      }
    }

    async function init() {
      try {
        const minWait = wait(MIN_WAIT_MS);
        const sessionPromise = supabase.auth
          .getSession()
          .catch(() => ({ data: { session: null } }));
        const [, sessionResult] = await Promise.all([minWait, sessionPromise]);
        if (!mounted) return;

        const session = sessionResult?.data?.session ?? null;

        const tokenKey =
          typeof window !== "undefined"
            ? Object.keys(localStorage).find(
                (k) =>
                  /^(supabase|sb-).*auth-token$/.test(k) ||
                  /supabase|auth|sb/i.test(k)
              )
            : undefined;
        const tokenPresent = !!tokenKey;

        if (session?.user) {
          await fetchProfile(session.user.id);
          if (mounted) setCurrentScreen("dashboard");
        } else if (tokenPresent) {
          try {
            await wait(100);
            const retry = await supabase.auth
              .getSession()
              .catch(() => ({ data: { session: null } }));
            const retrySession = retry?.data?.session ?? null;
            if (retrySession?.user) {
              await fetchProfile(retrySession.user.id);
              if (mounted) setCurrentScreen("dashboard");
            } else {
              setProfile(null);
              if (mounted) setCurrentScreen("welcomeChoice");
            }
          } catch {
            setProfile(null);
            if (mounted) setCurrentScreen("welcomeChoice");
          }
        } else {
          setProfile(null);
          if (mounted) setCurrentScreen("welcomeChoice");
        }
      } catch {
        setProfile(null);
        if (mounted) setCurrentScreen("welcomeChoice");
      } finally {
        if (mounted) setSessionReady(true);
      }
    }

    init();

    const { data } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!mounted) return;
      if (session?.user) {
        await fetchProfile(session.user.id);
        setCurrentScreen("dashboard");
      } else {
        setProfile(null);
        setCurrentScreen("welcomeChoice");
      }
    });

    return () => {
      mounted = false;
      if (data?.subscription) data.subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch notifications whenever profile.id is available/changes
  useEffect(() => {
    const userId = profile?.id;
    if (!userId) return;

    const fetchNotifications = async () => {
      try {
        const res = await fetch(
          `/api/notifications?userId=${encodeURIComponent(userId)}`
        );
        if (!res.ok) {
          console.error("Failed to fetch notifications");
          return;
        }
        const json = await res.json();
        const list: JetlayNotification[] = json.notifications ?? [];
        const count: number =
          typeof json.unreadCount === "number"
            ? json.unreadCount
            : list.length;

        setNotifications(list);
        setNotificationCount(count);
      } catch (err) {
        console.error("Error fetching notifications", err);
      }
    };

    fetchNotifications();
  }, [profile]);

  useEffect(() => {
    const screen = params?.get("screen");
    if (screen === "welcomeBack") {
      setCurrentScreen("welcomeBack");
    }
  }, [params]);

  const handleSignOut = useCallback(async () => {
    await supabase.auth.signOut();
    setProfile(null);
    setCurrentScreen("welcomeChoice");
    showAlert("You have been logged out.", "success");
  }, [showAlert]);

  // Props passed down to screens
  type AppScreenProps = {
    showScreen: (id: string) => void;
    showAlert: (
      message: string,
      type?: "success" | "error" | "info"
    ) => void;
    profile: Profile | null;
    setProfile: React.Dispatch<React.SetStateAction<Profile | null>>;
    handleNotificationClick: () => void;
    notificationCount: number;
  };

  const screenProps: AppScreenProps = {
    showScreen,
    showAlert,
    profile,
    setProfile,
    handleNotificationClick: () => {
      setIsNotiSidebarOpen(true);
      setNotificationCount(0); // mark as read visually
    },
    notificationCount,
  };

  const renderScreen = () => {
    if (currentScreen === "loading") return null;
    switch (currentScreen) {
      case "welcomeChoice":
        return <WelcomeChoiceScreen showScreen={showScreen} />;
      case "createAccount":
        return <CreateAccountScreen {...screenProps} />;
      case "welcomeBack":
        return <LoginScreen {...screenProps} />;
      case "forgotPassword":
        return <ForgotPasswordScreen {...screenProps} />;
      case "verifyEmail":
        return <VerifyEmailScreen {...screenProps} />;
      case "dashboard":
        return <DashboardScreen {...screenProps} />;
      case "visa":
        return <VisaScreen {...screenProps} />;
      case "visaResult":
        return <VisaResultScreen {...screenProps} />;
      case "upload":
        return <DocumentListScreen {...screenProps} />;
      case "uploadForm":
        return <UploadFormScreen {...screenProps} />;
      case "reviews":
        return <ReviewsScreen {...screenProps} />;
      case "addReview":
        return <AddReviewScreen {...screenProps} />;
      case "calendar":
        return <CalendarScreen {...screenProps} />;
      case "user":
        return (
          <UserProfileScreen
            {...screenProps}
            handleSignOut={handleSignOut}
          />
        );
      default:
        return <WelcomeChoiceScreen showScreen={showScreen} />;
    }
  };

  const handleSplashFinish = useCallback(() => setShowSplash(false), []);

  return (
    <div className="min-h-screen">
      {alertInfo.show && (
        <CustomAlert message={alertInfo.message} onClose={closeAlert} />
      )}

      {/* Notification Sidebar */}
      <NotificationSidebar
        isOpen={isNotiSidebarOpen}
        onClose={() => setIsNotiSidebarOpen(false)}
        notifications={notifications}
      />

      {renderScreen()}

      {showSplash && (
        <SplashScreen
          onFinish={handleSplashFinish}
          sessionReady={sessionReady}
        />
      )}
    </div>
  );
};

export default AppRoot;
