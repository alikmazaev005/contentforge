"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Loader2, Copy, Check } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

const PLANS = [
  { id: "pro", name: "Pro", price: 9, rubPrice: 790, posts: 50, features: ["50 posts/month", "All 6 platforms", "AI image generation", "6 languages", "Brand voice profile"], popular: true },
  { id: "business", name: "Business", price: 29, rubPrice: 2490, posts: 200, features: ["200 posts/month", "All 6 platforms", "AI image generation", "6 languages", "Team collaboration", "Priority support"], popular: false },
]

const PROVIDERS = [
  { id: "nowpayments", name: "NOWPayments", flag: "₿", desc: "Crypto / Card (любая страна)", note: "USDT, BTC, Visa/MC — без ограничений" },
  { id: "yookassa", name: "ЮKassa", flag: "🇷🇺", desc: "Карты РФ, СБП, ЮMoney", note: "Для пользователей из России" },
  { id: "crypto", name: "Crypto Direct", flag: "🔗", desc: "USDT (TRC-20)", note: "Отправьте USDT напрямую на кошелёк" },
] as const

export default function PricingPage() {
  const [loading, setLoading] = useState<string | null>(null)
  const [provider, setProvider] = useState<string>("nowpayments")
  const [copied, setCopied] = useState(false)
  const router = useRouter()

  const handleSubscribe = async (planId: string) => {
    setLoading(planId)

    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push("/auth")
        return
      }

      if (provider === "crypto") {
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
      alert("Payment failed. Try again.")
    } finally {
      setLoading(null)
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
            <p className="mt-4 text-lg text-neutral-500">Start for free. Pay with crypto or card.</p>
          </div>

          <div className="mt-10 flex flex-wrap justify-center gap-2">
            {PROVIDERS.map((p) => (
              <button
                key={p.id}
                onClick={() => setProvider(p.id)}
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

          {provider !== "crypto" && (
            <div className="mt-2 text-center text-sm text-neutral-400">
              {PROVIDERS.find((p) => p.id === provider)?.note}
            </div>
          )}

          {provider === "crypto" && (
            <CryptoInfo copied={copied} setCopied={setCopied} />
          )}

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
                  ) : provider === "yookassa" ? (
                    `Оплатить ${plan.rubPrice} ₽`
                  ) : provider === "crypto" ? (
                    `Send $${plan.price} USDT`
                  ) : (
                    "Subscribe"
                  )}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

function CryptoInfo({ copied, setCopied }: { copied: boolean; setCopied: (v: boolean) => void }) {
  const [address, setAddress] = useState("")

  useEffect(() => {
    fetch("/api/payment/crypto-address")
      .then((r) => r.json())
      .then((d) => d.address && setAddress(d.address))
      .catch(() => {})
  }, [])

  if (!address) return null

  return (
    <div className="mt-4 mx-auto max-w-lg p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm space-y-2">
      <p className="font-medium text-amber-800">₿ Pay with USDT (TRC-20)</p>
      <p className="text-amber-700 text-xs">Send exact amount to the address below. After payment, send TXID to support for activation.</p>
      <div className="flex items-center gap-2 bg-white rounded-lg border border-amber-200 p-2">
        <code className="flex-1 text-xs break-all">{address}</code>
        <button onClick={() => { navigator.clipboard.writeText(address); setCopied(true); setTimeout(() => setCopied(false), 2000) }} className="shrink-0 p-1.5 hover:bg-amber-50 rounded-lg">
          {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4 text-amber-600" />}
        </button>
      </div>
    </div>
  )
}
