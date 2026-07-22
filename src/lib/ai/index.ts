import { generateGemini } from "./gemini"
import { generateGroq } from "./groq"
import { generateCloudflare } from "./cloudflare"
import { generateDeepSeek } from "./deepseek"
import { generateHuggingFace } from "./huggingface"
import type { GenerateRequest, GeneratedPost } from "@/lib/types"

const SYSTEM_PROMPT = `You are a professional social media content strategist.
Rules:
- NO generic AI phrases like "unlock", "delve", "supercharge", "elevate"
- Each platform has different format requirements
- LinkedIn: professional, 200-300 words, paragraph. NO hashtags.
- Twitter/X: punchy, under 280 chars, 2-3 hashtags
- Instagram: conversational, 100-150 words, 3-5 hashtags at end
- Facebook: casual, 80-120 words, end with question, 1-2 hashtags
- TikTok: short under 100 words, 3-4 hashtags, hook in first line
- Threads: conversational, under 150 words, 1-2 hashtags`

const PLATFORM_PROMPTS: Record<string, string> = {
  linkedin: "LinkedIn post (200-300 words, professional, NO hashtags):",
  twitter: "X/Twitter post (under 280 chars, include 2-3 hashtags):",
  instagram: "Instagram caption (100-150 words, 3-5 hashtags at end):",
  facebook: "Facebook post (80-120 words, end with question, 1-2 hashtags):",
  tiktok: "TikTok caption (under 100 words, 3-4 hashtags, strong hook):",
  threads: "Threads post (under 150 words, conversational, 1-2 hashtags):",
}

const providers = [
  { name: "Gemini", fn: generateGemini },
  { name: "Groq", fn: generateGroq },
  { name: "Cloudflare", fn: generateCloudflare },
  { name: "DeepSeek", fn: generateDeepSeek },
  { name: "HuggingFace", fn: generateHuggingFace },
]

export async function generatePosts(request: GenerateRequest): Promise<GeneratedPost[]> {
  const { topic, platforms, tone, language, brandProfile } = request

  const langInstruction = getLangInstruction(language)
  const brandInstruction = brandProfile?.name
    ? `Brand: "${brandProfile.name}". Match their voice.`
    : ""

  return Promise.all(
    platforms.map(async (platform) => {
      const prompt = [
        SYSTEM_PROMPT,
        `Language: ${language}. ${langInstruction}`,
        brandInstruction,
        `Tone: ${tone}`,
        PLATFORM_PROMPTS[platform] || PLATFORM_PROMPTS.linkedin,
        `Topic: "${topic}"`,
        "Generate the post. Return ONLY the post content, no explanations.",
      ].join("\n")

      const result = await tryAllProviders(prompt)

      return {
        platform,
        content: result,
        hashtags: result.match(/#[\wа-яА-Я]+/g)?.slice(0, 5) || [],
        imagePrompt: request.includeImage
          ? `Social media image for ${platform} about: ${topic}. Clean, modern, professional. No text.`
          : undefined,
        characterCount: result.length,
      }
    })
  )
}

async function tryAllProviders(prompt: string): Promise<string> {
  const errors: string[] = []

  for (const { name, fn } of providers) {
    try {
      const result = await fn(prompt)
      if (result) return result
    } catch (e) {
      errors.push(`${name}: ${e instanceof Error ? e.message : "unknown error"}`)
    }
  }

  throw new Error(`All AI providers failed:\n${errors.join("\n")}`)
}

function getLangInstruction(lang: string): string {
  const map: Record<string, string> = {
    ru: "Write in Russian. Use natural Russian, not translated English.",
    de: "Write in German. Use natural German phrasing.",
    fr: "Write in French. Use natural French phrasing.",
    es: "Write in Spanish. Use natural Spanish phrasing.",
    zh: "Write in Chinese. Use natural Chinese phrasing.",
  }
  return map[lang] || "Write in English."
}
