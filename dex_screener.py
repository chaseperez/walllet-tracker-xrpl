import config
import websocket, threading, json # type: ignore

def ws_handler(msg):
    data = json.loads(msg)
    # On spike: notify via Telegram (see below)
    print("Spike:", data)

def start_tracker():
    ws = websocket.WebSocketApp(config.DEXSCREENER_WS, on_message=ws_handler)
    threading.Thread(target=ws.run_forever, daemon=True).start()
