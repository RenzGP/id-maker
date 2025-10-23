// next.config.mjs
import withPWAInit from 'next-pwa';

/** @type {import('next').NextConfig} */
const baseConfig = {
  reactStrictMode: true,
};

const withPWA = withPWAInit({
  dest: 'public', // folder for service worker and manifest
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development', // disable in dev
});

export default withPWA(baseConfig);
