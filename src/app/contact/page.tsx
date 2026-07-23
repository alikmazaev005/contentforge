import type { Metadata } from "next"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { SITE_NAME } from "@/lib/constants"
import { Mail, MessageCircle, Clock, ArrowRight } from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Contact Us",
  description: `Get in touch with ${SITE_NAME} team — support, feedback, or inquiries.`,
}

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main className="py-24">
        <div className="mx-auto max-w-3xl px-6">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">Contact Us</h1>
            <p className="text-lg text-neutral-500">Have questions, feedback, or need help? We&apos;d love to hear from you.</p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <Card className="border-neutral-200">
              <CardContent className="p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-violet-100">
                  <Mail className="h-6 w-6 text-violet-600" />
                </div>
                <h2 className="font-semibold text-lg mb-2">Email</h2>
                <p className="text-sm text-neutral-500 mb-4">For support, billing, or general inquiries.</p>
                <a href="mailto:hi@contentforge.fun" className="text-violet-600 font-medium hover:underline text-sm">
                  hi@contentforge.fun <ArrowRight className="inline h-3 w-3 ml-1" />
                </a>
              </CardContent>
            </Card>

            <Card className="border-neutral-200">
              <CardContent className="p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-violet-100">
                  <MessageCircle className="h-6 w-6 text-violet-600" />
                </div>
                <h2 className="font-semibold text-lg mb-2">Feedback</h2>
                <p className="text-sm text-neutral-500 mb-4">Found a bug or have a feature request?</p>
                <a href="mailto:hi@contentforge.fun?subject=Feedback" className="text-violet-600 font-medium hover:underline text-sm">
                  Send feedback <ArrowRight className="inline h-3 w-3 ml-1" />
                </a>
              </CardContent>
            </Card>

            <Card className="border-neutral-200 sm:col-span-2">
              <CardContent className="p-6 flex items-start gap-4">
                <Clock className="h-5 w-5 text-violet-600 shrink-0 mt-0.5" />
                <div>
                  <h2 className="font-semibold text-lg mb-1">Response Time</h2>
                  <p className="text-sm text-neutral-500">We typically respond within 24 hours on business days. For urgent billing issues, include &ldquo;Urgent&rdquo; in your subject line.</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-12 text-center">
            <p className="text-sm text-neutral-500 mb-4">Before contacting, check our</p>
            <div className="flex items-center justify-center gap-4">
              <Link href="/privacy"><Button variant="outline" size="sm">Privacy Policy</Button></Link>
              <Link href="/terms"><Button variant="outline" size="sm">Terms of Service</Button></Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
