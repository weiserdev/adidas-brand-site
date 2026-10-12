import ScrollToTop from "@/components/common/ScrollToTop";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import Chat from "@/components/common/Chat";
import Providers from "./providers";
import ToastProvider from "@/context/ToastContext";
import Loading from "@/components/common/Loading";
import AppLoader from "@/components/common/AppLoader";
import Script from "next/script";

import { Rubik_Glitch, Rubik_Doodle_Shadow } from "next/font/google";
import { Suspense } from "react";

import type { Metadata } from "next";
import "@/styles/global.css";
import "animate.css";

const rubikGlitch = Rubik_Glitch({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  variable: "--font-glitch",
});

const rubikDoodle = Rubik_Doodle_Shadow({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  variable: "--font-doodle",
});

export const metadata: Metadata = {
  title: {
    default: "adidas",
    template: "%s | adidas",
  },
  description:
    "Discover Adidas shoes that blend cutting-edge technology with timeless design. Explore iconic models, AI-powered comparisons, natural-language search, and intelligent recommendations across one of the world’s most legendary footwear brands.",
  keywords:
    "Adidas Brand Site, adidas, shoes, sneakers, superstar, samba, gazelle, AI e-commerce, AI chat, moonshotai, Kimi-K2-Instruct, semantic search, sentence-transformers, all-mpnet-base-v2, AI product comparison, AI recommendations, natural language search, vector search, embeddings, product discovery, conversational AI, AI-powered UX, intelligent shopping, Next.js, React 19, TypeScript, Tailwind CSS, GSAP, Framer Motion, R3F, React Query, modern web development",
  metadataBase: new URL("https://weiser-adidas.vercel.app"),
  authors: [
    { name: "Peter Weiser", url: "https://github.com/weiserdev" },
    { name: "Adidas Brand Site", url: "https://weiser-adidas.vercel.app" },
  ],
  openGraph: {
    title: "Adidas Brand Site",
    description:
      "Discover Adidas shoes that blend cutting-edge technology with timeless design. Explore iconic models, AI-powered comparisons, and intelligent recommendations.",
    url: "https://weiser-adidas.vercel.app",
    siteName: "Adidas Brand Site",
    images: [
      {
        url: "https://weiser-adidas.vercel.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "Adidas Brand Site",
      },
    ],
    locale: "en_GB",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Adidas Brand Site",
    description:
      "Explore Adidas shoes with AI-powered comparisons, natural-language search, and intelligent recommendations.",
    images: ["https://weiser-adidas.vercel.app/og-image.png"],
    creator: "@weiserdev",
  },
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html
      lang="en"
      dir="ltr"
      className={`${rubikGlitch.variable} ${rubikDoodle.variable} antialiased`}
    >
      <head>
        <meta name="apple-mobile-web-app-title" content="Adidas" />

        <link rel="preload" href="/video/loading.mp4" as="video" type="video/mp4" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/web-app-manifest-512x512" />
        <link rel="manifest" href="/manifest.json" />
      </head>

      <body className="relative">
        <AppLoader>
          <Suspense fallback={<Loading />}>
            <Providers>
              <Header />
              <ScrollToTop />
              {children}
              <ToastProvider />
              <Chat />
              <Footer />
            </Providers>
          </Suspense>
        </AppLoader>

        {/* Google Analytics */}
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-PWMM303M4E"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-PWMM303M4E');
          `}
        </Script>

        {/* Organization structured data */}
        <Script id="schema-org" type="application/ld+json" strategy="afterInteractive">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Adidas Brand Site",
            url: "https://weiser-adidas.vercel.app",
            logo: "https://weiser-adidas.vercel.app/web-app-manifest-512x512",
          })}
        </Script>
      </body>
    </html>
  );
};

export default RootLayout;
