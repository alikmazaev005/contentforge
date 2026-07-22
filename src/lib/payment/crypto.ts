export function getCryptoPaymentInfo(planId: string, planPrice: number) {
  const walletAddress = process.env.CRYPTO_WALLET_ADDRESS

  if (!walletAddress) {
    return null
  }

  const usdtPrice = planPrice === 9 ? "9" : "29"

  return {
    walletAddress,
    network: "TRC-20",
    currency: "USDT",
    amount: usdtPrice,
    instructions: `Send exactly ${usdtPrice} USDT (TRC-20) to the address below. After payment, send the TXID to @contentforge support for activation.`,
  }
}
