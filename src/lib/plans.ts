export const PLANS = [
  { id: "free", name: "Free", price: 0, rubPrice: 0, posts: 10, features: ["10 posts/month", "2 platforms", "AI images (with watermark)", "Basic tone control", "English only"], popular: false },
  { id: "pro", name: "Pro", price: 9, rubPrice: 790, posts: 999, features: ["Unlimited posts", "All 6 platforms", "AI image generation (no watermark)", "6 languages", "Brand voice profile"], popular: true },
  { id: "business", name: "Business", price: 29, rubPrice: 2490, posts: 200, features: ["200 posts/month", "All 6 platforms", "AI image generation", "6 languages", "Team collaboration (5 seats)", "Priority support"], popular: false },
] as const

export type PlanId = (typeof PLANS)[number]["id"]