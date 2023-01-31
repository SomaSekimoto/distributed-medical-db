import Head from 'next/head'
import { useEffect, useState } from "react"
import { BytesLike, Contract, Signer, ethers } from "ethers"
// import { abi } from '../abi/DistributedMedicalDatabase'
import { abi } from '../abi.json'
import { MedicalDatabase } from '../types/abi'
import Link from 'next/link'

// propsの型を定義する
type Props = {
  address?: string;
  isVerified?: boolean;
  signer?: Signer;
  provider: any;
  correctNetwork: boolean;
};

export default function Home(props: Props) {
  // const [isVerified, setIsVerified] = useState<boolean>(false)
  // const [address, setAddress] = useState<string>('')
  const [message, setMessage] = useState<string>('')
  // const [provider, setProvider] = useState<any>();
  // const [signer, setSigner] = useState<Signer>();
  const [contract, setContract] = useState<any>()

  // const connectWallet = async () =>{
  //   if (!(window as any).ethereum) {
  //     console.error('Please install Metamask!!')
  //     return
  //   }
  //   let signer: Signer;
  //   let provider: any;
  //   if(process.env.NEXT_PUBLIC_APP_ENV == 'production'){
  //     provider = new ethers.providers.Web3Provider((window as any).ethereum)
  //     await provider.send('eth_requestAccounts', [])
  //     signer = await provider.getSigner()
  //   } else {
  //     provider = ethers.getDefaultProvider(process.env.NEXT_PUBLIC_RPC_URL)
  //     // let privKey: BytesLike = ethers.utils.getAddress(process.env.NEXT_PUBLIC_PRV_KEY)
  //     let privKey: BytesLike = process.env.NEXT_PUBLIC_PRV_KEY.toString()
  //     signer = new ethers.Wallet(privKey, provider)
  //   }
  //   const message = 'connect your wallet to distributed medical database'
  //   let address = await signer.getAddress()
  //   setProvider(provider)
  //   setSigner(signer)
  //   setAddress(address)
  //   const signature = await signer.signMessage(message)
  //   const response = await fetch('/api/verify', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json; charset=UTF-8',
  //     },
  //     body: JSON.stringify({ message, address, signature }),
  //   })
  //   const body = await response.json()
  //   setIsVerified(body.isVerified)
  // }

  const registerPatient = async ()=>{
    let isVerified = props.isVerified
    let address = props.address
    let correctNetwork = props.correctNetwork
    let signer = props.signer
    console.log('calling connect contract');
    if(isVerified && correctNetwork){
      console.log('your address is ', address)
      const contract = new ethers.Contract(process.env.NEXT_PUBLIC_CONTRACT_ADDRESS, abi , signer)
      setContract(contract)
      console.log('contract address is', contract.address)
      try{
        const result = await contract.registerPatient(address, "soma", 2) as MedicalDatabase;
        console.log('result is', result)
        setMessage("register succeeded. address is "+ address)
      }catch(err: any){
        console.log("err", err)
        console.log("reason", err.reason)
      }
      
      const filter = contract.filters.PatientRegistered(address, null, null, null)
      contract.on(filter, (patient, name, bloodType, lastUpdated) => {
        console.log(patient, name, bloodType, lastUpdated.toString());
      });
    }else{
      console.error("you need to connect your wallet")
    }
  }
  // useEffect(() => {
  //   const provider = ethers.getDefaultProvider("http://localhost:8545")
  //   const signer = new ethers.Wallet(process.env.NEXT_PUBLIC_PRV_KEY, provider);
  //   const contract = new ethers.Contract(process.env.NEXT_PUBLIC_CONTRACT_ADDRESS, abi , signer)
  //   if(address != ''){
  //     console.log("useEffect fired")
  //     const filter = contract.filters.PatientRegistered(address, null, null, null)
  //     contract.on(filter, (patient, name, bloodType, lastUpdated) => {
  //       console.log(patient, name, bloodType, lastUpdated.toString());
  //     });
  //   }
  // }, [address, message])

  // const removePatient = async ()=>{
  //   console.log('calling connect contract');
  //   if(isVerified){
  //     console.log('your address is ',  address)
  //     // const provider = new ethers.providers.Web3Provider(window.ethereum)
  //     const provider = ethers.getDefaultProvider("http://localhost:8545")
  //     // const signer = await provider.getSigner()
  //     const signer = new ethers.Wallet(process.env.NEXT_PUBLIC_PRV_KEY, provider);
  //     const contract = new ethers.Contract(process.env.NEXT_PUBLIC_CONTRACT_ADDRESS, abi , signer)
  //     console.log('contract address is', contract.address)
  //     const result = await contract.removePatient(address, "soma", 2);
  //     console.log('result is', result)
  //     const filter = contract.filters.PatientRegistered(address, null, null, null)
  //     contract.on(filter, (patient, name, bloodType, lastUpdated) => {
  //       console.log(patient, name, bloodType, lastUpdated.toString());
  //   });
  //   }else{

  //   }
  // }

  return (
    <>
      <Head>
        <title>Ditributed Medical Database</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
        <div className="w-full max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700">
            <form className="space-y-6" action="#">
                <h5 className="text-xl font-medium text-gray-900 dark:text-white">Sign in to our platform</h5>
                <div>
                    <label for="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                    {/* <input type="email" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="name@company.com" required> */}
                </div>
                <div>
                    <label for="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your password</label>
                    {/* <input type="password" name="password" id="password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" required> */}
                </div>
                <div className="flex items-start">
                    <div className="flex items-start">
                        <div className="flex items-center h-5">
                            {/* <input id="remember" type="checkbox" value="" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800" required> */}
                        </div>
                        <label for="remember" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Remember me</label>
                    </div>
                    <a href="#" className="ml-auto text-sm text-blue-700 hover:underline dark:text-blue-500">Lost Password?</a>
                </div>
                <button type="submit" className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Login to your account</button>
                <div className="text-sm font-medium text-gray-500 dark:text-gray-300">
                    Not registered? <a href="#" className="text-blue-700 hover:underline dark:text-blue-500">Create account</a>
                </div>
            </form>
        </div>
        <div className='container text-center'>
                <div className='order-1'>
                  
                </div>
                <div className=''>
                  <button onClick={registerPatient}>registerPatient</button>
                  {/* <button onClick={removePatient}>removePatient</button> */}
                </div>
                <div>
                  {message != '' && <p>{message}</p>}
                </div>
          <h1 className="text-3xl font-bold underline">
            Hello world
          </h1>
        </div>
      </div>
    </>
  )
}
