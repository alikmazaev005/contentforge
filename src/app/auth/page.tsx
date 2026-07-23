"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sparkles, Loader2, ArrowLeft, MailCheck } from "lucide-react"

type Mode = "signin" | "signup" | "forgot" | "check-email"

export default function AuthPage() {
  const [mode, setMode] = useState<Mode>("signin")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const honeypotRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (searchParams.get("signup") === "true") {
      setMode("signup")
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (honeypotRef.current?.value) return
    setLoading(true)
    setError(null)
    setSuccessMessage(null)

    try {
      const { createClient } = await import("@/lib/supabase/client")
      const supabase = createClient()

      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
        })
        if (error) throw error
        setMode("check-email")
        setSuccessMessage(`We sent a confirmation link to ${email}. Click it to activate your account.`)
        return
      }

      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        router.push("/dashboard")
        return
      }

      if (mode === "forgot") {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/auth/update-password`,
        })
        if (error) throw error
        setMode("check-email")
        setSuccessMessage(`We sent a password reset link to ${email}.`)
        return
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
                {mode === "check-email" ? (
                  <MailCheck className="h-6 w-6 text-violet-600" />
                ) : (
                  <Sparkles className="h-6 w-6 text-violet-600" />
                )}
              </div>
            </div>

            {mode === "check-email" ? (
              <>
                <CardTitle>Check your email</CardTitle>
                <CardDescription>{successMessage}</CardDescription>
              </>
            ) : mode === "forgot" ? (
              <>
                <CardTitle>Reset your password</CardTitle>
                <CardDescription>Enter your email and we&apos;ll send you a reset link.</CardDescription>
              </>
            ) : mode === "signup" ? (
              <>
                <CardTitle>Create your account</CardTitle>
                <CardDescription>Start creating content in seconds. No credit card required.</CardDescription>
              </>
            ) : (
              <>
                <CardTitle>Welcome back</CardTitle>
                <CardDescription>Sign in to your account to continue.</CardDescription>
              </>
            )}
          </CardHeader>

          <CardContent>
            {mode === "check-email" ? (
              <div className="space-y-4">
                <p className="text-sm text-neutral-600 text-center leading-relaxed">
                  {successMessage}. You can close this page.
                </p>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => { setMode("signin"); setError(null); setSuccessMessage(null) }}
                >
                  Back to sign in
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  ref={honeypotRef}
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  style={{ position: "absolute", left: "-9999px" }}
                  aria-hidden="true"
                />

                {error && (
                  <div className="rounded-xl bg-red-50 border border-red-200 p-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="hi@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete={mode === "forgot" ? "email" : "username"}
                  />
                </div>

                {mode !== "forgot" && (
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                      autoComplete={mode === "signup" ? "new-password" : "current-password"}
                    />
                  </div>
                )}

                {mode === "signin" && (
                  <div className="text-right">
                    <button
                      type="button"
                      onClick={() => { setMode("forgot"); setError(null) }}
                      className="text-sm text-violet-600 hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>
                )}

                <Button type="submit" className="w-full h-12" variant="gradient" size="lg" disabled={loading}>
                  {loading ? (
                    <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Loading...</>
                  ) : mode === "forgot" ? (
                    "Send Reset Link"
                  ) : mode === "signup" ? (
                    "Create Account"
                  ) : (
                    "Sign In"
                  )}
                </Button>

                <p className="text-center text-sm text-neutral-500">
                  {mode === "forgot" ? (
                    <button
                      type="button"
                      onClick={() => { setMode("signin"); setError(null) }}
                      className="text-violet-600 font-medium hover:underline"
                    >
                      Back to sign in
                    </button>
                  ) : mode === "signup" ? (
                    <>
                      Already have an account?{" "}
                      <button
                        type="button"
                        onClick={() => { setMode("signin"); setError(null) }}
                        className="text-violet-600 font-medium hover:underline"
                      >
                        Sign in
                      </button>
                    </>
                  ) : (
                    <>
                      Don&apos;t have an account?{" "}
                      <button
                        type="button"
                        onClick={() => { setMode("signup"); setError(null) }}
                        className="text-violet-600 font-medium hover:underline"
                      >
                        Sign up
                      </button>
                    </>
                  )}
                </p>
              </form>
            )}
          </CardContent>
        </Card>
      </main>
      <Footer />
    </>
  )
}
