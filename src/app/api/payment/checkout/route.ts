import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createPayment } from "@/lib/payment"

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const { provider, planId } = await request.json()

    if (!provider || !planId) {
      return NextResponse.json({ error: "Provider and planId required" }, { status: 400 })
    }

    const { PLANS } = await import("@/lib/payment")
    const plan = PLANS.find((p) => p.id === planId)
    if (!plan) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 })
    }

    const priceIds: Record<string, Record<string, string>> = {
      lemonsqueezy: {
        pro: process.env.LEMONSQUEEZY_VARIANT_PRO || "",
        business: process.env.LEMONSQUEEZY_VARIANT_BUSINESS || "",
      },
      paddle: {
        pro: process.env.PADDLE_PRICE_PRO || "",
        business: process.env.PADDLE_PRICE_BUSINESS || "",
      },
    }

    const result = await createPayment(
      provider,
      { ...plan, priceId: priceIds[provider]?.[planId] || planId },
      user.id,
      user.email || ""
    )

    return NextResponse.json(result)
  } catch (error) {
    console.error("Payment checkout error:", error)
    const message = error instanceof Error ? error.message : "Checkout failed"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
