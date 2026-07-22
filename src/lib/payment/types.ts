export type PaymentProvider = "lemonsqueezy" | "paddle" | "yookassa" | "crypto"

export interface PaymentResult {
  url?: string
  provider: PaymentProvider
  instructions?: string
  qrCode?: string
  walletAddress?: string
}

export interface PaymentPlan {
  id: string
  name: string
  price: number
  posts: number
  priceId: string
}
