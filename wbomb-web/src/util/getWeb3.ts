import Web3 from 'web3'

const LOCAL_BLOCKCHAIN = 'http://localhost:8545'

interface Window {
  ethereum?: any,
  web3?: Web3
}

export interface Web3Environment {
  local: boolean
  web3: Web3
}

export default async function getWeb3(): Promise<Web3Environment> {
  return new Promise(function(resolve, reject) {
    window.addEventListener('load', async () => {
      const { ethereum, web3 } = window as Window

      if (ethereum) {
        try {
          await ethereum.enable()
          resolve({ local: false, web3: new Web3(ethereum) })
        } catch (error) {
          reject(error)
        }
      }

      else if (web3) {
        resolve({ local: false, web3: new Web3(web3.currentProvider) })
      }

      else if (process.env.NODE_ENV !== 'production') {
        // Fall back to localhost.
        const provider = new Web3.providers.HttpProvider(LOCAL_BLOCKCHAIN)
        resolve({ local: true, web3: new Web3(provider) })
      }

      else {
        reject()
      }
    })
  })
}
