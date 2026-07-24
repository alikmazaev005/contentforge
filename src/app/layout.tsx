import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { SITE_NAME, SITE_TAGLINE } from "@/lib/constants"
import { Analytics } from '@vercel/analytics/next'

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] })
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] })

const siteUrl = process.env.NEXT_PUBLIC_URL || "https://www.contentforge.fun"

export const metadata: Metadata = {
  title: { default: `${SITE_NAME} — ${SITE_TAGLINE}`, template: `%s | ${SITE_NAME}` },
  description: "AI-powered social media content generator. Create engaging posts for LinkedIn, Twitter, Instagram, Facebook, TikTok, Threads in 6 languages.",
  icons: { icon: "/favicon.svg" },
  metadataBase: new URL(siteUrl),
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: SITE_NAME,
    title: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description: "AI-powered social media content generator. Create platform-optimized posts with images in 6 languages. LinkedIn, Twitter, Instagram, and more.",
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description: "AI-powered social media content generator. Create platform-optimized posts with images in 6 languages.",
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full bg-white text-neutral-900 font-sans">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
