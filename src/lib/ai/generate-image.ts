import { createClient } from "@supabase/supabase-js"

const CF_API = "https://api.cloudflare.com/client/v4/accounts"

export async function generateImage(prompt: string, userId: string, platform: string): Promise<string | null> {
  const apiToken = process.env.CF_API_TOKEN
  const accountId = process.env.CF_ACCOUNT_ID
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SERVICE_ROLE_KEY

  if (!apiToken || !accountId || !supabaseUrl || !supabaseKey) {
    console.warn("Image generation: missing credentials")
    return null
  }

  const model = "@cf/bytedance/stable-diffusion-xl-lightning"

  const res = await fetch(`${CF_API}/${accountId}/ai/run/${model}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prompt }),
  })

  if (!res.ok) {
    console.error("Image generation failed:", res.status, await res.text())
    return null
  }

  const contentType = res.headers.get("content-type") || "image/png"
  const ext = contentType === "image/jpeg" ? "jpg" : contentType === "image/webp" ? "webp" : "png"
  const buffer = await res.arrayBuffer()
  const file = new Uint8Array(buffer)

  const fileName = `${userId}/${platform}-${Date.now()}.${ext}`

  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })

  const { data, error } = await supabase.storage
    .from("generated-images")
    .upload(fileName, file, {
      contentType,
      upsert: false,
    })

  if (error) {
    console.error("Storage upload error:", error.message)
    return null
  }

  const { data: { publicUrl } } = supabase.storage
    .from("generated-images")
    .getPublicUrl(fileName)

  return publicUrl
}
