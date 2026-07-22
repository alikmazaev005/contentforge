import { NextResponse } from "next/server"
import { generatePosts } from "@/lib/ai"
import { createClient } from "@/lib/supabase/server"
import type { GenerateRequest } from "@/lib/types"

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const body: GenerateRequest = await request.json()
    const { topic, platforms, tone, language } = body

    if (!topic || !platforms?.length) {
      return NextResponse.json({ error: "Topic and platforms are required" }, { status: 400 })
    }

    const posts = await generatePosts(body)

    const inserts = posts.map((post) => ({
      user_id: user.id,
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
