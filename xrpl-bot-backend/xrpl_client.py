import config
from xrpl.clients import JsonRpcClient # type: ignore
from xrpl.wallet import Wallet # type: ignore
from xrpl.models.requests import AccountTx # type: ignore

client = JsonRpcClient(config.XRPL_RPC)

def fetch_account_tx(address):
    req = AccountTx(account=address, ledger_index_min=-1, ledger_index_max=-1, limit=10, forward=False)
    return client.request(req).result["transactions"]
