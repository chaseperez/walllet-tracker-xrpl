import TelegramBot = require('node-telegram-bot-api');


// Your bot token from BotFather
const token = '8038618967:AAGOKrOAtOdsmYqGiPCV47Z2y19iIVTlQIk';

// Your chat ID obtained from getChatId.ts
const CHAT_ID = '7861907274';

// Create a bot instance
const bot = new TelegramBot(token, { polling: false });

async function sendTestMessage() {
  try {
    await bot.sendMessage(CHAT_ID, "Hello! This is a test notification from your bot.");
    console.log('Message sent successfully!');
  } catch (error) {
    console.error('Error sending message:', error);
  }
}

sendTestMessage();
