from telegram import Bot, ParseMode, InlineKeyboardButton, InlineKeyboardMarkup
from flask import Flask, request
import os

app = Flask(__name__)

# Load token and chat ID from environment variables
BOT_TOKEN = os.environ.get("8038618967:AAGOKrOAtOdsmYqGiPCV47Z2y19iIVTlQIk")
CHAT_ID = os.environ.get("7861907274")

bot = Bot(token=BOT_TOKEN)

@app.route("/send_alert", methods=["POST"])
def send_alert():
    data = request.json

    msg = f"""<b>🔴 New SELL by <a href="{data['wallet_url']}">{data['wallet_name']}</a></b>\n
<b>{data['amount']} {data['token']}</b> ⬅️ <b>{data['xrp']} XRP</b> (${data['usd']})\n
MC - ${data['mc']}K\nLiq - ${data['liq']}K\n
<code>{data['wallet_address']}</code>"""

    buttons = [
        [InlineKeyboardButton("📄 TRANSACTION", url=data["tx_url"]),
         InlineKeyboardButton("📈 CHART", url=data["chart_url"])]
    ]

    bot.send_message(
        chat_id=CHAT_ID,
        text=msg,
        parse_mode=ParseMode.HTML,
        reply_markup=InlineKeyboardMarkup(buttons)
    )

    return {"status": "sent"}
