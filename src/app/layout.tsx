import type { Metadata } from "next";
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

export const metadata: Metadata = {
  title: "tamil seasons | ganesha",
  description: "explore the traditional tamil calendar and its seasonal divisions",
  authors: [{ name: "Ganesh Kumar", url: "https://gktk.us" }],
  generator: "tamil seasons | ganesha",
  applicationName: "tamil seasons | ganesha",
  creator: "Ganesh Kumar",
  publisher: "Ganesh Kumar",
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#000",
  metadataBase: new URL("https://tamilseasons.vercel.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "tamil seasons | ganesha",
    description: "explore the traditional tamil calendar and its seasonal divisions",
    url: "https://tamilseasons.vercel.app",
    siteName: "tamil seasons | ganesha",
    images: [
      {
        url: "/card.png",
        width: 1200,
        height: 630,
        alt: "tamil seasons | ganesha",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "tamil seasons | ganesha",
    description: "explore the traditional tamil calendar and its seasonal divisions",
    site: "@gaaneshaha",
    creator: "@gaaneshaha",
    images: ["/card.png"],
  },
  other: {
    "dcterms.dateCopyrighted": "2025",
    "dcterms.rightsHolder": "Ganesh Kumar",
    "X-UA-Compatible": "IE=edge",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-black dark:bg-white dark:text-black`}
      >
        {children}
      </body>
    </html>
  );
}
