export async function generateCloudflare(prompt: string): Promise<string> {
  const apiToken = process.env.CF_API_TOKEN
  const accountId = process.env.CF_ACCOUNT_ID

  if (!apiToken || !accountId) {
    throw new Error("CF_API_TOKEN and CF_ACCOUNT_ID required. Free at https://dash.cloudflare.com")
  }

  const res = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/@cf/meta/llama-3.1-8b-instruct`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    }
  )

  const data = await res.json()

  if (!data.success) {
    const err = data.errors?.[0]?.message || JSON.stringify(data.errors)
    throw new Error(`Cloudflare AI error: ${err}`)
  }

  const text = data?.result?.response
  if (!text) throw new Error("Cloudflare AI returned empty response")

  return text.trim()
}
