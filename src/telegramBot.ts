import TelegramBot = require('node-telegram-bot-api');
'node-telegram-bot-api';
import * as fs from 'fs';
import * as path from 'path';

const TELEGRAM_TOKEN = '8038618967:AAGOKrOAtOdsmYqGiPCV47Z2y19iIVTlQIk';
const AUTHORIZED_CHAT_ID = 'YOUR_CHAT_ID'; // Only allow this chat/user to run commands

const bot = new TelegramBot(TELEGRAM_TOKEN, { polling: true });

interface Wallet {
  name: string;
  address: string;
}

const walletsFile = path.resolve(__dirname, '../wallets.json');

function loadWallets(): Wallet[] {
  try {
    const data = fs.readFileSync(walletsFile, 'utf-8');
    return JSON.parse(data) as Wallet[];
  } catch {
    return [];
  }
}

function saveWallets(wallets: Wallet[]) {
  fs.writeFileSync(walletsFile, JSON.stringify(wallets, null, 2));
}

// Helper to check if user is authorized
function isAuthorized(chatId: number | string) {
  return chatId.toString() === AUTHORIZED_CHAT_ID;
}

// /listwallets - lists all wallets
bot.onText(/\/listwallets/, (msg) => {
  const chatId = msg.chat.id;
  if (!isAuthorized(chatId)) {
    return bot.sendMessage(chatId, '❌ Unauthorized.');
  }

  const wallets = loadWallets();
  if (wallets.length === 0) {
    return bot.sendMessage(chatId, '⚠️ No wallets are currently tracked.');
  }

  let response = '📋 Tracked wallets:\n\n';
  wallets.forEach((w, i) => {
    response += `${i + 1}. ${w.name} — ${w.address}\n`;
  });

  bot.sendMessage(chatId, response);
});

// /removewallet <name_or_address> - removes wallet by name or address
bot.onText(/\/removewallet (.+)/, (msg, match) => {
  if (!match) return;

  const chatId = msg.chat.id;
  if (!isAuthorized(chatId)) {
    return bot.sendMessage(chatId, '❌ Unauthorized.');
  }

  const toRemove = match[1].trim().toLowerCase();
  let wallets = loadWallets();

  const initialLength = wallets.length;

  wallets = wallets.filter(w => 
    w.address.toLowerCase() !== toRemove && w.name.toLowerCase() !== toRemove
  );

  if (wallets.length === initialLength) {
    return bot.sendMessage(chatId, `⚠️ Wallet not found by name or address: "${toRemove}"`);
  }

  saveWallets(wallets);
  bot.sendMessage(chatId, `✅ Removed wallet matching: "${toRemove}"`);
});
