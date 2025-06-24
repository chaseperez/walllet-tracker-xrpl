// src/walletStore.ts
const wallets: Set<string> = new Set();

export function addWallet(address: string): boolean {
  if (!wallets.has(address)) {
    wallets.add(address);
    return true;
  }
  return false;
}

export function getWallets(): string[] {
  return Array.from(wallets);
}
