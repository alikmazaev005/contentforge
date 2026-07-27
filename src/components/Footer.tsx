import Link from "next/link"

import { SITE_NAME } from "@/lib/constants"

export function Footer() {
  return (
    <footer className="border-t border-neutral-200 bg-neutral-50">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg">
            <svg width="18" height="18" viewBox="0 0 512 512" className="text-violet-600">
              <defs><linearGradient id="logoGradF" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#7C3AED"/><stop offset="100%" stopColor="#A855F7"/></linearGradient></defs>
              <rect width="512" height="512" rx="110" fill="url(#logoGradF)"/>
              <text x="256" y="310" textAnchor="middle" fontFamily="system-ui, sans-serif" fontSize="200" fontWeight="700" fill="white" letterSpacing="-5">CF</text>
            </svg>
            {SITE_NAME}
          </Link>
          <nav className="flex items-center gap-6 text-sm text-neutral-500">
            <Link href="/#features" className="hover:text-neutral-700 transition-colors">Features</Link>
            <Link href="/#how-it-works" className="hover:text-neutral-700 transition-colors">How it Works</Link>
            <Link href="/pricing" className="hover:text-neutral-700 transition-colors">Pricing</Link>
            <Link href="/privacy" className="hover:text-neutral-700 transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-neutral-700 transition-colors">Terms</Link>
            <Link href="/contact" className="hover:text-neutral-700 transition-colors">Contact</Link>
          </nav>
          <p className="text-sm text-neutral-400">© {new Date().getFullYear()} {SITE_NAME}. All rights reserved.</p>
        </div>
      </div>
              <div className="flex justify-center mt-4">
            <a href="https://fazier.com/launches/contentforge.fun" target="_blank" rel="noopener noreferrer">
              <img src="https://fazier.com/api/v1/public/badges/launch_badges.svg?badge_type=featured&theme=light" width="250" alt="Launched on Fazier" />
            </a>
          </div>
        </footer>
  )
}
