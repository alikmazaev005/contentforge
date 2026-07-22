import { NextResponse } from "next/server"
import type { GenerateRequest, GenerateResponse } from "@/lib/types"

const SYSTEM_PROMPT = `You are a professional social media content strategist. 
You create engaging, platform-optimized social media posts.
Rules:
- NO generic AI phrases like "unlock", "delve", "supercharge", "elevate"
- Each platform has different length and format requirements
- LinkedIn: professional, 200-300 words, paragraph style
- Twitter/X: punchy, under 280 chars, use threads if needed
- Instagram: conversational, emojis welcome, 100-150 words
- Facebook: casual, 80-120 words, question to engage
- TikTok: short, punchy, trend-aware, under 100 words
- Threads: conversational, personal, under 150 words
- Include relevant hashtags (3-5 per platform)
- NEVER use hashtags on LinkedIn (they hurt reach)
- If user provides brand voice info, match it exactly`

function getPlatformPrompt(platform: string, topic: string, tone: string): string {
  const formatRules: Record<string, string> = {
    linkedin: "Professional paragraph (200-300 words). NO hashtags. Focus on value and insights. End with a question to drive engagement.",
    twitter: "Punchy tweet under 280 characters. Can be a thread (1/X format). Include 2-3 relevant hashtags.",
    instagram: "Conversational caption (100-150 words). 3-5 relevant hashtags at the end. Emojis welcome.",
    facebook: "Casual, engaging post (80-120 words). End with a question. 1-2 hashtags max.",
    tiktok: "Short, punchy, trend-aware caption under 100 words. 3-4 hashtags. Hook in first 2 seconds (if video script).",
    threads: "Conversational, personal tone (under 150 words). Feel like a real person talking. 1-2 hashtags.",
  }
  return `${formatRules[platform] || formatRules.linkedin}\n\nTopic: "${topic}"\nTone: ${tone}\nCreate the post.`
}

export async function POST(request: Request) {
  try {
    const body: GenerateRequest = await request.json()
    const { topic, platforms, tone, language, includeImage } = body

    if (!topic || !platforms?.length) {
      return NextResponse.json({ error: "Topic and platforms are required" }, { status: 400 })
    }

    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: "API key not configured. Set OPENAI_API_KEY environment variable." },
        { status: 500 }
      )
    }

    const posts = await Promise.all(
      platforms.map(async (platform) => {
        const completion = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
              { role: "system", content: SYSTEM_PROMPT },
              {
                role: "user",
                content: `Language: ${language}\n\n${getPlatformPrompt(platform, topic, tone)}`,
              },
            ],
            max_tokens: 500,
          }),
        })

        const data = await completion.json()
        const content = data.choices?.[0]?.message?.content || ""

        const imagePrompt = includeImage
          ? `Social media post visual for ${platform} about: ${topic}. Professional, clean, modern design. No text overlays.`
          : undefined

        return {
          platform,
          content,
          hashtags: content.match(/#[\wа-яА-Я]+/g)?.slice(0, 5) || [],
          imagePrompt,
          imageUrl: undefined,
          characterCount: content.length,
        }
      })
    )

    const response: GenerateResponse = { posts }
    return NextResponse.json(response)
  } catch (error) {
    console.error("Generation error:", error)
    return NextResponse.json({ error: "Failed to generate content" }, { status: 500 })
  }
}
