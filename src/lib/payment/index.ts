import type { PaymentProvider, PaymentResult, PaymentPlan } from "./types"
import { createLemonsqueezyCheckout } from "./lemonsqueezy"
import { createPaddleCheckout } from "./paddle"
import { createYooKassaPayment } from "./yookassa"
import { getCryptoPaymentInfo } from "./crypto"

export const PLANS = [
  { id: "pro", name: "Pro", price: 9, posts: 50, features: ["50 posts/month", "All 6 platforms", "AI image generation", "6 languages", "Brand voice profile"], popular: true },
  { id: "business", name: "Business", price: 29, posts: 200, features: ["200 posts/month", "All 6 platforms", "AI image generation", "6 languages", "Team collaboration", "Priority support"], popular: false },
] as const

export const PROVIDER_INFO: Record<PaymentProvider, { name: string; icon: string; description: string }> = {
  lemonsqueezy: { name: "Lemon Squeezy", icon: "🍋", description: "Credit card, Apple Pay, Google Pay" },
  paddle: { name: "Paddle", icon: "🛶", description: "Credit card, PayPal" },
  yookassa: { name: "ЮKassa", icon: "💳", description: "Карты, СБП, ЮMoney" },
  crypto: { name: "Crypto", icon: "₿", description: "USDT (TRC-20)" },
}

export async function createPayment(
  provider: PaymentProvider,
  plan: PaymentPlan,
  userId: string,
  userEmail: string
): Promise<PaymentResult> {
  const origin = process.env.NEXT_PUBLIC_SITE_URL || "https://socialbloom-psi.vercel.app"
  const successUrl = `${origin}/dashboard?success=true`

  switch (provider) {
    case "lemonsqueezy": {
      const url = await createLemonsqueezyCheckout(plan.priceId, userId, userEmail, successUrl)
      if (!url) throw new Error("Lemon Squeezy checkout failed — check API keys and variant IDs")
      return { provider, url }
    }

    case "paddle": {
      const url = await createPaddleCheckout(plan.priceId, userId, userEmail, successUrl)
      if (!url) throw new Error("Paddle checkout failed — check API keys")
      return { provider, url }
    }

    case "yookassa": {
      const RUB_PRICES: Record<string, number> = { pro: 790, business: 2490 }
      const rubAmount = RUB_PRICES[plan.id] || Math.round(plan.price * 90)
      const url = await createYooKassaPayment(
        rubAmount,
        `ContentForge ${plan.name} — ${plan.posts} posts/month`,
        userId,
        userEmail,
        successUrl
      )
      if (!url) throw new Error("ЮKassa payment failed — check Shop ID and key")
      return { provider, url }
    }

    case "crypto": {
      const info = getCryptoPaymentInfo(plan.id, plan.price)
      if (!info) throw new Error("Crypto wallet not configured")
      return {
        provider,
        instructions: info.instructions,
        walletAddress: info.walletAddress,
      }
    }
  }
}
