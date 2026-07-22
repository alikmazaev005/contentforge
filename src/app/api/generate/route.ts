import { NextResponse } from "next/server"
import { generatePosts } from "@/lib/ai"
import { createClient } from "@/lib/supabase/server"
import { createClient as createAdminClient } from "@supabase/supabase-js"
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
    const { topic, platforms, tone, language } = body

    if (!topic || !platforms?.length) {
      return NextResponse.json({ error: "Topic and platforms are required" }, { status: 400 })
    }

    const posts = await generatePosts(body)

    const supabase = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SERVICE_ROLE_KEY!,
      { auth: { persistSession: false, autoRefreshToken: false } }
    )

    const inserts = posts.map((post) => ({
      user_id: userId,
      topic: topic.trim(),
      platform: post.platform,
      content: post.content,
      language,
      tone,
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
