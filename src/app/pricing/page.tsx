import Link from "next/link"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle } from "lucide-react"

const PLANS = [
  { name: "Free", price: "0", posts: "5", features: ["5 posts/month", "1 platform", "Basic tone control", "English only"], cta: "Get Started", popular: false },
  { name: "Pro", price: "9", posts: "50", features: ["50 posts/month", "All 6 platforms", "AI image generation", "6 languages", "Brand voice profile"], cta: "Start Free Trial", popular: true },
  { name: "Business", price: "29", posts: "200", features: ["200 posts/month", "All 6 platforms", "AI image generation", "6 languages", "Team collaboration", "Priority support"], cta: "Start Free Trial", popular: false },
]

export default function PricingPage() {
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
          <div className="mt-16 grid gap-8 lg:grid-cols-3 max-w-5xl mx-auto">
            {PLANS.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl border p-8 ${
                  plan.popular
                    ? "border-violet-200 bg-violet-50/50 shadow-lg"
                    : "border-neutral-200 bg-white"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge variant="violet">Most Popular</Badge>
                  </div>
                )}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold">{plan.name}</h3>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="text-4xl font-bold">${plan.price}</span>
                    <span className="text-sm text-neutral-400">/month</span>
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
                <Link href="/auth?signup=true">
                  <Button
                    className="w-full h-12"
                    variant={plan.popular ? "gradient" : "outline"}
                    size="lg"
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
