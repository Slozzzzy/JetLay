// src/components/core/ThemeProvider.tsx
"use client";
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Sun, Moon } from "lucide-react";

export type Theme = "vibrant" | "pastel" | "calm" | "sunset" | "black";

type ThemeContextValue = {
  theme: Theme;
  setTheme: (t: Theme) => void;
  isDarkMode: boolean;
  setIsDarkMode: (v: boolean) => void;
  toggleDarkMode: () => void;
  themeBackgrounds: Record<Theme, string>;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const THEME_KEY = "jetlay_theme";
const DARK_KEY = "jetlay_dark_mode";

const getInitialTheme = (): Theme => {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem(THEME_KEY);
    if (
      saved &&
      ["vibrant", "pastel", "calm", "sunset", "black"].includes(saved)
    )
      return saved as Theme;
  }
  return "vibrant";
};

const getInitialDarkMode = (): boolean => {
  if (typeof window !== "undefined") {
    const savedTheme = localStorage.getItem(THEME_KEY);
    if (savedTheme === "black") return true;
    const savedMode = localStorage.getItem(DARK_KEY);
    return savedMode === "true";
  }
  return false;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(getInitialDarkMode);

  const themeBackgrounds = useMemo(
    () => ({
      vibrant:
        "from-purple-400 via-pink-300 to-rose-300 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950",
      pastel:
        "from-purple-200 via-pink-200 to-rose-200 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950",
      calm: "from-indigo-300 via-purple-300 to-pink-200 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900",
      sunset:
        "from-orange-300 via-pink-300 to-rose-400 dark:from-gray-950 dark:via-black dark:to-gray-950",
      black:
        "from-black via-gray-950 to-gray-900 dark:from-black dark:via-gray-950 dark:to-gray-900",
    }),
    []
  );

  useEffect(() => {
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch {}
    if (theme === "black") {
      setIsDarkMode(true);
      try {
        localStorage.setItem(DARK_KEY, "true");
      } catch {}
    }
  }, [theme]);

  useEffect(() => {
    try {
      localStorage.setItem(DARK_KEY, isDarkMode.toString());
    } catch {}
  }, [isDarkMode]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    if (isDarkMode) root.classList.add("dark");
    else root.classList.remove("dark");
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode((v) => !v);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        isDarkMode,
        setIsDarkMode,
        toggleDarkMode,
        themeBackgrounds,
      }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextValue => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
};

/* --- Merged ThemeControl UI --- */
export const ThemeControl: React.FC<{ className?: string }> = ({
  className,
}) => {
  const { theme, setTheme, isDarkMode, toggleDarkMode, setIsDarkMode } =
    useTheme();

  return (
    <div className={`flex items-center gap-2 ${className ?? ""}`}>
      {/* Dark Mode Toggle */}
      <button
        onClick={toggleDarkMode}
        className="rounded-xl border border-gray-300 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 shadow hover:bg-gray-50 dark:hover:bg-gray-700"
        aria-label={
          isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"
        }>
        {isDarkMode ? (
          <Sun className="h-5 w-5" />
        ) : (
          <Moon className="h-5 w-5" />
        )}
      </button>

      {/* Theme Dropdown */}
      <select
        value={theme}
        onChange={(e) => {
          const selectedTheme = e.target.value as Theme;
          setTheme(selectedTheme);
          if (selectedTheme === "black") setIsDarkMode(true);
          else setIsDarkMode(false);
        }}
        className="rounded-xl border border-gray-300 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 px-3 py-2 text-sm shadow outline-none focus:ring-2 focus:ring-purple-300 dark:text-gray-300">
        <option value="vibrant">🎨 JetLay Vibrant</option>
        <option value="pastel">💗 Soft Pastel</option>
        <option value="calm">💜 Luxury Calm</option>
        <option value="sunset">🌅 Sunset Warm</option>
        <option value="black">⚫ JetLay Black</option>
      </select>
    </div>
  );
};

export default ThemeProvider;
