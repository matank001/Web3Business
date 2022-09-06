from web3 import Web3
import sys
import json

CONTRACT_PATH = 'build/contracts/ERC20TokenTemplate.json'
BLOCKCHAIN_SERVER = 'http://127.0.0.1:7545'

def get_contract(w3, contract_path):
    with open(CONTRACT_PATH) as file:
        contract_json = json.load(file)  # load contract info as JSON
        contract_abi = contract_json['abi']  # fetch contract's abi - necessary to call its functions
        contract_address = contract_json['networks']['1337']['address']

    print("Contract Address:", contract_address)

    # Fetch deployed contract reference
    return w3.eth.contract(address=contract_address, abi=contract_abi)

def main():
    w3 = Web3(Web3.HTTPProvider(BLOCKCHAIN_SERVER))
    print ("Network Is Connected: ", w3.isConnected())
    if (not w3.isConnected()):
        sys.exit(-1)
    w3.eth.defaultAccount = w3.eth.accounts[0]

    #Connected
    contract = get_contract(w3, CONTRACT_PATH)
    print ("Contract Name:", contract.functions.name().call())
    print ("Contract Symbol:", contract.functions.symbol().call())

main()
