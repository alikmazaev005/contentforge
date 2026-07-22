export async function createPaddleCheckout(
  priceId: string,
  userId: string,
  userEmail: string,
  successUrl: string
): Promise<string | null> {
  const apiKey = process.env.PADDLE_API_KEY

  if (!apiKey || !priceId) {
    return null
  }

  try {
    const res = await fetch("https://api.paddle.com/checkout/custom", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        items: [{ price_id: priceId, quantity: 1 }],
        customer: { email: userEmail },
        custom_data: { user_id: userId },
        success_url: successUrl,
      }),
    })

    const data = await res.json()
    return data?.data?.url || null
  } catch (e) {
    console.error("Paddle error:", e)
    return null
  }
}
