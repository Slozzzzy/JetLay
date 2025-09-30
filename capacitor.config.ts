import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.jetlay.app',
  appName: 'JetLay',
  webDir: 'out', // <-- will point to static export
  // bundledWebRuntime: false,
};

export default config;