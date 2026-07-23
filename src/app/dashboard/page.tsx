"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { PLATFORMS, TONES, LANGUAGES } from "@/lib/constants"
import type { Platform, Tone, Language, GenerateResponse } from "@/lib/types"
import { createClient } from "@/lib/supabase/client"
import { Sparkles, Send, Copy, Check, Loader2, ImageIcon, User, Settings, History, Menu, CreditCard, ExternalLink } from "lucide-react"
import Link from "next/link"

interface BrandProfile {
  name: string
  tone: Tone
}

interface SavedPost {
  id: string
  topic: string
  platform: string
  content: string
  created_at: string
}

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [brandProfile, setBrandProfile] = useState<BrandProfile | null>(null)
  const [savedPosts, setSavedPosts] = useState<SavedPost[]>([])
  const [showHistory, setShowHistory] = useState(false)
  const [topic, setTopic] = useState("")
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>(["linkedin", "twitter"])
  const [tone, setTone] = useState<Tone>("professional")
  const [language, setLanguage] = useState<Language>("en")
  const [includeImage, setIncludeImage] = useState(true)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<GenerateResponse | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [initialLoading, setInitialLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const init = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push("/auth"); return }
      setUser(user)

      const { data: profile } = await supabase.from("brand_profiles").select("name, tone").eq("user_id", user.id).single()
      if (profile) {
        setBrandProfile(profile)
        setTone(profile.tone)
      }

      const { data: posts } = await supabase
        .from("generated_posts")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(20)

      if (posts) setSavedPosts(posts)
      setInitialLoading(false)
    }
    init()
  }, [router])

  const togglePlatform = (id: Platform) => {
    setSelectedPlatforms((prev) => prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id])
  }

  const handleGenerate = async () => {
    if (!topic.trim() || selectedPlatforms.length === 0) return
    setLoading(true)
    setError(null)

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: topic.trim(),
          platforms: selectedPlatforms,
          tone,
          language,
          includeImage,
          brandProfile: brandProfile ? { name: brandProfile.name, tone: brandProfile.tone } : undefined,
        }),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || "Generation failed")
      }

      const data: GenerateResponse = await res.json()
      setResult(data)
      setSavedPosts((prev) => [
        ...data.posts.map((p) => ({
          id: `${p.platform}-${Date.now()}`,
          topic: topic.trim(),
          platform: p.platform,
          content: p.content,
          created_at: new Date().toISOString(),
        })),
        ...prev,
      ].slice(0, 20))
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  const copyContent = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  if (initialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
              <Sparkles className="h-5 w-5 text-violet-600" />
              ContentForge
            </div>
            {brandProfile && (
              <Badge variant="secondary" className="hidden sm:inline-flex">
                {brandProfile.name}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Link href="/dashboard/brand">
              <Button variant="ghost" size="sm"><Settings className="h-4 w-4 mr-1.5" /> Brand</Button>
            </Link>
            <Link href="/dashboard/billing">
              <Button variant="ghost" size="sm"><CreditCard className="h-4 w-4 mr-1.5" /> Billing</Button>
            </Link>
            <Link href="/dashboard/history" className="hidden sm:inline-flex">
              <Button variant="ghost" size="sm"><History className="h-4 w-4 mr-1.5" /> History</Button>
            </Link>
            <Link href="/dashboard/billing">
              <Button variant="outline" size="sm">Usage</Button>
            </Link>
            <Link href="/pricing">
              <Button variant="outline" size="sm">Upgrade</Button>
            </Link>
            <Avatar className="h-8 w-8">
              <AvatarFallback className="text-xs bg-violet-100 text-violet-700">
                {user?.email?.[0]?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid gap-8 lg:grid-cols-5">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Create Content</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Topic or Idea</Label>
                  <Input placeholder="e.g. Our new AI feature launched today..." value={topic} onChange={(e) => setTopic(e.target.value)} />
                </div>

                <div className="space-y-3">
                  <Label>Platforms</Label>
                  <div className="flex flex-wrap gap-2">
                    {PLATFORMS.map((p) => {
                      const active = selectedPlatforms.includes(p.id as Platform)
                      return (
                        <button key={p.id} onClick={() => togglePlatform(p.id as Platform)}
                          className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all ${active ? "bg-neutral-900 text-white shadow-sm" : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"}`}>
                          {p.name}
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Tone</Label>
                  <div className="flex flex-wrap gap-2">
                    {TONES.map((t) => (
                      <button key={t.id} onClick={() => setTone(t.id as Tone)}
                        className={`inline-flex items-center gap-1 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all ${tone === t.id ? "bg-violet-600 text-white shadow-sm" : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"}`}>
                        {t.emoji} {t.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Language</Label>
                  <div className="flex flex-wrap gap-2">
                    {LANGUAGES.map((l) => (
                      <button key={l.id} onClick={() => setLanguage(l.id as Language)}
                        className={`inline-flex items-center gap-1 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all ${language === l.id ? "bg-neutral-900 text-white shadow-sm" : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"}`}>
                        {l.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button onClick={() => setIncludeImage(!includeImage)}
                    className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all border ${includeImage ? "border-violet-200 bg-violet-50 text-violet-700" : "border-neutral-200 text-neutral-500 hover:bg-neutral-50"}`}>
                    <ImageIcon className="h-4 w-4" />
                    AI Image
                  </button>
                </div>

                <Button onClick={handleGenerate} disabled={!topic.trim() || selectedPlatforms.length === 0 || loading} className="w-full gap-2 h-12" variant="gradient" size="lg">
                  {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Generating...</> : <><Send className="h-4 w-4" /> Generate Posts</>}
                </Button>
              </CardContent>
            </Card>

            {!brandProfile && (
              <Card className="bg-gradient-to-br from-violet-50 to-purple-50 border-violet-200">
                <CardContent className="p-5">
                  <div className="flex items-start gap-3">
                    <Sparkles className="h-5 w-5 text-violet-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-violet-900">Set your Brand Voice</p>
                      <p className="text-sm text-violet-700 mt-1">Save your brand profile for consistent content every time.</p>
                      <Link href="/dashboard/brand">
                        <Button variant="outline" size="sm" className="mt-2">Configure Brand</Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {showHistory && (
              <Card>
                <CardHeader><CardTitle className="text-lg">Recent Posts</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  {savedPosts.length === 0 ? (
                    <p className="text-sm text-neutral-400 text-center py-4">No posts yet.</p>
                  ) : (
                    <div className="space-y-2 max-h-72 overflow-y-auto scrollbar-hide">
                      {savedPosts.slice(0, 5).map((post) => (
                        <div key={post.id} className="rounded-xl border border-neutral-100 bg-neutral-50 p-3 cursor-pointer hover:bg-neutral-100 transition-colors" onClick={() => { copyContent(post.content, post.id); }}>
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="secondary" className="text-[10px] px-2 py-0">{post.platform}</Badge>
                            <span className="text-[10px] text-neutral-400">{new Date(post.created_at).toLocaleDateString()}</span>
                          </div>
                          <p className="text-xs text-neutral-600 line-clamp-2">{post.content}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  <Link href="/dashboard/history">
                    <Button variant="outline" size="sm" className="w-full gap-1.5">
                      <ExternalLink className="h-3.5 w-3.5" /> View all
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="lg:col-span-3">
            {error && (
              <Card className="border-red-200 bg-red-50 mb-6">
                <CardContent className="p-4"><p className="text-sm text-red-700">{error}</p></CardContent>
              </Card>
            )}

            {!result && !loading && (
              <div className="flex flex-col items-center justify-center h-full min-h-[400px] rounded-2xl border-2 border-dashed border-neutral-200 bg-white p-12 text-center">
                <Sparkles className="h-12 w-12 text-neutral-300 mb-4" />
                <h3 className="text-lg font-semibold text-neutral-700">Your content will appear here</h3>
                <p className="text-sm text-neutral-400 mt-2 max-w-sm">Select platforms, enter your topic, and hit Generate Posts.</p>
              </div>
            )}

            {loading && (
              <div className="flex flex-col items-center justify-center h-full min-h-[400px] rounded-2xl border border-neutral-200 bg-white p-12">
                <Loader2 className="h-10 w-10 animate-spin text-violet-600 mb-4" />
                <p className="text-sm text-neutral-500">Generating content for {selectedPlatforms.length} platforms...</p>
              </div>
            )}

            {result && !loading && (
              <div className="space-y-4">
                {result.posts.map((post) => {
                  const platformInfo = PLATFORMS.find((p) => p.id === post.platform)
                  return (
                    <Card key={post.platform} className="overflow-hidden border-neutral-200">
                      <div className="flex items-center justify-between px-6 py-3 bg-neutral-50 border-b border-neutral-100">
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className={platformInfo?.color}>{platformInfo?.name || post.platform}</Badge>
                          <span className="text-xs text-neutral-400">{post.characterCount} chars</span>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => copyContent(post.content, post.platform)} className="gap-1.5">
                          {copiedId === post.platform ? <><Check className="h-3.5 w-3.5 text-emerald-500" /> Copied</> : <><Copy className="h-3.5 w-3.5" /> Copy</>}
                        </Button>
                      </div>
                      <CardContent className="p-6">
                        {post.imageUrl && (
                          <div className="mb-4 rounded-xl overflow-hidden border border-neutral-200 bg-neutral-50">
                            <img src={post.imageUrl} alt="Generated" className="w-full h-auto object-cover max-h-72" />
                          </div>
                        )}
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{post.content}</p>
                        {post.hashtags.length > 0 && (
                          <div className="mt-4 flex flex-wrap gap-1.5">
                            {post.hashtags.map((tag) => <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>)}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
