import { useState, useEffect } from "react";
import { ParticleNetwork } from "@particle-network/auth";
import { ParticleProvider } from "@particle-network/provider";
import { BaseSepolia } from "@particle-network/chains";
import {
  AAWrapProvider,
  SmartAccount,
  SendTransactionMode,
} from "@particle-network/aa";
import { ethers } from "ethers";

import "./App.css";
import { Context } from "./hooks/useApp";
import Logo from "./components/Logo";
import Login from "./components/Login";
import Main from "./components/Main";

const config = {
  projectId: import.meta.env.VITE_PROJECT_ID,
  clientKey: import.meta.env.VITE_CLIENT_KEY,
  appId: import.meta.env.VITE_APP_ID,
};

const particle = new ParticleNetwork({
  ...config,
  chainName: BaseSepolia.name,
  chainId: BaseSepolia.id,
  wallet: { displayWalletEntry: true },
});

const smartAccount = new SmartAccount(new ParticleProvider(particle.auth), {
  ...config,
  aaOptions: {
    accountContracts: {
      BICONOMY: [{ chainIds: [BaseSepolia.id], version: "2.0.0" }],
    },
  },
});

const provider = new ethers.BrowserProvider(
  new AAWrapProvider(
    smartAccount,
    SendTransactionMode.Gasless
  ) as ethers.Eip1193Provider,
  "any"
);

particle.setERC4337({
  name: "BICONOMY",
  version: "2.0.0",
});

const App = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [balance, setBalance] = useState(null);
  const [sessionKey, setSessionKey] = useState(null);
  const [wallet, setWallet] = useState(null);

  const context = {
    particle: particle,
    smartAccount: smartAccount,
    provider: provider,

    userInfo: userInfo,
    setUserInfo: setUserInfo,

    balance: balance,
    setBalance: setBalance,

    sessionKey: sessionKey,
    setSessionKey: setSessionKey,

    wallet: wallet,
    setWallet: setWallet,
  };

  const fetchBalance = async () => {
    const address = await smartAccount.getAddress();
    const balance = await provider.getBalance(address);
    setBalance(ethers.formatEther(balance));
  };

  useEffect(() => {
    if (userInfo) {
      fetchBalance();
    }
  }, [userInfo]);

  return (
    <Context.Provider value={context}>
      <div className="App">
        <Logo />
        {!userInfo ? <Login /> : <Main />}
      </div>
    </Context.Provider>
  );
};

export default App;
