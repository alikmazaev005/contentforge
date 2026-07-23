import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 })

    const { data: posts } = await supabase
      .from("generated_posts")
      .select("platform, tone, language, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true })

    if (!posts) return NextResponse.json({ total: 0, platforms: [], monthly: [], tones: [], languages: [] })

    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
    const thisMonth = posts.filter((p) => p.created_at >= startOfMonth)

    const platforms = posts.reduce<Record<string, number>>((acc, p) => {
      acc[p.platform] = (acc[p.platform] || 0) + 1
      return acc
    }, {})

    const tones = posts.reduce<Record<string, number>>((acc, p) => {
      acc[p.tone] = (acc[p.tone] || 0) + 1
      return acc
    }, {})

    const languages = posts.reduce<Record<string, number>>((acc, p) => {
      acc[p.language] = (acc[p.language] || 0) + 1
      return acc
    }, {})

    const dayBuckets: Record<string, number> = {}
    posts.forEach((p) => {
      const day = p.created_at.split("T")[0]
      dayBuckets[day] = (dayBuckets[day] || 0) + 1
    })

    const monthly = Object.entries(dayBuckets)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, count]) => ({ date, count }))
      .slice(-30)

    const mostActiveDay = monthly.reduce((max, d) => d.count > max.count ? d : max, monthly[0] || { date: "", count: 0 })

    return NextResponse.json({
      total: posts.length,
      thisMonth: thisMonth.length,
      platforms: Object.entries(platforms).map(([name, count]) => ({ name, count })),
      monthly,
      tones: Object.entries(tones).map(([name, count]) => ({ name, count })),
      languages: Object.entries(languages).map(([name, count]) => ({ name, count })),
      mostActiveDay,
      firstPost: posts[0]?.created_at || null,
      streak: calculateStreak(dayBuckets),
    })
  } catch (error) {
    console.error("Analytics error:", error)
    return NextResponse.json({ error: "Failed to load analytics" }, { status: 500 })
  }
}

function calculateStreak(dayBuckets: Record<string, number>): number {
  const days = Object.keys(dayBuckets).sort().reverse()
  let streak = 0
  const today = new Date().toISOString().split("T")[0]
  let check = today

  for (const day of days) {
    if (day === check) {
      streak++
      const d = new Date(check)
      d.setDate(d.getDate() - 1)
      check = d.toISOString().split("T")[0]
    } else if (day < check) {
      break
    }
  }
  return streak
}
