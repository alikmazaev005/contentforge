export const SITE_NAME = "ContentForge"
export const SITE_TAGLINE = "Craft perfect posts for every platform in seconds"
export const SITE_DESCRIPTION = "AI-powered social media content generator. Create engaging posts for LinkedIn, Twitter, Instagram, and more — in 6 languages."

export const PLATFORMS = [
  { id: "linkedin", name: "LinkedIn", icon: "briefcase", color: "bg-blue-100 text-blue-700" },
  { id: "twitter", name: "X / Twitter", icon: "message-circle", color: "bg-neutral-100 text-neutral-700" },
  { id: "instagram", name: "Instagram", icon: "camera", color: "bg-pink-100 text-pink-700" },
  { id: "facebook", name: "Facebook", icon: "users", color: "bg-indigo-100 text-indigo-700" },
  { id: "tiktok", name: "TikTok", icon: "music", color: "bg-rose-100 text-rose-700" },
  { id: "threads", name: "Threads", icon: "at-sign", color: "bg-orange-100 text-orange-700" },
] as const

export const TONES = [
  { id: "professional", name: "Professional", emoji: "👔" },
  { id: "casual", name: "Casual", emoji: "😊" },
  { id: "humorous", name: "Humorous", emoji: "😂" },
  { id: "inspirational", name: "Inspirational", emoji: "✨" },
  { id: "provocative", name: "Provocative", emoji: "🔥" },
  { id: "educational", name: "Educational", emoji: "📚" },
] as const

export const LANGUAGES = [
  { id: "en", name: "English" },
  { id: "ru", name: "Русский" },
  { id: "de", name: "Deutsch" },
  { id: "fr", name: "Français" },
  { id: "es", name: "Español" },
  { id: "zh", name: "中文" },
] as const

export const PRICING = [
  {
    name: "Free",
    price: 0,
    posts: 5,
    features: ["5 posts/month", "1 platform", "Basic tone control", "English only"],
    cta: "Get Started",
  },
  {
    name: "Pro",
    price: 9,
    posts: 50,
    features: ["50 posts/month", "All 6 platforms", "AI image generation", "6 languages", "Brand voice profile"],
    cta: "Start Free Trial",
    popular: true,
  },
  {
    name: "Business",
    price: 29,
    posts: 200,
    features: ["200 posts/month", "All 6 platforms", "AI image generation", "6 languages", "Team collaboration", "Priority support"],
    cta: "Start Free Trial",
  },
] as const
