import { NextResponse } from "next/server"
import { handleNowPaymentsWebhook } from "@/lib/payment"

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const status = body.payment_status || ""
    if (!status) return NextResponse.json({ received: true })

    await handleNowPaymentsWebhook(body)
    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 })
  }
}
