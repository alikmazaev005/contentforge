import { NextResponse } from "next/server"
import { getStripeClient } from "@/lib/stripe/server"
import { createClient } from "@/lib/supabase/server"

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET

export async function POST(request: Request) {
  try {
    const body = await request.text()
    const sig = request.headers.get("stripe-signature")!

    const stripe = getStripeClient()
    let event
    try {
      event = stripe.webhooks.constructEvent(body, sig, endpointSecret!)
    } catch {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
    }

    const supabase = await createClient()

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object
        const userId = session.metadata?.userId
        if (userId) {
          await supabase.from("user_subscriptions").upsert({
            user_id: userId,
            stripe_customer_id: session.customer as string,
            stripe_subscription_id: session.subscription as string,
            status: "active",
            updated_at: new Date().toISOString(),
          })
        }
        break
      }

      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const subscription = event.data.object
        const userId = subscription.metadata?.userId
        if (userId) {
          const status = subscription.status === "active" ? "active" : "cancelled"
          await supabase.from("user_subscriptions").upsert({
            user_id: userId,
            stripe_subscription_id: subscription.id,
            status,
            updated_at: new Date().toISOString(),
          })
        }
        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 })
  }
}
