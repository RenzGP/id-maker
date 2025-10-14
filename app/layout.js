import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// Import Roboto from Google Fonts CDN
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Update metadata for PWA support
export const metadata = {
  title: "WS ID Maker",
  description: "Generate and print professional ID cards easily.",
  manifest: "/manifest.json",
  themeColor: "#1e40af",
  icons: {
    icon: "/icons/icon-192x192.png",
    apple: "/icons/icon-512x512.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#1e40af" />
        <link rel="manifest" href="/manifest.json" />

        <link rel="stylesheet" href="/fa/css/all.min.css" />

      </head>

      <body className={`${geistSans.variable} ${geistMono.variable} antialiased font-['Roboto',sans-serif]`}>
        {children}
      </body>
    </html>
  );
}
