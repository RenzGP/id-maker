import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "WS ID Maker",
  description: "Generate and print professional ID cards easily.",
  manifest: "/manifest.json",
  icons: {
    icon: "/icons/icon-192x192.png",
    apple: "/icons/icon-512x512.png",
  },
};

export const viewport = {
  themeColor: "#2b467d",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* PWA essentials */}
        <meta name="theme-color" content="#1e40af" />
        <link rel="manifest" href="/manifest.json" />

        {/* FontAwesome styles */}
        <link rel="stylesheet" href="/fa/css/all.min.css" />

        {/* Service Worker registration script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                  navigator.serviceWorker
                    .register('/sw.js')
                    .then(() => console.log('Service Worker registered'))
                    .catch((err) => console.error('SW registration failed', err));
                });
              }
            `,
          }}
        />
      </head>

      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased font-['Roboto',sans-serif]`}
      >
        <RegisterSW />
        {children}
      </body>
    </html>
  );
}
