import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  try {
    const body = await request.text()
    const signature = request.headers.get("x-signature") || ""
    const provider = request.headers.get("x-provider") || "lemonsqueezy"

    const supabase = await createClient()

    if (provider === "lemonsqueezy") {
      const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET
      if (!secret) return NextResponse.json({ error: "Webhook not configured" }, { status: 500 })

      const crypto = await import("crypto")
      const expected = crypto
        .createHmac("sha256", secret)
        .update(body)
        .digest("hex")

      if (signature !== expected) {
        return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
      }

      const event = JSON.parse(body)
      if (event.meta?.event_name === "order_created") {
        const userId = event.meta?.custom_data?.user_id
        const status = event.data?.attributes?.status

        if (userId && status === "paid") {
          await supabase.from("user_subscriptions").upsert({
            user_id: userId,
            status: "active",
            updated_at: new Date().toISOString(),
          })
        }
      }
    }

    if (provider === "paddle") {
      const secret = process.env.PADDLE_WEBHOOK_SECRET
      if (!secret) return NextResponse.json({ error: "Webhook not configured" }, { status: 500 })

      const event = JSON.parse(body)
      if (event.event_type === "transaction.completed") {
        const userId = event.data?.custom_data?.user_id
        if (userId) {
          await supabase.from("user_subscriptions").upsert({
            user_id: userId,
            status: "active",
            updated_at: new Date().toISOString(),
          })
        }
      }
    }

    if (provider === "yookassa") {
      const event = JSON.parse(body)
      if (event.event === "payment.succeeded") {
        const userId = event.object?.metadata?.user_id
        if (userId) {
          await supabase.from("user_subscriptions").upsert({
            user_id: userId,
            status: "active",
            updated_at: new Date().toISOString(),
          })
        }
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Payment webhook error:", error)
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 })
  }
}
