import config
from tracker import fetch_account_tx, get_payment_flows
from telegram_bot import run_bot
from dex_screener import start_tracker
import time, threading

def monitor_wallets():
    while True:
        for addr in config.TRACKED_WALLETS:
            txs = fetch_account_tx(addr)
            # Parse for token buys: when XRP spent -> identify vendor, amount
            for tx in txs:
                if tx["tx"]["TransactionType"] == "OfferCreate":
                    # extract price, token, issuer
                    # then send Telegram alert with token name and amount.
                    pass
        time.sleep(30)

if __name__ == "__main__":
    threading.Thread(target=monitor_wallets, daemon=True).start()
    start_tracker()
    run_bot()
