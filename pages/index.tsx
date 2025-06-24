import { useEffect, useState } from 'react';

interface Wallet {
  name: string;
  address: string;
  balance: number;
  trustlines: Trustline[];
}

interface Trustline {
  currency: string;
  issuer: string;
  balance: number;
}

export default function Home() {
  const [wallets, setWallets] = useState<Wallet[]>([]);

  useEffect(() => {
    fetchWallets();
    const interval = setInterval(fetchWallets, 10000);
    return () => clearInterval(interval);
  }, []);

  async function fetchWallets() {
    const res = await fetch('/api/wallets');
    const data = await res.json();
    setWallets(data);
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-6">XRPL Wallet Tracker</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {wallets.map((wallet) => (
          <div key={wallet.address} className="bg-gray-800 p-4 rounded-xl shadow">
            <h2 className="text-xl font-semibold mb-2">{wallet.name}</h2>
            <p className="text-sm break-all">{wallet.address}</p>
            <p className="mt-2 text-green-400">XRP Balance: {wallet.balance.toFixed(6)}</p>
            <div className="mt-4 space-y-2">
              {wallet.trustlines.map((line, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span>{line.currency}</span>
                  <span>{line.balance}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
