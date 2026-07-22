import { NextResponse } from "next/server"
import { generatePosts } from "@/lib/ai"
import type { GenerateRequest } from "@/lib/types"

export async function POST(request: Request) {
  try {
    const body: GenerateRequest = await request.json()
    const { topic, platforms } = body

    if (!topic || !platforms?.length) {
      return NextResponse.json({ error: "Topic and platforms are required" }, { status: 400 })
    }

    const posts = await generatePosts(body)
    return NextResponse.json({ posts })
  } catch (error) {
    console.error("Generation error:", error)
    const message = error instanceof Error ? error.message : "Failed to generate content"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
