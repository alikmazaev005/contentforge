"use client"

import { useRef, useCallback, useEffect, useState } from "react"

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
  const [ready, setReady] = useState(false)
  const siteKey = typeof window !== "undefined"
    ? process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY
    : ""

  const handleVerify = useCallback(
    (token: string) => onToken(token),
    [onToken]
  )

  const handleExpire = useCallback(() => {
    onToken("")
    if (widgetIdRef.current && window.hcaptcha) {
      window.hcaptcha.reset(widgetIdRef.current)
    }
  }, [onToken])

  useEffect(() => {
    if (!siteKey || !containerRef.current) return

    const init = () => {
      if (!containerRef.current || !window.hcaptcha) return
      widgetIdRef.current = window.hcaptcha.render(containerRef.current, {
        sitekey: siteKey,
        callback: handleVerify,
        "expired-callback": handleExpire,
      })
      setReady(true)
    }

    if (window.hcaptcha) {
      init()
      return
    }

    window.hcaptchaOnLoad = init

    const id = "hcaptcha-script"
    if (!document.getElementById(id)) {
      const script = document.createElement("script")
      script.id = id
      script.src = "https://js.hcaptcha.com/1/api.js?onload=hcaptchaOnLoad&render=explicit"
      script.async = true
      script.defer = true
      document.head.appendChild(script)
    }

    return () => {
      if (window.hcaptchaOnLoad === init) {
        window.hcaptchaOnLoad = undefined
      }
    }
  }, [siteKey, handleVerify, handleExpire])

  if (!siteKey) return null

  return (
    <div
      ref={containerRef}
      className={ready ? "hcaptcha-ready" : "hcaptcha-loading"}
    />
  )
}
