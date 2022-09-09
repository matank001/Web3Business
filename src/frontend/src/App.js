import React, { Component } from 'react'
import Web3 from 'web3'
import contract from "@truffle/contract"
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import './App.css'

class App extends Component {
  async componentDidMount() {
    window.web3 = await this.loadBlockchainData()
    window.erc20_token = await this.loadContract('./ERC20TokenTemplate.json')
    window.erc20_vendor = await this.loadContract('./ERC20TokenVendor.json')
    await this.loadBalance()
    await this.loadSymbol()
  }

  async loadBlockchainData() {
    const web3 = new Web3(Web3.givenProvider || "http://localhost:7545")
    const accounts = await web3.eth.requestAccounts()
    this.setState({ account: accounts[0] })
    return web3
  }

  async loadContract(json_name) {
    // Create a JavaScript version of the smart contract
    let new_contract = await fetch(json_name)
    new_contract = await new_contract.json()
    new_contract = contract(new_contract)
    new_contract.setProvider(Web3.givenProvider)
    try {
      return new_contract.deployed()
    } catch {
      console.error("Couldn't Deploy Contract")
    }
  }
  async loadBalance() {
    const accounts = await window.web3.eth.getAccounts()
    let balanceOf = await window.erc20_token.balanceOf.call(accounts[0])
    balanceOf = Web3.utils.fromWei(balanceOf, 'ether')
    this.setState({balance: balanceOf.toString()})
  }

  async loadSymbol() {
    const symbol = await window.erc20_token.symbol.call()
    this.setState({symbol: symbol.toString()})
  }

  buyTokens = async () => {
    const accounts = await window.web3.eth.getAccounts()
    const convert_ratio = await window.erc20_vendor.convert_ratio.call()
    const amount_in_token = this.state.amount_to_buy

    const amount_in_ether = Web3.utils.toWei(amount_in_token, 'ether') / convert_ratio
    console.log(amount_in_ether)
    const res = await window.erc20_vendor.buy_tokens({
      from: accounts[0],
      value: amount_in_ether
    })
    this.loadBalance()
    return res
  }

  createForm() {
    return (
      <Form>
        <Form.Group className="mb-3" controlId="amount">
          <Form.Label>Amount</Form.Label>
          <Form.Control type="text"
                value={this.state.amount_to_buy}
                placeholder={this.state.symbol}
                onChange={e => this.setState({ amount_to_buy: e.target.value })}
                />
          <Form.Text className="text-muted">
            Amount in MTK
          </Form.Text>
        </Form.Group>
        <Button variant="primary" onClick={this.buyTokens}>
          Buy
        </Button>
      </Form>
    );
  }

  constructor(props) {
    super(props)
    this.state = { 
        account: '',
        symbol: '',
        balance: 0,
        amount_to_buy: 0
      }
  }

  render() {
    return (
      <div className="container">
        <p>Your account: {this.state.account}</p>
        <p>Your balance: {this.state.balance}</p>
        { this.createForm() }
      </div>
    );
  }
}

export default App;