"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { PLATFORMS, TONES, LANGUAGES } from "@/lib/constants"
import type { Platform, Tone, Language, GenerateResponse } from "@/lib/types"
import { Sparkles, Send, Copy, Check, Loader2, Globe, Palette, ImageIcon } from "lucide-react"

export default function DashboardPage() {
  const [topic, setTopic] = useState("")
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>(["linkedin", "twitter"])
  const [tone, setTone] = useState<Tone>("professional")
  const [language, setLanguage] = useState<Language>("en")
  const [includeImage, setIncludeImage] = useState(true)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<GenerateResponse | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const togglePlatform = (id: Platform) => {
    setSelectedPlatforms((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    )
  }

  const handleGenerate = async () => {
    if (!topic.trim() || selectedPlatforms.length === 0) return
    setLoading(true)
    setError(null)
    setResult(null)

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
        }),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || "Generation failed")
      }

      const data: GenerateResponse = await res.json()
      setResult(data)
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

  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="border-b border-neutral-200 bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
            <Sparkles className="h-5 w-5 text-violet-600" />
            ContentForge
          </div>
          <Button variant="ghost" size="sm">
            <Globe className="h-4 w-4 mr-2" />
            {LANGUAGES.find((l) => l.id === language)?.name || "English"}
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid gap-8 lg:grid-cols-5">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">What do you want to post about?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Topic or Idea</Label>
                  <Input
                    placeholder="e.g. Our new AI feature launched today..."
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                  />
                </div>

                <div className="space-y-3">
                  <Label>Platforms</Label>
                  <div className="flex flex-wrap gap-2">
                    {PLATFORMS.map((p) => {
                      const active = selectedPlatforms.includes(p.id as Platform)
                      return (
                        <button
                          key={p.id}
                          onClick={() => togglePlatform(p.id as Platform)}
                          className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all ${
                            active
                              ? "bg-neutral-900 text-white shadow-sm"
                              : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                          }`}
                        >
                          {p.name}
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Tone</Label>
                  <div className="flex flex-wrap gap-2">
                    {TONES.map((t) => {
                      const active = tone === t.id
                      return (
                        <button
                          key={t.id}
                          onClick={() => setTone(t.id as Tone)}
                          className={`inline-flex items-center gap-1 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all ${
                            active
                              ? "bg-violet-600 text-white shadow-sm"
                              : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                          }`}
                        >
                          {t.emoji} {t.name}
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Language</Label>
                  <div className="flex flex-wrap gap-2">
                    {LANGUAGES.map((l) => {
                      const active = language === l.id
                      return (
                        <button
                          key={l.id}
                          onClick={() => setLanguage(l.id as Language)}
                          className={`inline-flex items-center gap-1 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all ${
                            active
                              ? "bg-neutral-900 text-white shadow-sm"
                              : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                          }`}
                        >
                          {l.name}
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIncludeImage(!includeImage)}
                    className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all border ${
                      includeImage
                        ? "border-violet-200 bg-violet-50 text-violet-700"
                        : "border-neutral-200 text-neutral-500 hover:bg-neutral-50"
                    }`}
                  >
                    <ImageIcon className="h-4 w-4" />
                    AI Image
                  </button>
                </div>

                <Button
                  onClick={handleGenerate}
                  disabled={!topic.trim() || selectedPlatforms.length === 0 || loading}
                  className="w-full gap-2 h-12"
                  variant="gradient"
                  size="lg"
                >
                  {loading ? (
                    <><Loader2 className="h-4 w-4 animate-spin" /> Generating...</>
                  ) : (
                    <><Send className="h-4 w-4" /> Generate Posts</>
                  )}
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-violet-50 to-purple-50 border-violet-200">
              <CardContent className="p-5">
                <div className="flex items-start gap-3">
                  <Sparkles className="h-5 w-5 text-violet-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-violet-900">Pro tip</p>
                    <p className="text-sm text-violet-700 mt-1">
                      For best results, describe your topic in 2-3 sentences.
                      Include key details like product name, audience, and goal.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-3">
            {error && (
              <Card className="border-red-200 bg-red-50 mb-6">
                <CardContent className="p-4">
                  <p className="text-sm text-red-700">{error}</p>
                </CardContent>
              </Card>
            )}

            {!result && !loading && (
              <div className="flex flex-col items-center justify-center h-full min-h-[400px] rounded-2xl border-2 border-dashed border-neutral-200 bg-white p-12 text-center">
                <Sparkles className="h-12 w-12 text-neutral-300 mb-4" />
                <h3 className="text-lg font-semibold text-neutral-700">Your content will appear here</h3>
                <p className="text-sm text-neutral-400 mt-2 max-w-sm">
                  Select platforms, enter your topic, and hit Generate Posts to create platform-optimized content with AI.
                </p>
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
                          <Badge variant="secondary" className={platformInfo?.color}>
                            {platformInfo?.name || post.platform}
                          </Badge>
                          <span className="text-xs text-neutral-400">{post.characterCount} chars</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyContent(post.content, post.platform)}
                          className="gap-1.5"
                        >
                          {copiedId === post.platform ? (
                            <><Check className="h-3.5 w-3.5 text-emerald-500" /> Copied</>
                          ) : (
                            <><Copy className="h-3.5 w-3.5" /> Copy</>
                          )}
                        </Button>
                      </div>
                      <CardContent className="p-6">
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{post.content}</p>
                        {post.hashtags.length > 0 && (
                          <div className="mt-4 flex flex-wrap gap-1.5">
                            {post.hashtags.map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
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
