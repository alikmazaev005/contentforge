export type Platform = "linkedin" | "twitter" | "instagram" | "facebook" | "tiktok" | "threads"
export type Tone = "professional" | "casual" | "humorous" | "inspirational" | "provocative" | "educational"
export type Language = "en" | "ru" | "de" | "fr" | "es" | "zh"

export interface BrandProfile {
  name: string
  description: string
  audience: string
  keywords: string[]
  tone: Tone
}

export interface GenerateRequest {
  topic: string
  platforms: Platform[]
  tone: Tone
  language: Language
  brandProfile?: BrandProfile
  includeImage: boolean
}

export interface GeneratedPost {
  platform: Platform
  content: string
  hashtags: string[]
  imagePrompt?: string
  imageUrl?: string
  characterCount: number
}

export interface GenerateResponse {
  posts: GeneratedPost[]
}
