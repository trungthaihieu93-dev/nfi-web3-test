import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import logo from './logo.svg'
import './App.css'

function App() {
  const [provider, setProvider] = useState(null)
  const [signer, setSigner] = useState(null)
  const [address, setAddress] = useState('Unknown')
  const [currentBlock, setCurrentBlock] = useState('Unknown')
  const [network, setNetwork] = useState(null)

  // Effects
  // Get Address
  useEffect(() => {
    if (signer) {
      signer
        .getAddress()
        .then((addr) => setAddress(addr))
        .catch((err) => console.error(err))
    }
  }, [signer])

  // Get Block
  useEffect(() => {
    if (provider) {
      // Block Num
      provider
        .getBlockNumber()
        .then((blockNum) => setCurrentBlock(blockNum))
        .catch((err) => console.error(err))

      // Get Signer
      provider
        .send('eth_requestAccounts', [])
        .then((_) => {
          const web3Signer = provider.getSigner()
          setSigner(web3Signer)
        })
        .catch((err) => console.error(err))

      // Get Network
      provider
        .getNetwork()
        .then((network) => {
          setNetwork(network)
        })
        .catch((err) => console.error(err))

      if (window.ethereum) {
        window.ethereum.on('networkChanged', (_) => {
          provider
            .getNetwork()
            .then((network) => {
              setNetwork(network)
              alert('Network changed!')
            })
            .catch((err) => console.error(err))
        })
      }
    }
  }, [provider])

  // Handlers
  // Connect Wallet
  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        alert('Please install MetaMask!')
        return
      }
      const web3Provider = new ethers.providers.Web3Provider(
        window.ethereum,
        'any',
      )
      setProvider(web3Provider)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        {!provider && !signer && (
          <button onClick={connectWallet}>Connect Wallet</button>
        )}
        <span>Address: {address}</span>
        <br />
        <span>
          Chain: {network?.name || 'Unknown'}, Id:{' '}
          {network?.chainId || 'Unknown'}
        </span>
        <br />
        <span>Current Block: {currentBlock}</span>
        <br />
      </header>
    </div>
  )
}

export default App
