export const PLANS = [
  { id: "free", name: "Free", price: 0, rubPrice: 0, posts: 5, features: ["5 posts/month", "1 platform", "Basic tone control", "English only"], popular: false },
  { id: "pro", name: "Pro", price: 9, rubPrice: 790, posts: 50, features: ["50 posts/month", "All 6 platforms", "AI image generation", "6 languages", "Brand voice profile"], popular: true },
  { id: "business", name: "Business", price: 29, rubPrice: 2490, posts: 200, features: ["200 posts/month", "All 6 platforms", "AI image generation", "6 languages", "Team collaboration", "Priority support"], popular: false },
] as const

export type PlanId = (typeof PLANS)[number]["id"]
