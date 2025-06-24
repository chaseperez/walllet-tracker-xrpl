import requests # type: ignore
from config import XRPSCAN_API

def get_payment_flows(address):
    res = requests.get(f"{XRPSCAN_API}/account/{address}/payment_flows")
    return res.json() or []

def get_token_name(issuer, token_code):
    # Optionally map via token metadata API or custom cache
    return f"{token_code} ({issuer[:6]})"
