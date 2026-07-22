"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { TONES } from "@/lib/constants"
import { createClient } from "@/lib/supabase/client"
import { Sparkles, Save, Loader2, ArrowLeft, Plus, X, Building2, Users, Hash } from "lucide-react"
import type { Tone } from "@/lib/types"
import Link from "next/link"

interface BrandProfile {
  id?: string
  name: string
  description: string
  audience: string
  keywords: string[]
  tone: Tone
}

export default function BrandProfilePage() {
  const [profile, setProfile] = useState<BrandProfile>({ name: "", description: "", audience: "", keywords: [], tone: "professional" })
  const [keywordInput, setKeywordInput] = useState("")
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saved, setSaved] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const load = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push("/auth"); return }

      const { data } = await supabase.from("brand_profiles").select("*").eq("user_id", user.id).single()
      if (data) setProfile({ name: data.name, description: data.description, audience: data.audience, keywords: data.keywords || [], tone: data.tone })
      setLoading(false)
    }
    load()
  }, [router])

  const addKeyword = () => {
    const kw = keywordInput.trim().toLowerCase()
    if (kw && !profile.keywords.includes(kw)) {
      setProfile({ ...profile, keywords: [...profile.keywords, kw] })
      setKeywordInput("")
    }
  }

  const removeKeyword = (kw: string) => {
    setProfile({ ...profile, keywords: profile.keywords.filter((k) => k !== kw) })
  }

  const handleSave = async () => {
    setSaving(true)
    setSaved(false)
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { error } = await supabase.from("brand_profiles").upsert({
        user_id: user.id,
        name: profile.name,
        description: profile.description,
        audience: profile.audience,
        keywords: profile.keywords,
        tone: profile.tone,
        updated_at: new Date().toISOString(),
      })

      if (error) throw error
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (e) {
      console.error(e)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="border-b border-neutral-200 bg-white">
        <div className="mx-auto flex h-16 max-w-3xl items-center gap-4 px-6">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button>
          </Link>
          <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
            <Sparkles className="h-5 w-5 text-violet-600" />
            Brand Voice
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-8 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Brand Voice Profile</CardTitle>
            <CardDescription>Set your brand&apos;s tone and style once. All generated content will match your voice.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label className="flex items-center gap-2"><Building2 className="h-4 w-4 text-neutral-400" /> Brand Name</Label>
              <Input placeholder="e.g. ContentForge, Acme Inc." value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
            </div>

            <div className="space-y-2">
              <Label>Brand Description</Label>
              <textarea
                className="flex min-h-[100px] w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm placeholder:text-neutral-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900"
                placeholder="What does your brand do? What makes it unique?"
                value={profile.description}
                onChange={(e) => setProfile({ ...profile, description: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2"><Users className="h-4 w-4 text-neutral-400" /> Target Audience</Label>
              <Input placeholder="e.g. SaaS founders, marketers, developers" value={profile.audience} onChange={(e) => setProfile({ ...profile, audience: e.target.value })} />
            </div>

            <div className="space-y-3">
              <Label className="flex items-center gap-2"><Hash className="h-4 w-4 text-neutral-400" /> Keywords</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Add a keyword..."
                  value={keywordInput}
                  onChange={(e) => setKeywordInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addKeyword())}
                />
                <Button variant="outline" size="icon" onClick={addKeyword}><Plus className="h-4 w-4" /></Button>
              </div>
              {profile.keywords.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {profile.keywords.map((kw) => (
                    <Badge key={kw} variant="secondary" className="gap-1 px-3 py-1.5">
                      {kw}
                      <button onClick={() => removeKeyword(kw)} className="ml-1 hover:text-red-500">
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-3">
              <Label>Default Tone</Label>
              <div className="flex flex-wrap gap-2">
                {TONES.map((t) => {
                  const active = profile.tone === t.id
                  return (
                    <button
                      key={t.id}
                      onClick={() => setProfile({ ...profile, tone: t.id as Tone })}
                      className={`inline-flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium transition-all ${
                        active ? "bg-violet-600 text-white shadow-sm" : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                      }`}
                    >
                      {t.emoji} {t.name}
                    </button>
                  )
                })}
              </div>
            </div>

            <Button onClick={handleSave} disabled={saving} className="w-full h-12 gap-2" variant="gradient" size="lg">
              {saving ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</> : <><Save className="h-4 w-4" /> {saved ? "Saved!" : "Save Brand Profile"}</>}
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
