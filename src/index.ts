// index.ts
import { checkWallets } from './walletTracker';

async function pollWallets() {
  try {
    await checkWallets();
  } catch (error) {
    console.error('❌ Error during wallet check:', error);
  }
}

setInterval(() => {
  pollWallets();
}, 10_000); // check every 10 seconds

// Optionally run immediately on start
pollWallets();
