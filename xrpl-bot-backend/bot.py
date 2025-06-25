
import config
from tracker import fetch_account_tx, get_payment_flows
from telegram_bot import run_bot
from dex_screener import start_tracker
from telegram import Bot, InlineKeyboardButton, InlineKeyboardMarkup, ParseMode
from flask import Flask, request
import os
import time
import threading

# --- Telegram Bot Setup ---
bot_token = os.environ.get("AAGOKrOAtOdsmYqGiPCV47Z2y19iIVTlQIk")  # Change to a proper env var name
chat_id = int(os.environ.get("7861907274"))  # Chat IDs are integers

bot = Bot(token=bot_token)

def send_telegram_alert(data):
    msg = f"""<b>🔴 New SELL by <a href="{data['wallet_url']}">{data['wallet_name']}</a></b>\n
<b>{data['amount']} {data['token']}</b> ⬅️ <b>{data['xrp']} XRP</b> (${data['usd']})\n
MC - ${data['mc']}K\nLiq - ${data['liq']}K\n
<code>{data['wallet_address']}</code>"""

    buttons = [
        [InlineKeyboardButton("📄 TRANSACTION", url=data["tx_url"]),
         InlineKeyboardButton("📈 CHART", url=data["chart_url"])]
    ]

    bot.send_message(
        chat_id=chat_id,
        text=msg,
        parse_mode=ParseMode.HTML,
        reply_markup=InlineKeyboardMarkup(buttons)
    )

# --- Flask API for Manual Alerts ---
app = Flask(__name__)

@app.route("/send_alert", methods=["POST"])
def send_alert():
    data = request.json
    send_telegram_alert(data)
    return {"status": "sent"}, 200

# --- XRPL Wallet Monitor Logic ---
def monitor_wallets():
    while True:
        for addr in config.TRACKED_WALLETS:
            txs = fetch_account_tx(addr)
            for tx in txs:
                if tx["tx"]["TransactionType"] == "OfferCreate":
                    # TODO: Parse real data from tx
                    alert_data = {
                        "wallet_name": "WalletName",
                        "wallet_url": f"https://xrpscan.com/account/{addr}",
                        "amount": "10000",
                        "token": "XRPLM",
                        "xrp": "120",
                        "usd": "72.55",
                        "mc": "500",
                        "liq": "12",
                        "wallet_address": addr,
                        "tx_url": f"https://xrpscan.com/tx/{tx['tx']['hash']}",
                        "chart_url": "https://dexcharts.example.com/XRPLM"
                    }
                    send_telegram_alert(alert_data)
        time.sleep(30)

# --- Main Entry Point ---
if __name__ == "__main__":
    threading.Thread(target=monitor_wallets, daemon=True).start()
    threading.Thread(target=start_tracker, daemon=True).start()
    threading.Thread(target=run_bot, daemon=True).start()
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))
