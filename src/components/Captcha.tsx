"use client"

import { useRef, useEffect } from "react"

declare global {
  interface Window {
    hcaptcha?: {
      render: (container: HTMLElement, opts: Record<string, unknown>) => string
      reset: (widgetId: string) => void
      getResponse: (widgetId: string) => string
    }
    hcaptchaOnLoad?: () => void
  }
}

interface CaptchaProps {
  onToken: (token: string) => void
}

export function Captcha({ onToken }: CaptchaProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const widgetIdRef = useRef<string | null>(null)
  const siteKey = typeof window !== "undefined"
    ? process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY
    : ""

  useEffect(() => {
    if (!siteKey || !containerRef.current) return

    const id = "hcaptcha-script"
    if (!document.getElementById(id)) {
      const script = document.createElement("script")
      script.id = id
      script.src = "https://js.hcaptcha.com/1/api.js?render=explicit&onload=hcaptchaOnLoad"
      script.async = true
      script.defer = true
      document.head.appendChild(script)
    }

    const init = () => {
      if (!containerRef.current || !window.hcaptcha) return
      widgetIdRef.current = window.hcaptcha.render(containerRef.current, {
        sitekey: siteKey,
        callback: (token: string) => onToken(token),
        "expired-callback": () => onToken(""),
      })
    }

    if (window.hcaptcha) {
      init()
    } else {
      window.hcaptchaOnLoad = init
    }

    return () => {
      window.hcaptchaOnLoad = undefined
    }
  }, [siteKey, onToken])

  return (
    <div
      ref={containerRef}
      className="h-captcha"
      data-sitekey={siteKey}
    />
  )
}

export function resetCaptcha(widgetId: string | null) {
  if (widgetId && window.hcaptcha) {
    window.hcaptcha.reset(widgetId)
  }
}
