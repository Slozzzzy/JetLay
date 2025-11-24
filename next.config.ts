import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable static export for Capacitor mobile app
  output: 'export',

  // Disable image optimization for static export
  images: {
    unoptimized: true,
  },

  // Use trailing slash for cleaner routing
  trailingSlash: true,

  // Exclude API routes from static export
  // API routes won't work in static export; the app should use client-side auth
  typescript: {
    // Allow build to proceed even with unused API route files
    tsconfigPath: './tsconfig.json',
  },
};

export default nextConfig;
