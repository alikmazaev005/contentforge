"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Captcha } from "@/components/Captcha"
import { Sparkles, Loader2, MailCheck } from "lucide-react"

type Mode = "signin" | "signup" | "forgot" | "check-email"

function AuthForm() {
  const [mode, setMode] = useState<Mode>("signin")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [captchaToken, setCaptchaToken] = useState("")
  const honeypotRef = useRef<HTMLInputElement>(null)
  const siteKey = typeof window !== "undefined"
    ? process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY
    : ""
  const router = useRouter()

  useEffect(() => {
    if (window.location.search.includes("signup=true")) {
      setMode("signup")
    }
  }, [])

  const handleOAuth = async (provider: "google" | "github") => {
    setLoading(true)
    setError(null)
    try {
      const { createClient } = await import("@/lib/supabase/client")
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo: `${window.location.origin}/auth/callback` },
      })
      if (error) throw error
    } catch (e) {
      setError(e instanceof Error ? e.message : "OAuth failed")
      setLoading(false)
    }
  }

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    if (honeypotRef.current?.value) return
    if (siteKey && !captchaToken) {
      setError("Please complete the security check.")
      return
    }
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
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
            captchaToken: captchaToken || undefined,
          },
        })
        if (error) throw error
        setMode("check-email")
        setSuccessMessage(`We sent a confirmation link to ${email}. Click it to activate your account.`)
        return
      }

      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
          options: { captchaToken: captchaToken || undefined },
        })
        if (error) throw error
        router.push("/dashboard")
        return
      }

      if (mode === "forgot") {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/auth/update-password`,
          captchaToken: captchaToken || undefined,
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
  }, [mode, email, password, captchaToken, siteKey, router])

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
              <>
                {mode !== "forgot" && (
                  <div className="space-y-3 mb-6">
                    <Button
                      variant="outline"
                      className="w-full h-11 gap-3"
                      onClick={() => handleOAuth("google")}
                      disabled={loading}
                    >
                      <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                      </svg>
                      Continue with Google
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full h-11 gap-3"
                      onClick={() => handleOAuth("github")}
                      disabled={loading}
                    >
                      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
                        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.38.6.11.82-.26.82-.58 0-.28-.01-1.04-.02-2.05-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.1-.75.08-.74.08-.74 1.21.09 1.85 1.24 1.85 1.24 1.08 1.84 2.83 1.31 3.52 1 .11-.78.42-1.31.76-1.61-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23.96-.27 1.98-.4 3-.4s2.04.13 3 .4c2.29-1.55 3.3-1.23 3.3-1.23.66 1.66.24 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.8 5.63-5.48 5.92.43.37.82 1.1.82 2.22 0 1.61-.01 2.9-.01 3.3 0 .32.22.7.83.58C20.56 21.8 24 17.3 24 12 24 5.37 18.63 0 12 0z" />
                      </svg>
                      Continue with GitHub
                    </Button>
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-neutral-200" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-white px-3 text-neutral-400">or continue with email</span>
                      </div>
                    </div>
                  </div>
                )}

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

                  {siteKey && <Captcha onToken={setCaptchaToken} />}

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
              </>
            )}
          </CardContent>
        </Card>
      </main>
      <Footer />
    </>
  )
}

export default function AuthPage() {
  return <AuthForm />
}
