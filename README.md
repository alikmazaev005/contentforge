<div align="center">

  <h1>ContentForge рџЄ„</h1>

  <p>
    <strong>Write once. Publish everywhere.</strong>
    <br />
    AI-powered content creation for LinkedIn, Twitter/X, Instagram, Facebook, TikTok & Threads вЂ” in 6 languages
  </p>

  <p>
    <a href="https://contentforge.fun" target="_blank">рџЊђ contentforge.fun</a>
    &nbsp;В·&nbsp;
    <a href="#features">Features</a>
    &nbsp;В·&nbsp;
    <a href="#quick-start">Quick Start</a>
    &nbsp;В·&nbsp;
    <a href="#tech-stack">Tech Stack</a>
  </p>

  <p>
    <img src="https://img.shields.io/badge/Next.js-16-black" alt="Next.js 16" />
    <img src="https://img.shields.io/badge/Tailwind-v4-38bdf8" alt="Tailwind v4" />
    <img src="https://img.shields.io/badge/AI-OpenAI%20%7C%20Gemini%20%7C%20Groq-blue" alt="AI Providers" />
    <img src="https://img.shields.io/badge/license-MIT-green" alt="License" />
  </p>

  <br />

  <img src="public/og-image.png" alt="ContentForge Preview" width="600" />

</div>

---

## рџљЂ About

[**ContentForge**](https://contentforge.fun) is an AI-powered social media content generator. Describe your topic once вЂ” get perfectly crafted, platform-optimized posts with AI-generated images for every major social network.

**Live at:** [https://contentforge.fun](https://contentforge.fun)

### вњЁ Features

- **рџ¤– AI-Powered Generation** вЂ” One topic в†’ posts tailored for LinkedIn, Twitter/X, Instagram, Facebook, TikTok, Threads
- **рџЊЌ 6 Languages** вЂ” English, Р СѓСЃСЃРєРёР№, Deutsch, FranГ§ais, EspaГ±ol, дё­ж–‡
- **рџЋЁ AI Images Included** вЂ” Every post gets a platform-optimized AI-generated image
- **вљЎ One Click, All Platforms** вЂ” Length, tone, format & hashtags optimized automatically
- **рџЋ™пёЏ Brand Voice** вЂ” Set tone, audience & keywords once

### рџ’° Pricing

| Plan | Price | Includes |
|------|-------|----------|
| **Free** | $0/mo | 5 posts, 1 platform, basic AI |
| **Pro** | $9/mo | Unlimited posts, all platforms & languages, AI images, scheduling |
| **Business** | $29/mo | Everything in Pro + 5 team accounts, custom branding, API |

---

## рџ› пёЏ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 16 (App Router) |
| **Styling** | Tailwind CSS v4 + shadcn/ui + Geist font |
| **AI** | OpenAI GPT-4o-mini / Gemini / Groq / DeepSeek / HuggingFace (fallback chain) |
| **Auth** | Supabase Auth |
| **Database** | Supabase PostgreSQL |
| **Payments** | Lemon Squeezy + Paddle + YooKassa + Crypto (USDT TRC-20) |
| **Deploy** | Vercel |

---

## рџЏЃ Quick Start

```bash
# 1. Clone & install
git clone https://github.com/alikmazaev005/contentforge.git
cd contentforge
npm install

# 2. Set up environment
cp .env.local.example .env.local
# Edit .env.local with your API keys

# 3. Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### рџ”‘ Environment Variables

All AI providers are optional вЂ” the app falls back automatically:

| Variable | Required | Description |
|----------|----------|-------------|
| `GEMINI_API_KEY` | Free | 1500 req/day вЂ” recommended default |
| `GROQ_API_KEY` | Free | 30 req/min fallback |
| `CF_API_TOKEN` | Free | 100k req/day (requires Account ID) |
| `DEEPSEEK_API_KEY` | Free | Alternative fallback |
| `HF_API_KEY` | Free | HuggingFace fallback |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase anon key |

---

## рџљў Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/alikmazaev005/contentforge)

1. Connect your GitHub repo to Vercel
2. Add the required environment variables
3. Deploy вЂ” works out of the box

---

## рџ¤ќ Contributing

Contributions are welcome! Feel free to open issues or submit PRs.

---

## рџ“„ License

MIT В© [alikmazaev005](https://github.com/alikmazaev005)
