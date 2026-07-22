"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { SITE_NAME } from "@/lib/constants"
import { Sparkles } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import type { User as SupabaseUser } from "@supabase/supabase-js"

export function Navbar() {
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then((result: { data: { user: SupabaseUser | null } }) => {
      setUser(result.data.user)
      setLoading(false)
    })
  }, [])

  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-200/80 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight">
          <Sparkles className="h-5 w-5 text-violet-600" />
          {SITE_NAME}
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-600">
          <Link href="/#features" className="hover:text-neutral-900 transition-colors">Features</Link>
          <Link href="/#how-it-works" className="hover:text-neutral-900 transition-colors">How it Works</Link>
          <Link href="/pricing" className="hover:text-neutral-900 transition-colors">Pricing</Link>
        </nav>
        <div className="flex items-center gap-3">
          {loading ? null : user ? (
            <Link href="/dashboard">
              <Avatar className="h-8 w-8 cursor-pointer">
                <AvatarFallback className="text-xs bg-violet-100 text-violet-700">
                  {user.email?.[0]?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
            </Link>
          ) : (
            <>
              <Link href="/auth">
                <Button variant="ghost" size="sm">Sign In</Button>
              </Link>
              <Link href="/auth?signup=true">
                <Button variant="gradient" size="sm">Start Free</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
