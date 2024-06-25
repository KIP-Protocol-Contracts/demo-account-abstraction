import React, { useState, useEffect } from 'react';
import { ParticleNetwork } from '@particle-network/auth';
import { ParticleProvider } from '@particle-network/provider';
import { BaseSepolia } from '@particle-network/chains';
import { AAWrapProvider, SmartAccount, SendTransactionMode } from '@particle-network/aa';
import { ethers, Wallet, Interface, getBytes } from 'ethers';
import { notification } from 'antd';

import './App.css';

const config = {
  projectId: "eef2db64-0aac-4c63-9f52-43c93fe03ea3",
  clientKey: "cv0K0IYX0X32iyfskcKybp5ONs6RdFBWvzvK4VVg",
  appId: "14a09680-6939-4c2d-a55e-5911e4896de0"
};

const particle = new ParticleNetwork({
  ...config,
  chainName: BaseSepolia.name,
  chainId: BaseSepolia.id,
  wallet: { displayWalletEntry: true }
});

const smartAccount = new SmartAccount(new ParticleProvider(particle.auth), {
  ...config,
  aaOptions: {
    accountContracts: {
    BICONOMY: [{ chainIds: [BaseSepolia.id], version: '2.0.0' }],
    }
  }
});

const customProvider = new ethers.BrowserProvider(new AAWrapProvider(smartAccount, SendTransactionMode.Gasless), "any");

particle.setERC4337({
  name: 'BICONOMY',
  version: '2.0.0'
});

const App = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [balance, setBalance] = useState(null);
  const [session, setSession] = useState(null);
  const [wallet, setWallet] = useState(null);

  useEffect(() => {
    if (userInfo) {
      fetchBalance();
    }
  }, [userInfo]);

  const fetchBalance = async () => {
    const address = await smartAccount.getAddress();
    const balance = await customProvider.getBalance(address);
    setBalance(ethers.formatEther(balance));
  };

  const handleLogin = async (preferredAuthType) => {
    const user = !particle.auth.isLogin() ? await particle.auth.login({preferredAuthType}) : particle.auth.getUserInfo();
    setUserInfo(user);
  }

  const handleLogout = async () => particle.auth.logout();

  const createSession = async () => {
    notification.info({
      message: "Creating session key..."
    });
    
    const signer = Wallet.createRandom();
    const address = await smartAccount.getAddress();
    const sessionKey = await smartAccount.createSessions([{
      validUntil: 0,
      validAfter: 0,
      sessionValidationModule: "0x8622DE43Ef5744835cd8891a45238E088510C107",
      sessionKeyDataInAbi: [
        ['address', 'address'],
        [
          signer.address,
          address,
        ],
      ],
    }])

    await smartAccount.sendTransaction({
      tx: sessionKey.transactions
    })

    setSession(sessionKey);
    setWallet(signer);

    notification.success({
      message: "Session key creation successful"
    });
  }

  const executeUserOp = async () => {
    const walletNew = new Wallet(wallet.privateKey);
    const address = await smartAccount.getAddress();

    // Change this to any call you want to list of KIP ecosystem contracts
    const mintInterface = new Interface(['function mint(address, uint256) external']);
    // Mint a token
    const encodedData = mintInterface.encodeFunctionData('mint', [address, (Math.random() * (10000000 - 1000 + 1) ) << 0]);

    const tx = {
      // Must be in the list of KIP ecosystem contracts
      to: "0xbB3aE74956834EFfb093eDD06F4422e74548281E",
      value: '0x0',
      data: encodedData,
    };

    const userOp = await smartAccount.buildUserOperation({tx})

    const signature = await walletNew.signMessage(getBytes(userOp.userOpHash));

    const hash = await smartAccount.sendSignedUserOperation(
      { ...userOp.userOp, signature },
      {
        targetSession: session.sessions[0],
        sessions: session.sessions,
      }
    )

    notification.success({
      message: hash
    });
  };

  return (
      <div className="App">
        <div className="logo-section">
          <img src="https://i.imgur.com/EerK7MS.png" alt="Logo 1" className="logo logo-big" />
        </div>
        {!userInfo ? (
          <div className="login-section">
            <button className="sign-button" onClick={() => handleLogin('google')}>Sign in with Google</button>
            <button className="sign-button" onClick={() => handleLogin('twitter')}>Sign in with Twitter</button>
          </div>
        ) : (
          <div className="profile-card">
            <h2>{userInfo.name}</h2>
            <div className="balance-section">
              <small>{balance} Sepolia Base ETH</small>
              {session ? 
                <button className="sign-message-button" onClick={executeUserOp}>Execute User Operation</button>
              : 
                <button className="create-session-key-button" onClick={createSession}>Create Session Key</button>
              }
              <button className="disconnect-button" onClick={handleLogout}>Logout</button>
            </div>
          </div>
        )}
      </div>
    );
  };


export default App;