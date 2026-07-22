"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sparkles, Loader2 } from "lucide-react"

export default function AuthPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSignUp, setIsSignUp] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { createClient } = await import("@/lib/supabase/client")
      const supabase = createClient()

      if (isSignUp) {
        const { error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: `${window.location.origin}/auth/callback` } })
        if (error) throw error
        router.push("/dashboard")
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        router.push("/dashboard")
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Authentication failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-20">
        <Card className="w-full max-w-md mx-6">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-100">
                <Sparkles className="h-6 w-6 text-violet-600" />
              </div>
            </div>
            <CardTitle>{isSignUp ? "Create your account" : "Welcome back"}</CardTitle>
            <CardDescription>
              {isSignUp ? "Start creating content in seconds. No credit card required." : "Sign in to your account to continue."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="rounded-xl bg-red-50 border border-red-200 p-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="hi@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
              <Button type="submit" className="w-full h-12" variant="gradient" size="lg" disabled={loading}>
                {loading ? <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Loading...</> : isSignUp ? "Create Account" : "Sign In"}
              </Button>
              <p className="text-center text-sm text-neutral-500">
                {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
                <button type="button" onClick={() => setIsSignUp(!isSignUp)} className="text-violet-600 font-medium hover:underline">
                  {isSignUp ? "Sign in" : "Sign up"}
                </button>
              </p>
            </form>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </>
  )
}
