import { ethers } from 'ethers';
import './App.css'
import {ABI, ARBUZ} from './abi';

function App() {

  const CUCUMBER = "0x97A4690Ab946994F48176D9DFF32F4ca4d15B561";
  const address = "0x473c4f14e832fe27Aef2ace4F13Ca2a9a56B21b0";
  const rpc = "https://polygon.meowrpc.com";


  const handleClick = async () => {
    console.log('click');
    const provider = await getTrustWalletInjectedProvider();

    try {
      const account = await provider.request({
        method: "eth_requestAccounts",
      });
    
      console.log(account); // => ['0x...']
    } catch (e) {
      if (e.code === 4001) {
        console.error("User denied connection.");
      }
    }
  }

  function getTrustWalletFromWindow() {
    const isTrustWallet = (ethereum?: IEthereum) => {
      // Identify if Trust Wallet injected provider is present.
      const trustWallet = !!ethereum?.isTrust;
  
      return trustWallet;
    };

    
  
    const injectedProviderExist =
      typeof window !== "undefined" && typeof window.ethereum !== "undefined";
    if (!injectedProviderExist) {
      return null;
    }

    if (isTrustWallet(window.ethereum)) {
      return window.ethereum;
    }

    if (window.ethereum?.providers)
      return window.ethereum.providers.find(isTrustWallet) ?? null;

    return window["trustwallet"] ?? null;
    
  }

  async function listenForTrustWalletInitialized(
    { timeout } = { timeout: 2000 }
  ) {
    return new Promise((resolve) => {
      const handleInitialization = () => {
        resolve(getTrustWalletFromWindow());
      };
  
      window.addEventListener("trustwallet#initialized", handleInitialization, {
        once: true,
      });

      setTimeout(() => {
        window.removeEventListener(
          "trustwallet#initialized",
          handleInitialization,
          { once: true }
        );
        resolve(null);
      }, timeout);
    });
  }

  async function getTrustWalletInjectedProvider(
    { timeout } = { timeout: 3000 }
  ) {
    const provider = getTrustWalletFromWindow();
  
    if (provider) {
      return provider;
    }
  
    return listenForTrustWalletInitialized({ timeout });
  }

  const ConnectCarContract = async () => {
    const provider = await getTrustWalletInjectedProvider();
    const ethersProvider = new ethers.BrowserProvider(provider);

    const signer = await ethersProvider.getSigner();

    const contract = new ethers.Contract(
      CUCUMBER,
      ARBUZ,
      signer
    );

    

    const carinfo = await contract.carinfo();
    console.log(carinfo);

    const info = await contract.Info(carinfo[0]);
    console.log(info)

    const chooseSpeed = await contract.chooseSpeed();
    console.log(chooseSpeed);

  }

  const getBalance = async () => {
    const provider = await getTrustWalletInjectedProvider();
    const ethersProvider = new ethers.BrowserProvider(provider);

    const signer = await ethersProvider.getSigner();

    const contract = new ethers.Contract(
      address,
      ABI,
      signer
    );
    
    const name = await contract.name();
    console.log(name);

    const balanceOf = await contract.balanceOf("0x9620a1380BA8C9B8022d911aa7b5b23e774d680f");
    console.log(balanceOf);

  }
  
  return (
    <>
      <button onClick={ConnectCarContract}>
        Connect Car Contract
      </button>

      <button onClick={getBalance}>
        Get Balance
      </button>

    </>
  )
}

export default App