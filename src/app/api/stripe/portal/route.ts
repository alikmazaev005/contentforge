import { NextResponse } from "next/server"
import { getStripeClient } from "@/lib/stripe/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const { data: subscription } = await supabase
      .from("user_subscriptions")
      .select("stripe_customer_id")
      .eq("user_id", user.id)
      .single()

    const stripe = getStripeClient()
    const session = await stripe.billingPortal.sessions.create({
      customer: subscription?.stripe_customer_id || (await createStripeCustomer(user.id, user.email!)),
      return_url: request.headers.get("origin") + "/dashboard",
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error("Portal error:", error)
    return NextResponse.json({ error: "Failed to create portal session" }, { status: 500 })
  }
}

async function createStripeCustomer(userId: string, email: string): Promise<string> {
  const stripe = getStripeClient()
  const customer = await stripe.customers.create({ email, metadata: { userId } })
  return customer.id
}
