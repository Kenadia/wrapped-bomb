import React, { Component } from 'react'
import Web3 from 'web3'
import BombContract from './contracts/BOMBv3.json'
import WbombContract from './contracts/WBOMB.json'
import getWeb3 from './util/getWeb3'
import './App.css'

const TruffleContract = require('@truffle/contract')

interface Props {
}

interface State {
  baseAllowance?: string,
  baseBalance?: string,
  baseToken?: any,
  formApproveAmount?: string,
  formWrapAmount?: string,
  localWeb3?: boolean,
  userAddress?: string,
  networkId?: number,
  networkName?: string,
  web3?: Web3,
  wrappedBalance?: string,
  wrappedToken?: any,
}

export default class App extends Component<Props, State> {

  constructor(props) {
    super(props)
    this.state = {}

    // TOOD: Fix.
    this.approve = this.approve.bind(this)
    this.wrap = this.wrap.bind(this)
  }

  async componentWillMount() {
    // Get network provider and web3 instance.
    // See utils/getWeb3 for more info.

    const { local, web3 } = await getWeb3()
    const userAddress = (await web3.eth.getAccounts())[0]

    const networkId = await web3.eth.net.getId()
    let networkName = 'unknown'
    switch (networkId) {
      case 1:
        networkName = 'main'
        break
      case 42:
        networkName = 'Kovan'
        break
    }

    const wrappedTokenContract = TruffleContract(WbombContract)
    wrappedTokenContract.setProvider(web3.currentProvider)
    const wrappedToken = await wrappedTokenContract.deployed()
    web3.eth.defaultAccount = userAddress
    const wrappedBalance = (await wrappedToken.balanceOf.call(userAddress)).toString()

    const baseTokenContract = TruffleContract(BombContract)
    baseTokenContract.setProvider(web3.currentProvider)
    let baseToken
    if (networkId === 1) {
      baseToken = await baseTokenContract.at('0x1C95b093d6C236d3EF7c796fE33f9CC6b8606714')
    } else {
      baseToken = await baseTokenContract.deployed()
    }
    web3.eth.defaultAccount = userAddress
    const baseAllowance = (await baseToken.allowance.call(userAddress, wrappedToken.address)).toString()
    const baseBalance = (await baseToken.balanceOf.call(userAddress)).toString()

    this.setState({
      baseAllowance,
      baseBalance,
      baseToken,
      formApproveAmount: '',
      formWrapAmount: '',
      localWeb3: local,
      networkId,
      networkName,
      userAddress,
      web3,
      wrappedBalance,
      wrappedToken,
    })
  }

  async approve() {
    const spender = this.state.wrappedToken.address
    const receipt = await this.state.baseToken.approve.call(spender, this.state.formApproveAmount)
    console.log('Approve operation:', receipt)
  }

  async wrap() {
    const receipt = await this.state.wrappedToken.wrap.call(this.state.formWrapAmount)
    console.log('Wrap operation:', receipt)
  }

  render() {
    let updateApproveAmount = (e) => {
      this.setState({ formApproveAmount: e.target.value })
    }
    let updateWrapAmount = (e) => {
      this.setState({ formWrapAmount: e.target.value })
    }

    return (
      <div className="App">
        <nav className="navbar pure-menu pure-menu-horizontal">
          <a href="/" className="pure-menu-heading pure-menu-link">WBOMB</a>
        </nav>

        <main className="container">
          <div className="pure-g">
            <div className="pure-u-1-1">

              <h1>Wrapped-BOMB</h1>
              <p>The future of de-fused self-destructing digital assets has arrived.</p>
              <p><em>“Your deflation is my opportunity.”</em></p>

              <h2>Wrap and unwrap</h2>

              {this.state.web3 &&
                <div>
                  {this.state.localWeb3 &&
                    <p className="status-fail">
                      DEV-ONLY: Could not find injected web3, using local blockchain.
                    </p>
                  }

                  <p>Status: Connected to <strong>{this.state.networkName}</strong> network with account:</p>
                  <p>{this.state.userAddress}</p>

                  <p>Balances:</p>
                  <ul>
                    <li>BOMB: {this.state.baseBalance}</li>
                    <li>WBOMB: {this.state.wrappedBalance}</li>
                  </ul>

                  <p>Allowances:</p>
                  <ul>
                    <li>BOMB: {this.state.baseAllowance}</li>
                  </ul>

                  <div className="form-row">
                    <label htmlFor="approve-amount">Set BOMB allowance:</label>
                    <input
                      type="number"
                      id="approve-amount"
                      value={this.state.formApproveAmount}
                      onChange={updateApproveAmount}
                    />
                    <button
                      type="button"
                      onClick={this.approve}>
                      Set allowance
                    </button>
                  </div>

                  <div className="form-row">
                    <label htmlFor="wrap-amount">Number of BOMB tokens to wrap:</label>
                    <input
                      type="number"
                      id="wrap-amount"
                      value={this.state.formWrapAmount}
                      onChange={updateWrapAmount}
                    />
                    <button
                      type="button"
                      onClick={this.wrap}>
                      Wrap
                    </button>
                  </div>

                  <h2>How it works</h2>
                  <p>
                    WBOMB (Wrapped-BOMB) is an ERC-20 token wrapping BOMB, similar to the way WETH
                    acts as an ERC-20 wrapper for Ether.
                    The WBOMB smart contract makes BOMB and WBOMB interchangeable, one-to-one, via the “wrap”
                    and “unwrap” functions, with the caveat that 1% (rounded-up) of the wrapped or unwrapped BOMBs
                    will “explode” (i.e. will be burned) upon each wrap or unwrap operation.
                  </p>
                  <p>
                    The advantage offered by WBOMB is that unlike regular BOMB, wrapped BOMB tokens can be
                    traded freely without triggering the “self-destruct” deflationary mechanism of the BOMB
                    token. Once one's BOMB tokens have been wrapped, they will no longer “explode” until they
                    are unwrapped. WBOMB therefore carries the full value of BOMB but provides more utility
                    because it doesn't explode.
                  </p>
                  <p>
                    A second feature of WBOMB is that once a BOMB is wrapped, it can be divided and traded in
                    increments of one nonillionth (i.e. 10<sup>-30</sup>) of a BOMB, making WBOMB useful
                    for microtransactions. Note, however, that only whole WBOMBs can be unwrapped.
                  </p>

                </div>
              }

              {!this.state.web3 &&
                <p>Could not find web3. Please install MetaMask or another web3 provider to use this app.</p>
              }
            </div>
          </div>
        </main>
      </div>
    )
  }
}
