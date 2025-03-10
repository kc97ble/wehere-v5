import type { Metadata } from "next";
import { Source_Code_Pro, Source_Serif_4, Inter } from "next/font/google";
import "./globals.css";
import ReactQueryProvider from "../components/ReactQueryProvider";

const sans = Inter({
  variable: "--font-sans",
  subsets: ["latin", "vietnamese"],
});

const serif = Source_Serif_4({
  variable: "--font-serif",
  subsets: ["latin", "vietnamese"],
});

const mono = Source_Code_Pro({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "WeHere - Location-based Social Platform",
  description: "Share your experience and connect with others through WeHere",
  keywords: ["location", "social", "platform", "community", "sharing"],
  authors: [{ name: "WeHere Team" }],
  openGraph: {
    title: "WeHere - Location-based Social Platform",
    description: "Share your experience and connect with others through WeHere",
    url: "https://wehere.app",
    siteName: "WeHere",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "WeHere - Location-based Social Platform",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "WeHere - Location-based Social Platform",
    description: "Share your experience and connect with others through WeHere",
    images: ["/twitter-image.png"],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script>
          {'document.documentElement.setAttribute("data-theme", "dark");'}
        </script>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#1565C0" />
        <link rel="icon" href="/icon.png" sizes="any" />
        <link rel="apple-touch-icon" href="/icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={`${sans.variable} ${serif.variable} ${mono.variable}`}>
        <ReactQueryProvider>
          {children}
        </ReactQueryProvider>
      </body>
    </html>
  );
}
