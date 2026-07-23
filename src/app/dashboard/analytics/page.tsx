"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { PLATFORMS, TONES, LANGUAGES } from "@/lib/constants"
import { Sparkles, Loader2, ArrowLeft, Calendar, TrendingUp, BarChart3, Globe, Languages, Zap } from "lucide-react"

interface PlatformStat { name: string; count: number }
interface DailyStat { date: string; count: number }
interface ToneStat { name: string; count: number }
interface LangStat { name: string; count: number }

interface Stats {
  total: number
  thisMonth: number
  platforms: PlatformStat[]
  monthly: DailyStat[]
  tones: ToneStat[]
  languages: LangStat[]
  mostActiveDay: { date: string; count: number }
  firstPost: string | null
  streak: number
}

export default function AnalyticsPage() {
  const [user, setUser] = useState<any>(null)
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const init = async () => {
      const { createClient } = await import("@/lib/supabase/client")
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push("/auth"); return }
      setUser(user)

      const res = await fetch("/api/analytics/stats")
      if (res.ok) {
        const data = await res.json()
        setStats(data)
      }
      setLoading(false)
    }
    init()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
      </div>
    )
  }

  const platformInfo = (id: string) => PLATFORMS.find((p) => p.id === id)
  const maxPlatform = stats ? Math.max(...stats.platforms.map((p) => p.count), 1) : 1
  const maxDaily = stats ? Math.max(...stats.monthly.map((d) => d.count), 1) : 1

  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm"><ArrowLeft className="h-4 w-4 mr-1.5" /> Back</Button>
            </Link>
            <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
              <Sparkles className="h-5 w-5 text-violet-600" />
              ContentForge
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="text-xs bg-violet-100 text-violet-700">
                {user?.email?.[0]?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-12 space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
          <p className="text-neutral-500 mt-1">Your content generation activity at a glance.</p>
        </div>

        {!stats || stats.total === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-neutral-400">
            <BarChart3 className="h-12 w-12 mb-4" />
            <p className="text-lg font-medium">No data yet</p>
            <p className="text-sm mt-1">Generate some posts to see analytics.</p>
          </div>
        ) : (
          <>
            <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
              <Card>
                <CardContent className="p-5">
                  <div className="flex items-center gap-2 text-neutral-400 text-sm">
                    <TrendingUp className="h-4 w-4" /> Total Posts
                  </div>
                  <p className="text-2xl font-bold mt-1">{stats.total}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-5">
                  <div className="flex items-center gap-2 text-neutral-400 text-sm">
                    <Calendar className="h-4 w-4" /> This Month
                  </div>
                  <p className="text-2xl font-bold mt-1">{stats.thisMonth}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-5">
                  <div className="flex items-center gap-2 text-neutral-400 text-sm">
                    <Zap className="h-4 w-4" /> Day Streak
                  </div>
                  <p className="text-2xl font-bold mt-1">{stats.streak}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-5">
                  <div className="flex items-center gap-2 text-neutral-400 text-sm">
                    <Globe className="h-4 w-4" /> Platforms Used
                  </div>
                  <p className="text-2xl font-bold mt-1">{stats.platforms.length}</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader><CardTitle className="text-lg">Posts by Platform</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  {stats.platforms.sort((a, b) => b.count - a.count).map((p) => {
                    const info = platformInfo(p.name)
                    const pct = Math.round((p.count / maxPlatform) * 100)
                    return (
                      <div key={p.name}>
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="font-medium">{info?.name || p.name}</span>
                          <span className="text-neutral-400">{p.count}</span>
                        </div>
                        <div className="h-2 rounded-full bg-neutral-100 overflow-hidden">
                          <div className={`h-full rounded-full ${info?.color?.replace("text-", "bg-").replace("bg-", "") ? `bg-${info.color.split(" ")[0].replace("bg-", "")}` : "bg-violet-500"}`}
                            style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    )
                  })}
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle className="text-lg">Last 30 Days</CardTitle></CardHeader>
                <CardContent>
                  <div className="flex items-end gap-[3px] h-32">
                    {stats.monthly.map((d) => {
                      const pct = Math.max(Math.round((d.count / maxDaily) * 100), 1)
                      return (
                        <div key={d.date} className="flex-1 flex flex-col items-center gap-1">
                          <span className="text-[10px] text-neutral-400">{d.count}</span>
                          <div
                            className="w-full rounded-sm bg-violet-500 hover:bg-violet-600 transition-colors cursor-pointer"
                            style={{ height: `${pct}%` }}
                            title={`${d.date}: ${d.count} posts`}
                          />
                        </div>
                      )
                    })}
                  </div>
                  <div className="flex justify-between text-[10px] text-neutral-400 mt-2">
                    <span>{stats.monthly[0]?.date?.slice(5) || ""}</span>
                    <span>{stats.monthly[stats.monthly.length - 1]?.date?.slice(5) || ""}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle className="text-lg">Tones</CardTitle></CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                  {stats.tones.sort((a, b) => b.count - a.count).map((t) => {
                    const info = TONES.find((tn) => tn.id === t.name)
                    return (
                      <Badge key={t.name} variant="secondary" className="text-sm py-1.5 px-3">
                        {info?.emoji} {info?.name || t.name} — {t.count}
                      </Badge>
                    )
                  })}
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle className="text-lg">Languages</CardTitle></CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                  {stats.languages.sort((a, b) => b.count - a.count).map((l) => {
                    const info = LANGUAGES.find((ln) => ln.id === l.name)
                    return (
                      <Badge key={l.name} variant="secondary" className="text-sm py-1.5 px-3">
                        <Languages className="h-3.5 w-3.5 mr-1" /> {info?.name || l.name} — {l.count}
                      </Badge>
                    )
                  })}
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </main>
    </div>
  )
}
