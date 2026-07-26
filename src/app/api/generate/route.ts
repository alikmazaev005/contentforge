import { NextResponse } from "next/server"
import { generatePosts } from "@/lib/ai"
import { generateImage } from "@/lib/ai/generate-image"
import { createClient } from "@/lib/supabase/server"
import { createClient as createAdminClient } from "@supabase/supabase-js"
import { PLANS } from "@/lib/plans"
import { getUserPlan } from "@/lib/payment"
import type { GenerateRequest } from "@/lib/types"

export async function POST(request: Request) {
  try {
    let userId: string | null = null

    const authHeader = request.headers.get("authorization")
    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.slice(7)
      const admin = createAdminClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SERVICE_ROLE_KEY!,
        { auth: { persistSession: false, autoRefreshToken: false } }
      )
      const { data: { user }, error } = await admin.auth.getUser(token)
      if (user) userId = user.id
    }

    if (!userId) {
      const supabase = await createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) userId = user.id
    }

    if (!userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const body: GenerateRequest = await request.json()
    const { topic, platforms, tone, language, includeImage } = body

    if (!topic || !platforms?.length) {
      return NextResponse.json({ error: "Topic and platforms are required" }, { status: 400 })
    }

    const { plan, postsUsed, postsLimit } = await getUserPlan(userId)

    // Enforce platform limit for free plan
    const PLAN_PLATFORM_LIMITS: Record<string, number> = { free: 2, pro: 6, business: 6 }
    const maxPlatforms = PLAN_PLATFORM_LIMITS[plan] || 6
    if (platforms.length > maxPlatforms) {
      return NextResponse.json({
        error: `Free plan allows up to ${maxPlatforms} platforms. Select ${maxPlatforms} or upgrade to Pro for all platforms.`,
      }, { status: 403 })
    }

    const newCount = postsUsed + platforms.length
    if (newCount > postsLimit) {
      return NextResponse.json({
        error: `You've used ${postsUsed}/${postsLimit} posts this month. ${plan === "free" ? "Upgrade to Pro for unlimited posts." : "Upgrade or wait for next billing cycle."}`,
        limit: { used: postsUsed, limit: postsLimit, plan },
      }, { status: 403 })
    }

    const posts = await generatePosts(body)

    const supabase = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SERVICE_ROLE_KEY!,
      { auth: { persistSession: false, autoRefreshToken: false } }
    )

    const imagePromises = posts.map(async (post, index) => {
      if (!includeImage || !post.imagePrompt) return

      let imageUrl = await generateImage(post.imagePrompt, userId!, post.platform)

// Apply watermark for free plan users
if (imageUrl && plan === "free") {
  imageUrl = `${imageUrl}?watermark=1`
}
      if (imageUrl) {
        posts[index].imageUrl = imageUrl
      }

      await new Promise((r) => setTimeout(r, index * 500))
    })

    await Promise.all(imagePromises)

    const inserts = posts.map((post) => ({
      user_id: userId,
      topic: topic.trim(),
      platform: post.platform,
      content: post.content,
      language,
      tone,
      image_url: post.imageUrl || null,
    }))

    const { error: dbError } = await supabase.from("generated_posts").insert(inserts)
    if (dbError) console.error("Save error:", dbError)

    return NextResponse.json({ posts })
  } catch (error) {
    console.error("Generation error:", error)
    const message = error instanceof Error ? error.message : "Failed to generate content"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
