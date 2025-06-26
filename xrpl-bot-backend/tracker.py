import requests  # type: ignore
from config import XRPSCAN_API

def fetch_account_tx(address):
    """
    Fetch recent transactions for a given XRPL address.
    """
    res = requests.get(f"{XRPSCAN_API}/account/{address}/transactions")
    if res.status_code == 200:
        return res.json() or []
    else:
        print(f"Error fetching transactions: {res.status_code}")
        return []

def get_payment_flows(address):
    res = requests.get(f"{XRPSCAN_API}/account/{address}/payment_flows")
    return res.json() or []

def get_token_name(issuer, token_code):
    # Optionally map via token metadata API or custom cache
    return f"{token_code} ({issuer[:6]})"
