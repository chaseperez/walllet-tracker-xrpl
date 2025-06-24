import { Client } from 'xrpl';
import { notify } from './notifier';
import * as fs from 'fs';
import * as path from 'path';

const client = new Client('wss://s1.ripple.com');

interface Wallet {
  name: string;
  address: string;
}

interface TrustlineSnapshot {
  [currencyIssuer: string]: string; // e.g. 'USD-rABC123...': '100.0'
}

const previousXrpBalances: Record<string, string> = {};
const previousTrustlines: Record<string, TrustlineSnapshot> = {};

let isConnected = false;

function loadWallets(): Wallet[] {
  const filePath = path.resolve(__dirname, '../wallets.json');
  try {
    const rawData = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(rawData) as Wallet[];
  } catch (error) {
    console.error('❌ Failed to load wallets.json:', error);
    return [];
  }
}

async function ensureConnected() {
  if (!isConnected) {
    await client.connect();
    isConnected = true;
  }
}

export async function checkWallets() {
  await ensureConnected();
  const wallets = loadWallets();

  for (const wallet of wallets) {
    try {
      // 🟡 Check XRP balance
      const accountInfo = await client.request({
        command: 'account_info',
        account: wallet.address,
        ledger_index: 'validated'
      });

      const balance = accountInfo.result.account_data.Balance;
      const balanceXRP = parseFloat(balance) / 1_000_000;

      const prev = previousXrpBalances[wallet.address];
      if (prev && prev !== balance) {
        const diff = (parseFloat(balance) - parseFloat(prev)) / 1_000_000;
        const sign = diff >= 0 ? '+' : '';
        const type = diff > 0 ? '🟢 Buy' : '🔴 Sell';

        await notify(
          `${type} Detected (XRP)\n*Wallet:* ${wallet.name}\n*Address:* \`${wallet.address}\`\n` +
          `*Change:* ${sign}${diff.toFixed(6)} XRP\n*New Balance:* ${balanceXRP.toFixed(6)} XRP`
        );
      }

      previousXrpBalances[wallet.address] = balance;

      // 🟢 Check Trustlines
      const linesResponse = await client.request({
        command: 'account_lines',
        account: wallet.address
      });

      const trustlines = linesResponse.result.lines;
      const currentTrustlines: TrustlineSnapshot = {};

      for (const line of trustlines) {
        const key = `${line.currency}-${line.account}`;
        currentTrustlines[key] = line.balance;
      }

      const prevTrust = previousTrustlines[wallet.address] || {};

      // Detect new trustlines
      for (const key in currentTrustlines) {
        if (!(key in prevTrust)) {
          await notify(
            `🔗 *New Trustline Set*\n*Wallet:* ${wallet.name}\n*Token:* ${key}\n*Balance:* ${currentTrustlines[key]}`
          );
        } else {
          const oldBalance = parseFloat(prevTrust[key]);
          const newBalance = parseFloat(currentTrustlines[key]);
          const diff = newBalance - oldBalance;

          if (diff !== 0) {
            const sign = diff > 0 ? '+' : '';
            const type = diff > 0 ? '🟢 Buy' : '🔴 Sell';
            await notify(
              `${type} Detected (${key})\n*Wallet:* ${wallet.name}\n*Change:* ${sign}${diff.toFixed(6)}\n*New Balance:* ${newBalance.toFixed(6)}`
            );
          }
        }
      }

      previousTrustlines[wallet.address] = currentTrustlines;

    } catch (error) {
      console.error(`❌ Error checking wallet ${wallet.address}:`, error);
    }
  }
}
