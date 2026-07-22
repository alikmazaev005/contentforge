export async function createLemonsqueezyCheckout(
  variantId: string,
  userId: string,
  userEmail: string,
  successUrl: string
): Promise<string | null> {
  const apiKey = process.env.LEMONSQUEEZY_API_KEY
  const storeId = process.env.LEMONSQUEEZY_STORE_ID

  if (!apiKey || !storeId || !variantId) {
    return null
  }

  try {
    const res = await fetch("https://api.lemonsqueezy.com/v1/checkouts", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        data: {
          type: "checkouts",
          attributes: {
            checkout_data: {
              email: userEmail,
              custom: { user_id: userId },
              success_url: successUrl,
            },
          },
          relationships: {
            store: { data: { type: "stores", id: storeId } },
            variant: { data: { type: "variants", id: variantId } },
          },
        },
      }),
    })

    const data = await res.json()
    return data?.data?.attributes?.url || null
  } catch (e) {
    console.error("Lemon Squeezy error:", e)
    return null
  }
}
