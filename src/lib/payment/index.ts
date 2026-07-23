import { createClient } from "@/lib/supabase/server"
import { PLANS } from "@/lib/plans"
import type { PlanId } from "@/lib/plans"

const NP_API = "https://api.nowpayments.io/v1"

async function nowpaymentsFetch(path: string, body: Record<string, unknown>): Promise<any> {
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

  const text = await res.text()
  let data: any
  try { data = JSON.parse(text) } catch { data = { raw: text } }
  if (!res.ok) {
    console.error("NOWPayments error response:", res.status, text)
    throw new Error(`NOWPayments error: ${data.message || data.error || res.status}`)
  }
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
    success_url: `${origin}/dashboard/billing?success=true`,
    cancel_url: `${origin}/pricing?cancelled=true`,
    is_fixed_rate: true,
    is_fee_paid_by_user: true,
    customer_email: userEmail,
  })

  return { url: data.invoice_url, invoiceId: data.id?.toString() || "" }
}

export async function handleNowPaymentsWebhook(payload: Record<string, unknown>) {
  const supabase = await createClient()
  const orderId = (payload.order_id || "").toString()
  const status = (payload.payment_status || "").toString()

  if (status !== "finished" && status !== "confirmed") return

  const parts = orderId.split("_")
  const userId = parts[0]
  const planId = parts[1] || "pro"

  if (!userId) return

  const existing = await supabase.from("user_subscriptions").select("id").eq("user_id", userId).single()

  if (existing.data) {
    await supabase
      .from("user_subscriptions")
      .update({ status: "active", plan_id: planId, updated_at: new Date().toISOString() })
      .eq("user_id", userId)
  } else {
    await supabase.from("user_subscriptions").insert({
      user_id: userId,
      status: "active",
      plan_id: planId,
    })
  }
}

export async function getUserPlan(userId: string): Promise<{ plan: PlanId; postsUsed: number; postsLimit: number }> {
  const supabase = await createClient()

  const { data: sub } = await supabase
    .from("user_subscriptions")
    .select("status, plan_id")
    .eq("user_id", userId)
    .single()

  const isPaid = sub?.status === "active" && (sub?.plan_id === "pro" || sub?.plan_id === "business")
  const planId: PlanId = isPaid ? (sub!.plan_id as PlanId) : "free"
  const plan = PLANS.find((p) => p.id === planId) || PLANS[0]

  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()

  const { count } = await supabase
    .from("generated_posts")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .gte("created_at", startOfMonth)

  return { plan: planId, postsUsed: count || 0, postsLimit: plan.posts }
}
