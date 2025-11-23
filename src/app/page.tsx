"use client";
import React, { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";
import type { Profile } from "@/types";

// Core Components
import CustomAlert from "@/components/core/CustomAlert";
import NotificationSidebar from "@/components/core/NotificationSidebar";

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
import ChangePasswordScreen from "@/components/screens/ChangePasswordScreen";

const App = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [sessionReady, setSessionReady] = useState(false);

  const [currentScreen, setCurrentScreen] = useState("welcomeChoice");
  const [screenHistory, setScreenHistory] = useState<string[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);

  const [alertInfo, setAlertInfo] = useState({
    show: false,
    message: "",
    type: "info" as "success" | "error" | "info",
  });

  const [isNotiSidebarOpen, setIsNotiSidebarOpen] = useState(false);

  // --- Screen navigation ---
  const showScreen = useCallback(
    (id: string) => {
      setScreenHistory((prev) => [...prev, currentScreen]); // push current screen to history
      setCurrentScreen(id);
    },
    [currentScreen]
  );

  const goBack = useCallback(() => {
    setScreenHistory((prev) => {
      if (prev.length === 0) return prev;
      const lastScreen = prev[prev.length - 1];
      setCurrentScreen(lastScreen);
      return prev.slice(0, prev.length - 1);
    });
  }, []);

  // --- Alert system ---
  const showAlert = useCallback(
    (message: string, type: "success" | "error" | "info" = "info") => {
      setAlertInfo({ show: true, message, type });
    },
    []
  );

  const closeAlert = useCallback(() => {
    setAlertInfo((prev) => ({ ...prev, show: false }));
  }, []);

  // --- Auth & profile ---
  useEffect(() => {
    let mounted = true;

    const wait = (ms: number) => new Promise((res) => setTimeout(res, ms));
    const MIN_WAIT_MS = 2500;

    async function fetchProfile(userId: string) {
      try {
        const { data: profileData, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", userId)
          .single();
        if (!error && mounted) setProfile(profileData ?? null);
      } catch {
        if (mounted) setProfile(null);
      }
    }

    async function init() {
      try {
        const minWait = wait(MIN_WAIT_MS);

        if (typeof window !== "undefined") {
          try {
            const maybeGetSessionFromUrl = (
              supabase.auth as unknown as Record<string, unknown>
            )["getSessionFromUrl"] as
              | ((opts?: { storeSession?: boolean }) => Promise<unknown>)
              | undefined;
            if (typeof maybeGetSessionFromUrl === "function") {
              await maybeGetSessionFromUrl({ storeSession: true }).catch(
                () => null
              );
            }
          } catch {}
        }

        const sessionPromise = supabase.auth
          .getSession()
          .catch(() => ({ data: { session: null } }));
        const [, sessionResult] = await Promise.all([minWait, sessionPromise]);

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

    const { data } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (!mounted) return;
        if (session?.user) {
          await fetchProfile(session.user.id);
          setCurrentScreen("dashboard");
        } else {
          setProfile(null);
          setCurrentScreen("welcomeChoice");
        }
      }
    );

    return () => {
      mounted = false;
      if (data?.subscription) data.subscription.unsubscribe();
    };
  }, []);

  // --- OAuth / Sign-out ---
  const handleGoogleLogin = useCallback(async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });
    if (error) showAlert("Google sign-in failed.", "error");
  }, [showAlert]);

  const handleSignOut = useCallback(async () => {
    await supabase.auth.signOut();
    setProfile(null);
    setCurrentScreen("welcomeChoice");
    showAlert("You have been logged out.", "success");
  }, [showAlert]);

  // Props passed to all screens
  const screenProps = {
    showScreen,
    showAlert,
    profile,
    setProfile,
    handleNotificationClick: () => setIsNotiSidebarOpen(true),
    goBack, // pass goBack to screens
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case "welcomeChoice":
        return <WelcomeChoiceScreen showScreen={showScreen} />;
      case "createAccount":
        return (
          <CreateAccountScreen
            {...screenProps}
            handleGoogleLogin={handleGoogleLogin}
          />
        );
      case "welcomeBack":
        return (
          <LoginScreen {...screenProps} handleGoogleLogin={handleGoogleLogin} />
        );
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
          <UserProfileScreen {...screenProps} handleSignOut={handleSignOut} />
        );
      case "changePassword":
        return <ChangePasswordScreen {...screenProps} />;
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
      <NotificationSidebar
        isOpen={isNotiSidebarOpen}
        onClose={() => setIsNotiSidebarOpen(false)}
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

export default App;
