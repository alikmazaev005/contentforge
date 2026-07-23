"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Sparkles, Loader2, ArrowLeft, CheckCircle, XCircle, ExternalLink, PartyPopper } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { PLANS } from "@/lib/payment"

interface Subscription {
  status: string
  plan_id: string
  created_at: string
  updated_at: string
}

interface Usage {
  used: number
  limit: number
}

export default function BillingPage() {
  const [user, setUser] = useState<any>(null)
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [usage, setUsage] = useState<Usage | null>(null)
  const [initialLoading, setInitialLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const init = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push("/auth"); return }
      setUser(user)

      const { data: sub } = await supabase
        .from("user_subscriptions")
        .select("status, plan_id, created_at, updated_at")
        .eq("user_id", user.id)
        .single()

      if (sub) setSubscription(sub)

      const planId = sub?.plan_id === "pro" || sub?.plan_id === "business" ? sub.plan_id : "free"
      const plan = PLANS.find((p) => p.id === planId) || PLANS[0]

      const now = new Date()
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()

      const { count } = await supabase
        .from("generated_posts")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .gte("created_at", startOfMonth)

      setUsage({ used: count || 0, limit: plan.posts })
      setInitialLoading(false)
    }
    init()
  }, [router])

  if (initialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
      </div>
    )
  }

  const isPaid = subscription?.status === "active"
  const planId = isPaid ? (subscription?.plan_id || "free") : "free"
  const plan = PLANS.find((p) => p.id === planId) || PLANS[0]
  const usagePercent = usage ? Math.min(Math.round((usage.used / usage.limit) * 100), 100) : 0

  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm"><ArrowLeft className="h-4 w-4 mr-1.5" /> Back</Button>
            </Link>
            <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
              <Sparkles className="h-5 w-5 text-violet-600" />
              ContentForge
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="text-xs bg-violet-100 text-violet-700">
                {user?.email?.[0]?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-12 space-y-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Billing & Plan</h1>
          <p className="text-neutral-500 mt-1">Manage your subscription and view usage.</p>
        </div>

        {typeof window !== "undefined" && window.location.search.includes("success=true") && (
          <Card className="border-emerald-200 bg-emerald-50">
            <CardContent className="p-4 flex items-center gap-3">
              <PartyPopper className="h-5 w-5 text-emerald-600 shrink-0" />
              <p className="text-sm text-emerald-800 font-medium">Payment successful! Your subscription is being activated.</p>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                Current Plan
                {isPaid ? (
                  <Badge variant="violet">{plan.name}</Badge>
                ) : (
                  <Badge variant="secondary">Free</Badge>
                )}
              </CardTitle>
              <CardDescription>
                {isPaid
                  ? `$${plan.price}/month — started ${new Date(subscription!.created_at).toLocaleDateString()}`
                  : "No active subscription"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 text-sm">
                {isPaid ? (
                  <><CheckCircle className="h-4 w-4 text-emerald-500" /> Active</>
                ) : (
                  <><XCircle className="h-4 w-4 text-neutral-300" /> Inactive</>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-neutral-500">Posts this month</span>
                  <span className="font-medium">{usage?.used || 0} / {usage?.limit || 5}</span>
                </div>
                <div className="h-2 rounded-full bg-neutral-200 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      usagePercent > 80 ? "bg-red-500" : usagePercent > 50 ? "bg-amber-500" : "bg-violet-500"
                    }`}
                    style={{ width: `${usagePercent}%` }}
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {plan.features.map((f) => (
                  <Badge key={f} variant="secondary" className="text-xs">
                    <CheckCircle className="h-3 w-3 mr-1 text-emerald-500" /> {f}
                  </Badge>
                ))}
              </div>

              <div className="pt-2">
                {isPaid ? (
                  <Button variant="outline" size="sm" asChild>
                    <a href="mailto:support@contentforge.fun?subject=Cancel subscription">Cancel subscription</a>
                  </Button>
                ) : (
                  <Button variant="gradient" size="sm" asChild>
                    <Link href="/pricing">Upgrade plan</Link>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Payment History</CardTitle>
              <CardDescription>Recent invoices and payments.</CardDescription>
            </CardHeader>
            <CardContent>
              {isPaid ? (
                <div className="text-sm text-neutral-500 flex flex-col items-center justify-center py-8 text-center">
                  <ExternalLink className="h-8 w-8 text-neutral-300 mb-2" />
                  <p>Payments are processed via NOWPayments.</p>
                  <p className="mt-1">Check your email for receipts.</p>
                </div>
              ) : (
                <div className="text-sm text-neutral-500 flex flex-col items-center justify-center py-8 text-center">
                  <Sparkles className="h-8 w-8 text-neutral-300 mb-2" />
                  <p>No payments yet.</p>
                  <p className="mt-1">Upgrade to unlock more posts.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {PLANS.filter((p) => p.id !== "free").map((p) => {
            const current = p.id === planId
            return (
              <Card key={p.id} className={`relative ${current ? "ring-2 ring-violet-500" : ""}`}>
                {p.popular && !current && (
                  <Badge variant="violet" className="absolute -top-2.5 left-4">Popular</Badge>
                )}
                {current && (
                  <Badge variant="violet" className="absolute -top-2.5 left-4">Current</Badge>
                )}
                <CardHeader>
                  <CardTitle className="text-lg">{p.name}</CardTitle>
                  <CardDescription>
                    <span className="text-2xl font-bold text-neutral-900">${p.price}</span>
                    <span className="text-neutral-400">/month</span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm font-medium text-neutral-600">{p.posts} posts/month</p>
                  <div className="flex flex-wrap gap-1.5">
                    {p.features.map((f) => (
                      <Badge key={f} variant="secondary" className="text-xs">
                        <CheckCircle className="h-3 w-3 mr-1 text-emerald-500" /> {f}
                      </Badge>
                    ))}
                  </div>
                  {!current && (
                    <Button variant={p.popular ? "gradient" : "outline"} size="sm" className="w-full" asChild>
                      <Link href="/pricing">{isPaid ? "Change plan" : "Subscribe"}</Link>
                    </Button>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      </main>
    </div>
  )
}
