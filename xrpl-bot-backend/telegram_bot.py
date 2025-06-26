import config
from telegram import Update # type: ignore
from telegram.ext import Updater, CommandHandler, CallbackContext # type: ignore
import utils

def start(update: Update, ctx: CallbackContext):
    update.message.reply_text("XRPL Tracker activated.")

def copy_creator(update: Update, ctx: CallbackContext):
    addr = ctx.args[0]
    utils.copy_to_clipboard(addr)
    update.message.reply_text(f"Copied to clipboard: {addr}")

def alert_token(update: Update, ctx: CallbackContext):
    token = ctx.args[0]
    update.message.reply_text(f"Token alert: {token}")

def run_bot():
    up = Updater(config.TELE_TOKEN, use_context=True)
    dp = up.dispatcher
    dp.add_handler(CommandHandler("start", start))
    dp.add_handler(CommandHandler("copy_creator", copy_creator))
    dp.add_handler(CommandHandler("alert_token", alert_token))
    up.start_polling()
