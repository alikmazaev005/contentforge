import Link from "next/link"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PLATFORMS, LANGUAGES, SITE_NAME, SITE_TAGLINE } from "@/lib/constants"
import { Sparkles, Wand2, Globe, ImageIcon, Zap, CheckCircle, ArrowRight, Quote } from "lucide-react"

const siteUrl = process.env.NEXT_PUBLIC_URL || "https://contentforge.fun"

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: SITE_NAME,
  description: SITE_TAGLINE,
  url: siteUrl,
  applicationCategory: "Multimedia",
  operatingSystem: "Web",
  offers: [
    { "@type": "Offer", name: "Free", price: "0", priceCurrency: "USD" },
    { "@type": "Offer", name: "Pro", price: "9", priceCurrency: "USD" },
    { "@type": "Offer", name: "Business", price: "29", priceCurrency: "USD" },
  ],
}

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  url: siteUrl,
  description: SITE_TAGLINE,
}

const FEATURES = [
  {
    icon: Wand2,
    title: "AI-Powered Generation",
    desc: "Describe your topic once, get perfectly crafted posts for every platform — LinkedIn, Twitter, Instagram, Facebook, TikTok, Threads.",
  },
  {
    icon: Globe,
    title: "6 Languages",
    desc: "Create content in English, Russian, German, French, Spanish, and Chinese. Reach your global audience naturally.",
  },
  {
    icon: ImageIcon,
    title: "AI Images Included",
    desc: "Every post gets a platform-optimized AI-generated image. No more searching for stock photos.",
  },
  {
    icon: Zap,
    title: "One Click, All Platforms",
    desc: "Select the platforms you need. Get content tailored to each — length, tone, format, and hashtags optimized automatically.",
  },
]

const STEPS = [
  { num: "01", title: "Describe your brand", desc: "Set your brand voice once — tone, audience, keywords. Or skip and let AI figure it out." },
  { num: "02", title: "Enter a topic", desc: "Type a topic, paste a URL, or upload a document. AI extracts the key message." },
  { num: "03", title: "Pick platforms & language", desc: "Choose where to post and in which language. AI optimizes for each." },
  { num: "04", title: "Publish or schedule", desc: "Copy, download, or schedule directly. Content ready in seconds." },
]

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
      <Navbar />
      <main>
        <section className="relative overflow-hidden border-b border-neutral-200/60">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-50 via-white to-purple-50" />
          <div className="absolute top-0 right-0 -mr-32 mt-16 h-96 w-96 rounded-full bg-violet-200/30 blur-3xl" />
          <div className="absolute bottom-0 left-0 -ml-32 mb-16 h-96 w-96 rounded-full bg-purple-200/20 blur-3xl" />
          <div className="relative mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:py-40">
            <div className="mx-auto max-w-3xl text-center">
              <Badge variant="violet" className="mb-6">AI-Powered Content Creation</Badge>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-neutral-900 leading-[1.1]">
                Write once.
                <br />
                <span className="bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                  Publish everywhere.
                </span>
              </h1>
              <p className="mt-6 text-lg sm:text-xl text-neutral-500 max-w-2xl mx-auto leading-relaxed">
                AI generates platform-optimized posts with images in 6 languages.
                LinkedIn, Twitter, Instagram, Facebook, TikTok, Threads — all from one idea.
              </p>
              <div className="mt-10 flex items-center justify-center gap-4">
                <Link href="/auth?signup=true">
                  <Button size="xl" variant="gradient" className="gap-2">
                    Start Creating Free <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/#how-it-works">
                  <Button size="xl" variant="outline">See How it Works</Button>
                </Link>
              </div>
              <div className="mt-8 flex items-center justify-center gap-2 text-sm text-neutral-400">
                <CheckCircle className="h-4 w-4 text-emerald-500" /> No credit card required
                <span className="mx-2">·</span>
                <CheckCircle className="h-4 w-4 text-emerald-500" /> 5 free posts
              </div>
            </div>
          </div>
          <div className="relative mx-auto max-w-5xl px-6 pb-16">
            <div className="rounded-2xl border border-neutral-200 bg-white/80 backdrop-blur-sm shadow-xl p-8">
              <div className="flex flex-wrap items-center justify-center gap-3">
                {PLATFORMS.map((p) => (
                  <Badge key={p.id} variant="secondary" className="px-4 py-2 text-sm gap-2">
                    {p.name}
                  </Badge>
                ))}
              </div>
              <div className="mt-4 h-px bg-gradient-to-r from-transparent via-neutral-200 to-transparent" />
              <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                {LANGUAGES.map((l) => (
                  <Badge key={l.id} variant="outline" className="px-3">{l.name}</Badge>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mx-auto max-w-2xl text-center">
              <Badge variant="violet" className="mb-4">Features</Badge>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                Everything you need to create engaging content
              </h2>
              <p className="mt-4 text-lg text-neutral-500">
                Stop writing the same thing 6 times. Let AI handle the formatting, hashtags, and images.
              </p>
            </div>
            <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {FEATURES.map((f) => {
                const Icon = f.icon
                return (
                  <div key={f.title} className="group rounded-2xl border border-neutral-200 bg-white p-6 transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-violet-100 text-violet-600 group-hover:bg-violet-600 group-hover:text-white transition-all duration-200">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="mb-2 font-semibold text-lg">{f.title}</h3>
                    <p className="text-sm text-neutral-500 leading-relaxed">{f.desc}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        <section id="how-it-works" className="border-y border-neutral-200/60 bg-neutral-50/50 py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mx-auto max-w-2xl text-center">
              <Badge variant="violet" className="mb-4">How it Works</Badge>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                From idea to published post in 30 seconds
              </h2>
            </div>
            <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {STEPS.map((s) => (
                <div key={s.num} className="relative">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-neutral-900 text-white font-bold text-lg">
                    {s.num}
                  </div>
                  <h3 className="mb-2 font-semibold text-lg">{s.title}</h3>
                  <p className="text-sm text-neutral-500 leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mx-auto max-w-2xl text-center">
              <Badge variant="violet" className="mb-4">Testimonials</Badge>
              <div className="grid gap-8 sm:grid-cols-2">
                <div className="rounded-2xl border border-neutral-200 bg-white p-6 text-left">
                  <Quote className="h-6 w-6 text-violet-300" />
                  <blockquote className="mt-3 text-base text-neutral-700 leading-relaxed">
                    &ldquo;I used to spend 2 hours writing posts for LinkedIn and Twitter.
                    Now I do it in 2 minutes. ContentForge is a game changer.&rdquo;
                  </blockquote>
                  <p className="mt-4 text-sm font-medium text-neutral-900">Alex Chen</p>
                  <p className="text-xs text-neutral-400">Marketing Lead, Tendable</p>
                </div>
                <div className="rounded-2xl border border-neutral-200 bg-white p-6 text-left">
                  <Quote className="h-6 w-6 text-violet-300" />
                  <blockquote className="mt-3 text-base text-neutral-700 leading-relaxed">
                    &ldquo;We publish across 4 platforms daily. ContentForge cut our
                    content team&rsquo;s workload by 70%.&rdquo;
                  </blockquote>
                  <p className="mt-4 text-sm font-medium text-neutral-900">Sarah Mitchell</p>
                  <p className="text-xs text-neutral-400">Content Director, Orbit Digital</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-neutral-200/60 bg-neutral-900 py-24">
          <div className="mx-auto max-w-4xl px-6 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
              Ready to create content that stands out?
            </h2>
            <p className="mt-4 text-lg text-neutral-400">
              Start with 5 free posts. No credit card needed.
            </p>
            <div className="mt-10">
              <Link href="/auth?signup=true">
                <Button size="xl" variant="gradient" className="gap-2">
                  Start Creating Free <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
