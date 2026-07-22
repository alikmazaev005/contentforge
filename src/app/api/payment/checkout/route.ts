import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createNowPaymentsInvoice, PLANS } from "@/lib/payment"

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const { planId, provider } = await request.json()

    if (!planId) {
      return NextResponse.json({ error: "planId required" }, { status: 400 })
    }

    const plan = PLANS.find((p) => p.id === planId)
    if (!plan) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 })
    }

    if (provider === "yookassa") {
      const yooKey = process.env.YOOKASSA_SECRET_KEY
      const yooShopId = process.env.YOOKASSA_SHOP_ID
      if (!yooKey || !yooShopId) {
        return NextResponse.json({ error: "ЮKassa не настроена" }, { status: 500 })
      }

      const origin = process.env.NEXT_PUBLIC_SITE_URL || "https://socialbloom-psi.vercel.app"
      const auth = Buffer.from(`${yooShopId}:${yooKey}`).toString("base64")

      const res = await fetch("https://api.yookassa.ru/v3/payments", {
        method: "POST",
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/json",
          "Idempotence-Key": `${user.id}-${planId}-${Date.now()}`,
        },
        body: JSON.stringify({
          amount: { value: plan.rubPrice.toFixed(2), currency: "RUB" },
          confirmation: { type: "redirect", return_url: `${origin}/dashboard?success=true` },
          capture: true,
          description: `ContentForge ${plan.name}`,
          metadata: { user_id: user.id },
        }),
      })

      const data = await res.json()
      return NextResponse.json({ url: data.confirmation?.confirmation_url || null })
    }

    const result = await createNowPaymentsInvoice(plan.price, planId, user.id, user.email || "")
    return NextResponse.json({ url: result.url })
  } catch (error) {
    console.error("Checkout error:", error)
    const message = error instanceof Error ? error.message : "Checkout failed"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
