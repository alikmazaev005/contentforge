import { NextResponse } from "next/server"

export async function GET() {
  const address = process.env.CRYPTO_WALLET_ADDRESS
  return NextResponse.json({ address: address || null })
}
