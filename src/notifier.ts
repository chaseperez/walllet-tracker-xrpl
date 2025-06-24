// src/notifier.ts
import TelegramBot = require('node-telegram-bot-api');

// Replace with your real bot token and chat ID
const TELEGRAM_TOKEN = '8038618967:AAGOKrOAtOdsmYqGiPCV47Z2y19iIVTlQIk';
const CHAT_ID = '7861907274'; // Your user or group chat ID

// 🚀 Create the bot instance
const bot = new TelegramBot(TELEGRAM_TOKEN, { polling: false });

// 📤 Notification function
export async function notify(message: string) {
  try {
    await bot.sendMessage(CHAT_ID, message);
    console.log('📨 Notification sent:', message);
  } catch (err) {
    console.error('❌ Failed to send Telegram message:', err);
  }
}

// ✅ Run a test notification if this file is run directly
if (require.main === module) {
  notify("✅ This is a test message from your XRPL wallet tracker bot.");
}
