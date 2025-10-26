import withPWA from "next-pwa";

const nextConfig = {
  reactStrictMode: true,
  experimental: {
    optimizeCss: true,
  },
};

export default withPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
  fallbacks: {
    document: "/offline.html",
  },
  runtimeCaching: [
    // Cache Google Fonts
    {
      urlPattern: /^https:\/\/fonts\.(?:googleapis|gstatic)\.com\/.*/i,
      handler: "CacheFirst",
      options: {
        cacheName: "google-fonts",
        expiration: { maxEntries: 20, maxAgeSeconds: 31536000 },
      },
    },

    // Cache Next.js static files (_next/static/)
    {
      urlPattern: /^\/_next\/static\/.*/i,
      handler: "CacheFirst",
      options: {
        cacheName: "next-static",
        expiration: { maxEntries: 100, maxAgeSeconds: 31536000 },
      },
    },

    // Cache images (CacheFirst for speed)
    {
      urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|ico)$/i,
      handler: "CacheFirst",
      options: {
        cacheName: "images",
        expiration: { maxEntries: 100, maxAgeSeconds: 2592000 }, // 30 days
      },
    },

    // Cache other pages
    {
      urlPattern: /^https?.*/i,
      handler: "NetworkFirst",
      options: {
        cacheName: "pages",
        networkTimeoutSeconds: 10,
        expiration: { maxEntries: 50 },
      },
    },
  ],
  additionalManifestEntries: [
    { url: "/offline.html", revision: Date.now().toString() },
  ],
})(nextConfig);
