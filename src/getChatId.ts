import TelegramBot = require('node-telegram-bot-api');
import * as dotenv from 'dotenv';

dotenv.config();


const token = process.env.TELEGRAM_BOT_TOKEN!;
const bot = new TelegramBot(token, { polling: true });

bot.on('message', (msg) => {
  console.log('📩 Message received from:', msg.chat.first_name);
  console.log('💬 Chat ID (user ID):', msg.chat.id);
  bot.sendMessage(msg.chat.id, '✅ Got your message! Your chat ID is logged in the terminal.');
});
