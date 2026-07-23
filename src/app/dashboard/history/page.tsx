"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { PLATFORMS } from "@/lib/constants"
import { createClient } from "@/lib/supabase/client"
import { Sparkles, Search, Copy, Check, Trash2, Loader2, ArrowLeft, X, ChevronDown, ChevronUp, ImageIcon } from "lucide-react"

interface HistoryPost {
  id: number
  topic: string
  platform: string
  content: string
  image_url: string | null
  created_at: string
}

export default function HistoryPage() {
  const [user, setUser] = useState<any>(null)
  const [posts, setPosts] = useState<HistoryPost[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [platformFilter, setPlatformFilter] = useState<string>("all")
  const [copiedId, setCopiedId] = useState<number | null>(null)
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const router = useRouter()

  useEffect(() => {
    const init = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push("/auth"); return }
      setUser(user)

      const { data } = await supabase
        .from("generated_posts")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(100)

      if (data) setPosts(data)
      setLoading(false)
    }
    init()
  }, [router])

  const handleDelete = async (id: number) => {
    const supabase = createClient()
    const { error } = await supabase.from("generated_posts").delete().eq("id", id)
    if (!error) setPosts((prev) => prev.filter((p) => p.id !== id))
  }

  const copyContent = async (text: string, id: number) => {
    await navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const filtered = posts.filter((p) => {
    if (platformFilter !== "all" && p.platform !== platformFilter) return false
    if (search && !p.topic.toLowerCase().includes(search.toLowerCase()) && !p.content.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const platformInfo = (id: string) => PLATFORMS.find((p) => p.id === id)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
      </div>
    )
  }

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
          <h1 className="text-2xl font-bold tracking-tight">Post History</h1>
          <p className="text-neutral-500 mt-1">All generated posts, searchable and filterable.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <Input
              placeholder="Search by topic or content..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2">
                <X className="h-4 w-4 text-neutral-400 hover:text-neutral-600" />
              </button>
            )}
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {["all", ...PLATFORMS.map((p) => p.id)].map((id) => (
              <button
                key={id}
                onClick={() => setPlatformFilter(id)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-all ${
                  platformFilter === id ? "bg-neutral-900 text-white" : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                }`}
              >
                {id === "all" ? "All" : platformInfo(id)?.name || id}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-neutral-400">
            <Sparkles className="h-12 w-12 mb-4" />
            <p className="text-lg font-medium">No posts found</p>
            <p className="text-sm mt-1">{posts.length === 0 ? "Generate your first post on the dashboard." : "Try a different search or filter."}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((post) => {
              const info = platformInfo(post.platform)
              const isExpanded = expandedId === post.id
              return (
                <Card key={post.id} className="overflow-hidden border-neutral-200 hover:border-neutral-300 transition-colors">
                  <div className="flex items-center justify-between px-5 py-3 bg-neutral-50 border-b border-neutral-100">
                    <div className="flex items-center gap-2 min-w-0">
                      <Badge variant="secondary" className={info?.color}>{info?.name || post.platform}</Badge>
                      <span className="text-xs text-neutral-400 truncate max-w-[200px] sm:max-w-[400px]">{post.topic}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-[11px] text-neutral-400 mr-2 hidden sm:inline">
                        {new Date(post.created_at).toLocaleDateString()}
                        {" "}
                        {new Date(post.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                      <button onClick={() => copyContent(post.content, post.id)} title="Copy">
                        {copiedId === post.id ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5 text-neutral-400 hover:text-neutral-700" />}
                      </button>
                      <button onClick={() => handleDelete(post.id)} title="Delete" className="ml-1">
                        <Trash2 className="h-3.5 w-3.5 text-neutral-400 hover:text-red-500" />
                      </button>
                      <button onClick={() => setExpandedId(isExpanded ? null : post.id)} className="ml-1">
                        {isExpanded ? <ChevronUp className="h-3.5 w-3.5 text-neutral-400" /> : <ChevronDown className="h-3.5 w-3.5 text-neutral-400" />}
                      </button>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    {post.image_url && (
                      <div className="mb-3 rounded-lg overflow-hidden border border-neutral-100 max-w-sm">
                        <img src={post.image_url} alt="" className="w-full h-auto object-cover max-h-48" />
                      </div>
                    )}
                    <p className={`text-sm leading-relaxed whitespace-pre-wrap ${isExpanded ? "" : "line-clamp-3"}`}>
                      {post.content}
                    </p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
