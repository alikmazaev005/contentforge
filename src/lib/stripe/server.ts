import Stripe from "stripe"

let _stripe: Stripe | null = null

export function getStripeClient(): Stripe {
  if (_stripe) return _stripe
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) throw new Error("Missing STRIPE_SECRET_KEY")
  _stripe = new Stripe(key, { apiVersion: "2025-03-31.basil" as any, typescript: true })
  return _stripe
}

export const PRICE_IDS = {
  pro: process.env.STRIPE_PRICE_PRO,
  business: process.env.STRIPE_PRICE_BUSINESS,
} as const
