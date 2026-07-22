export async function generateHuggingFace(prompt: string): Promise<string> {
  const apiKey = process.env.HF_API_KEY
  if (!apiKey) {
    throw new Error("HF_API_KEY required. Free at https://huggingface.co/settings/tokens")
  }

  const res = await fetch(
    "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.3",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_new_tokens: 800,
          temperature: 0.8,
        },
      }),
    }
  )

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`HuggingFace error (${res.status}): ${err}`)
  }

  const data = await res.json()

  if (data?.error) {
    throw new Error(`HuggingFace error: ${data.error}`)
  }

  const text = Array.isArray(data) ? data[0]?.generated_text : data?.generated_text
  if (!text) throw new Error("HuggingFace returned empty response")

  return text.trim()
}
