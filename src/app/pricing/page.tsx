"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Loader2, Copy, Check, ExternalLink } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

const PLANS = [
  { id: "pro", name: "Pro", price: 9, rubPrice: 790, posts: 50, features: ["50 posts/month", "All 6 platforms", "AI image generation", "6 languages", "Brand voice profile"], popular: true },
  { id: "business", name: "Business", price: 29, rubPrice: 2490, posts: 200, features: ["200 posts/month", "All 6 platforms", "AI image generation", "6 languages", "Team collaboration", "Priority support"], popular: false },
]

const PROVIDERS = [
  { id: "lemonsqueezy", name: "Lemon Squeezy", flag: "🌎", desc: "Credit Card, Apple Pay, Google Pay", note: "Recommended for international users" },
  { id: "paddle", name: "Paddle", flag: "🌎", desc: "Card, PayPal", note: "Backup international option" },
  { id: "yookassa", name: "ЮKassa", flag: "🇷🇺", desc: "Карты, СБП, ЮMoney", note: "Для пользователей из РФ" },
  { id: "crypto", name: "Crypto", flag: "₿", desc: "USDT (TRC-20)", note: "Anonymous, one-click" },
] as const

type ProviderId = (typeof PROVIDERS)[number]["id"]

export default function PricingPage() {
  const [loading, setLoading] = useState<string | null>(null)
  const [provider, setProvider] = useState<ProviderId>("lemonsqueezy")
  const [cryptoInfo, setCryptoInfo] = useState<{ address: string; amount: string } | null>(null)
  const [copied, setCopied] = useState(false)
  const router = useRouter()

  const handleSubscribe = async (planId: string) => {
    setLoading(planId)
    setCryptoInfo(null)

    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push("/auth")
        return
      }

      if (provider === "crypto") {
        const plan = PLANS.find((p) => p.id === planId)
        if (plan) {
          setCryptoInfo({ address: "TBD", amount: plan.price.toString() })
        }
        setLoading(null)
        return
      }

      const res = await fetch("/api/payment/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider, planId }),
      })

      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else if (data.error) {
        alert(data.error)
      }
    } catch {
      alert("Payment failed. Please try again.")
    } finally {
      setLoading(null)
    }
  }

  const copyAddress = () => {
    if (cryptoInfo) {
      navigator.clipboard.writeText(cryptoInfo.address)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <>
      <Navbar />
      <main className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <Badge variant="violet" className="mb-4">Pricing</Badge>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Simple, transparent pricing</h1>
            <p className="mt-4 text-lg text-neutral-500">Start for free. Upgrade when you need more.</p>
          </div>

          <div className="mt-10 flex flex-wrap justify-center gap-2">
            {PROVIDERS.map((p) => (
              <button
                key={p.id}
                onClick={() => { setProvider(p.id); setCryptoInfo(null) }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all text-sm ${
                  provider === p.id
                    ? "border-violet-200 bg-violet-50 shadow-sm"
                    : "border-neutral-200 bg-white hover:border-neutral-300"
                }`}
              >
                <span className="text-base">{p.flag}</span>
                <span className="font-medium">{p.name}</span>
              </button>
            ))}
          </div>

          <div className="mt-2 text-center text-sm text-neutral-400">
            {PROVIDERS.find((p) => p.id === provider)?.note}
          </div>

          <div className="mt-10 grid gap-8 lg:grid-cols-2 max-w-3xl mx-auto">
            {PLANS.map((plan) => (
              <div key={plan.name} className={`relative rounded-2xl border p-8 ${plan.popular ? "border-violet-200 bg-violet-50/50 shadow-lg" : "border-neutral-200 bg-white"}`}>
                {plan.popular && <div className="absolute -top-3 left-1/2 -translate-x-1/2"><Badge variant="violet">Most Popular</Badge></div>}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold">{plan.name}</h3>
                  <div className="mt-2 flex items-baseline gap-1">
                    {provider !== "yookassa" ? (
                      <>
                        <span className="text-4xl font-bold">${plan.price}</span>
                        <span className="text-sm text-neutral-400">/month</span>
                      </>
                    ) : (
                      <>
                        <span className="text-4xl font-bold">{plan.rubPrice} ₽</span>
                        <span className="text-sm text-neutral-400">/мес</span>
                      </>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-neutral-500">{plan.posts} posts included</p>
                </div>
                <ul className="mb-8 space-y-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-neutral-600">
                      <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button
                  onClick={() => handleSubscribe(plan.id)}
                  disabled={loading === plan.id}
                  className="w-full h-12"
                  variant={plan.popular ? "gradient" : "outline"}
                  size="lg"
                >
                  {loading === plan.id ? (
                    <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Processing...</>
                  ) : provider === "crypto" ? (
                    "Pay with USDT"
                  ) : provider === "yookassa" ? (
                    `Оплатить ${plan.rubPrice} ₽`
                  ) : (
                    "Subscribe"
                  )}
                </Button>

                {cryptoInfo && loading === plan.id && (
                  <div className="mt-4 p-4 bg-neutral-50 rounded-xl border text-sm space-y-2">
                    <p className="font-medium">Send USDT (TRC-20):</p>
                    <div className="flex items-center gap-2 bg-white rounded-lg border p-2">
                      <code className="flex-1 text-xs break-all">{cryptoInfo.address}</code>
                      <button onClick={copyAddress} className="shrink-0 p-1.5 hover:bg-neutral-100 rounded-lg">
                        {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4 text-neutral-400" />}
                      </button>
                    </div>
                    <p className="text-neutral-500 text-xs">
                      After payment, send TXID to @contentforge support for activation.
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
