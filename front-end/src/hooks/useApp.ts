import { createContext, useContext } from "react";
import { FeeQuotesResponse, SmartAccount } from "@particle-network/aa";
import { ParticleNetwork, UserInfo } from "@particle-network/auth";
import { ethers } from "ethers";

export interface AppContext {
  particle: ParticleNetwork;
  smartAccount: SmartAccount;
  provider: ethers.BrowserProvider;

  userInfo: UserInfo;
  setUserInfo: React.Dispatch<React.SetStateAction<UserInfo>>;

  balance: string;
  setBalance: React.Dispatch<React.SetStateAction<string>>;

  sessionKey: FeeQuotesResponse;
  setSessionKey: React.Dispatch<React.SetStateAction<FeeQuotesResponse>>;

  wallet: ethers.HDNodeWallet;
  setWallet: React.Dispatch<React.SetStateAction<ethers.HDNodeWallet>>;
}

export const Context = createContext<AppContext | undefined>(undefined);

export function useApp() {
  const context = useContext(Context) as AppContext;

  return context;
}
