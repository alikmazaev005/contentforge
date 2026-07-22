import { createClient } from "@/lib/supabase/server"

export const PLANS = [
  { id: "pro", name: "Pro", price: 9, rubPrice: 790, posts: 50, features: ["50 posts/month", "All 6 platforms", "AI image generation", "6 languages", "Brand voice profile"], popular: true },
  { id: "business", name: "Business", price: 29, rubPrice: 2490, posts: 200, features: ["200 posts/month", "All 6 platforms", "AI image generation", "6 languages", "Team collaboration", "Priority support"], popular: false },
] as const

const NP_API = "https://api.nowpayments.io/v1"

async function nowpaymentsFetch(path: string, body: Record<string, unknown>) {
  const apiKey = process.env.NOWPAYMENTS_API_KEY
  if (!apiKey) throw new Error("NOWPAYMENTS_API_KEY not configured")

  const res = await fetch(`${NP_API}${path}`, {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  })

  const data = await res.json()
  if (!res.ok) throw new Error(`NOWPayments error: ${data.message || data.error || res.status}`)
  return data
}

export async function createNowPaymentsInvoice(
  amount: number,
  planId: string,
  userId: string,
  userEmail: string
): Promise<{ url: string; invoiceId: string }> {
  const origin = process.env.NEXT_PUBLIC_SITE_URL || "https://socialbloom-psi.vercel.app"

  const data = await nowpaymentsFetch("/invoice", {
    price_amount: amount,
    price_currency: "usd",
    order_id: `${userId}_${planId}_${Date.now()}`,
    order_description: `ContentForge ${planId === "pro" ? "Pro" : "Business"} subscription`,
    ipn_callback_url: `${origin}/api/payment/webhook`,
    success_url: `${origin}/dashboard?success=true`,
    cancel_url: `${origin}/pricing?cancelled=true`,
    is_fixed_rate: true,
    is_fee_paid_by_user: true,
    payout_address: process.env.CRYPTO_WALLET_ADDRESS,
    payout_currency: "usdttrc20",
    customer_email: userEmail,
    customer_id: userId,
  })

  return { url: data.invoice_url, invoiceId: data.id?.toString() || "" }
}

export async function handleNowPaymentsWebhook(payload: Record<string, unknown>) {
  const supabase = await createClient()
  const invoiceId = payload.invoice_id?.toString()
  const orderId = (payload.order_id || "").toString()
  const status = (payload.payment_status || "").toString()

  if (status !== "finished" && status !== "confirmed") return

  const userId = orderId.split("_")[0]
  const planId = orderId.split("_")[1]

  if (!userId || !planId) return

  const existing = await supabase.from("user_subscriptions").select("id").eq("user_id", userId).single()

  if (existing.data) {
    await supabase
      .from("user_subscriptions")
      .update({ status: "active", updated_at: new Date().toISOString() })
      .eq("user_id", userId)
  } else {
    await supabase.from("user_subscriptions").insert({
      user_id: userId,
      status: "active",
    })
  }
}
