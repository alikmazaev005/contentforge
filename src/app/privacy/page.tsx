import type { Metadata } from "next"
import Link from "next/link"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { SITE_NAME } from "@/lib/constants"

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `${SITE_NAME} privacy policy — how we collect, use, and protect your data.`,
}

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="py-24">
        <div className="mx-auto max-w-3xl px-6">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">Privacy Policy</h1>
          <p className="text-sm text-neutral-400 mb-8">Last updated: July 2026</p>

          <div className="prose prose-neutral max-w-none space-y-6 text-neutral-600 text-sm leading-relaxed">
            <Section title="1. Information We Collect">
              <p>We collect information you provide when creating an account: email address and password (stored securely via Supabase Auth). When you generate content, we store your topic, selected platforms, tone preferences, and generated posts to provide our service.</p>
            </Section>

            <Section title="2. How We Use Your Information">
              <p>Your information is used solely to: provide and improve our AI content generation service, process payments through third-party providers (NOWPayments, ЮKassa), and send essential service communications.</p>
            </Section>

            <Section title="3. AI Content Generation">
              <p>Content you generate is processed by third-party AI providers (Google Gemini, Groq, Cloudflare, DeepSeek, HuggingFace). We do not train AI models on your content. Generated posts are stored in your account for your convenience.</p>
            </Section>

            <Section title="4. Payment Processing">
              <p>We use NOWPayments (crypto/card) and ЮKassa (Russian payment methods) for payment processing. We do not store your payment card details. Payment data is handled directly by our payment providers.</p>
            </Section>

            <Section title="5. Data Retention">
              <p>We retain your account data and generated posts for as long as your account is active. You may request deletion of your account and associated data at any time by contacting us.</p>
            </Section>

            <Section title="6. Third-Party Services">
              <p>We use Supabase for authentication and database hosting. Your data is stored on Supabase infrastructure. See supabase.com/privacy for their privacy practices.</p>
            </Section>

            <Section title="7. Your Rights">
              <p>You have the right to access, correct, or delete your personal data. You can export your generated content at any time from your dashboard. To delete your account, contact us.</p>
            </Section>

            <Section title="8. Contact">
              <p>For privacy-related inquiries, contact us at <a href="mailto:hi@contentforge.fun" className="text-violet-600 hover:underline">hi@contentforge.fun</a> or visit our <Link href="/contact" className="text-violet-600 hover:underline">contact page</Link>.</p>
            </Section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-lg font-semibold text-neutral-900 mb-3">{title}</h2>
      {children}
    </section>
  )
}
