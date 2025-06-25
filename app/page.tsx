'use client';

import { useEffect, useState } from "react";
import Image from "next/image";

interface Wallet {
  name: string;
  address: string;
  balance: number;
  trustlines: {
    currency: string;
    issuer: string;
    balance: number;
  }[];
}

export default function Home() {
  const [wallets, setWallets] = useState<Wallet[]>([]);

  useEffect(() => {
    fetchWallets();
    const interval = setInterval(fetchWallets, 10_000);
    return () => clearInterval(interval);
  }, []);

  async function fetchWallets() {
    const res = await fetch("/api/wallets");
    const data = await res.json();
    setWallets(data);
  }

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />

        {/* 🧩 XRPL Wallet Tracker UI */}
        <section className="w-full">
          <h2 className="text-2xl font-semibold mb-4">XRPL Wallet Tracker</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {wallets.map((wallet) => (
              <div
                key={wallet.address}
                className="bg-gray-100 dark:bg-gray-800 text-black dark:text-white p-4 rounded-lg shadow-md"
              >
                <h3 className="font-bold text-lg">{wallet.name}</h3>
                <p className="text-xs break-words mb-2">
                  {wallet.address}{" "}
                  <button
                    className="text-blue-500 text-xs underline ml-2"
                    onClick={() => {
                      navigator.clipboard.writeText(wallet.address);
                    }}
                  >
                    Copy
                  </button>
                </p>
                <p className="font-mono text-green-500">
                  XRP Balance: {wallet.balance.toFixed(6)}
                </p>
                <h4 className="font-semibold mt-3">Trustlines</h4>
                {wallet.trustlines.length > 0 ? (
                  <ul className="text-sm mt-1">
                    {wallet.trustlines.map((line, idx) => (
                      <li key={idx} className="flex justify-between">
                        <span>{line.currency}</span>
                        <span>{line.balance}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-gray-500">None</p>
                )}
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
