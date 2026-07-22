# ContentForge 🪄

AI-powered social media content generator. Create platform-optimized posts for LinkedIn, Twitter/X, Instagram, Facebook, TikTok, and Threads — in 6 languages.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Styling:** Tailwind CSS v4 + shadcn/ui
- **AI:** OpenAI GPT-4o-mini + DALL-E 3
- **Auth:** Built-in (Supabase-ready)
- **Payments:** Stripe-ready
- **Deploy:** Vercel (recommended) or Cloudflare Pages

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Set up environment
cp .env.local.example .env.local
# Edit .env.local and add your OPENAI_API_KEY

# 3. Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `OPENAI_API_KEY` | Yes | OpenAI API key for GPT-4o-mini |

## Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

1. Connect your GitHub repo
2. Add `OPENAI_API_KEY` environment variable
3. Deploy — API routes work out of the box
