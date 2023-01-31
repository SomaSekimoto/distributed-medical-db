import Link from 'next/link'
import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { useEffect, useState } from 'react'
import { BytesLike, Signer, ethers } from 'ethers'

export default function App({ Component, pageProps }: AppProps) {
  const [isVerified, setIsVerified] = useState<boolean>(false)
  const [address, setAddress] = useState<string>('')
  const [correctNetwork, setCorrectNetwork] = useState<boolean>(false)
  const [provider, setProvider] = useState<any>();
  const [signer, setSigner] = useState<Signer>();
  const connectWallet = async () =>{
    if (!(window as any).ethereum) {
      console.error('Please install Metamask!!')
      return
    }
    let signer: Signer;
    let provider: any;
    if(process.env.NEXT_PUBLIC_APP_ENV == 'production'){
      provider = new ethers.providers.Web3Provider((window as any).ethereum)
      await provider.send('eth_requestAccounts', [])
      signer = await provider.getSigner()
    } else {
      provider = ethers.getDefaultProvider(process.env.NEXT_PUBLIC_RPC_URL)
      // let privKey: BytesLike = ethers.utils.getAddress(process.env.NEXT_PUBLIC_PRV_KEY)
      let privKey: BytesLike = process.env.NEXT_PUBLIC_PRV_KEY.toString()
      signer = new ethers.Wallet(privKey, provider)
    }
    const message = 'connect your wallet to distributed medical database'
    let address = await signer.getAddress()
    setProvider(provider)
    setSigner(signer)
    setAddress(address)
    const signature = await signer.signMessage(message)
    const response = await fetch('/api/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: JSON.stringify({ message, address, signature }),
    })
    const body = await response.json()
    setIsVerified(body.isVerified)
  }
  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window as any
		if (ethereum) {
			console.log('Got the ethereum obejct: ', ethereum)
		} else {
			console.log('No Wallet found. Connect Wallet')
		}

		const accounts = await ethereum.request({ method: 'eth_accounts' })

		if (accounts.length !== 0) {
			console.log('Found authorized Account: ', accounts[0])
			setAddress(accounts[0])
		} else {
			console.log('No authorized account found')
		}
  } 

  const checkCorrectNetwork = async () => {
    const { ethereum } = window as any
		let chainId = await ethereum.request({ method: 'eth_chainId' })
		console.log('Connected to chain:' + chainId)

		const goerliChainId = '0x5'

		const devChainId = 1337
		const localhostChainId = `0x${Number(devChainId).toString(16)}`

		if (chainId !== goerliChainId && chainId !== localhostChainId) {
			setCorrectNetwork(false)
		} else {
			setCorrectNetwork(true)
		}
  }

  useEffect(() => {
		checkIfWalletIsConnected()
		checkCorrectNetwork()
	}, [])
  return (
    <>
      <nav className="bg-white border-gray-200 px-2 sm:px-4 py-2.5 rounded dark:bg-gray-900">
        <div className="container flex flex-wrap items-center justify-between mx-auto">
          <Link href='/'>
            <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">Distributed Medical DB</span>
          </Link>
          <button data-collapse-toggle="navbar-default" type="button" className="inline-flex items-center p-2 ml-3 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-default" aria-expanded="false">
            <span className="sr-only">Open main menu</span>
            <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"></path></svg>
          </button>
          <div className="hidden w-full md:block md:w-auto" id="navbar-default">
            <ul className="flex flex-col p-4 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
              <li>
                <Link href="/mypage" className="block py-2 pl-3 pr-4 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">mypage</Link>
              </li>
              <li>
                <Link href="/patients" className="block py-2 pl-3 pr-4 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">patients</Link>
              </li>
              <li>
                <Link href="/doctors" className="block py-2 pl-3 pr-4 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">doctors</Link>
              </li>
              <li className='block py-2 pl-3 pr-4 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent truncate'>
                {isVerified && address != '' ? 
                  <p>{address}</p> : 
                  <button onClick={connectWallet} className="">Connect</button>
                }
              </li>
            </ul>
          </div>
        </div>
      </nav>
      {correctNetwork ?
      <Component {...pageProps} address={address} isVerified={isVerified} signer={signer} provider={provider} correctNetwork={correctNetwork} />
      :
      <div className='text-center text-align-center'>
        <p>ウォレットに接続し、Goerliテストネットを選択してください。</p>
      </div>
      }
    </>
  )
}
