export async function createYooKassaPayment(
  amount: number,
  description: string,
  userId: string,
  userEmail: string,
  successUrl: string
): Promise<string | null> {
  const shopId = process.env.YOOKASSA_SHOP_ID
  const secretKey = process.env.YOOKASSA_SECRET_KEY

  if (!shopId || !secretKey) {
    return null
  }

  const auth = Buffer.from(`${shopId}:${secretKey}`).toString("base64")

  try {
    const idempotenceKey = `${userId}-${Date.now()}`
    const res = await fetch("https://api.yookassa.ru/v3/payments", {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/json",
        "Idempotence-Key": idempotenceKey,
      },
      body: JSON.stringify({
        amount: { value: amount.toFixed(2), currency: "RUB" },
        confirmation: { type: "redirect", return_url: successUrl },
        capture: true,
        description,
        metadata: { user_id: userId },
        receipt: {
          customer: { email: userEmail },
          items: [
            {
              description,
              quantity: "1.00",
              amount: { value: amount.toFixed(2), currency: "RUB" },
              vat_code: 1,
            },
          ],
        },
      }),
    })

    const data = await res.json()
    return data?.confirmation?.confirmation_url || null
  } catch (e) {
    console.error("YooKassa error:", e)
    return null
  }
}
