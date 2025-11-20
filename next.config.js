// next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Set the output mode to 'export' for static HTML generation
  // output: 'export',

  // Optional: Disable image optimization, which isn't fully supported with static export
  images: {
    unoptimized: true,
  },

  // Optional: Set trailingSlash to true if you want to generate /page/index.html 
  // instead of /page.html for cleaner routing
  trailingSlash: true, 
};

module.exports = nextConfig;