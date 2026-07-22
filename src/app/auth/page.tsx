import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sparkles } from "lucide-react"

export default function AuthPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-20">
        <Card className="w-full max-w-md mx-6">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-100">
                <Sparkles className="h-6 w-6 text-violet-600" />
              </div>
            </div>
            <CardTitle>Create your account</CardTitle>
            <CardDescription>Start creating content in seconds. No credit card required.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="hi@example.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="••••••••" />
            </div>
            <Button className="w-full h-12" variant="gradient" size="lg">
              Get Started Free
            </Button>
            <p className="text-center text-xs text-neutral-400">
              By signing up, you agree to our Terms of Service and Privacy Policy.
            </p>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </>
  )
}
