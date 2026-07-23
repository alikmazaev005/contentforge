import Link from "next/link"
import { Sparkles } from "lucide-react"
import { SITE_NAME } from "@/lib/constants"

export function Footer() {
  return (
    <footer className="border-t border-neutral-200 bg-neutral-50">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg">
            <Sparkles className="h-4 w-4 text-violet-600" />
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
    </footer>
  )
}
