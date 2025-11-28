import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.apartment.app',
  appName: 'apartment',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
