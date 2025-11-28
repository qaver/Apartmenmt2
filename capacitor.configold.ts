import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.app',
  appName: 'angular-tour-of-heroes',
  webDir: 'dist/angular-tour-of-heroes',
  server: {
    androidScheme: 'https'
  }
};

export default config;
