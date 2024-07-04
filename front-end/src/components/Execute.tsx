import { notification } from "antd";
import { Interface, Wallet, getBytes } from "ethers";
import { useApp } from "../hooks/useApp";
import { SessionKey, UserOp } from "@particle-network/aa";

//  Modify this if you want to call another function
const iFace = new Interface(["function mint(address, uint256) external"]);

const genBytecode = (address: string): string => {
  return iFace.encodeFunctionData("mint", [
    address,
    (Math.random() * (10000000 - 1000 + 1)) << 0,
  ]);
};

export default function Execute() {
  const { wallet, smartAccount, sessionKey } = useApp();

  const executeUserOp = async () => {
    const walletNew = new Wallet(wallet.privateKey);
    const address = await smartAccount.getAddress();

    if (!sessionKey) return;

    const tx = {
      to: import.meta.env.VITE_DESTINATION_CONTRACT_ADDR as string,
      value: "0x0",
      data: genBytecode(address),
    };
    const feeQuote = await smartAccount.getFeeQuotes(tx);
    const signature = await walletNew.signMessage(
      getBytes(feeQuote.verifyingPaymasterGasless?.userOpHash as string)
    );
    const sessions = sessionKey.sessions as SessionKey[];

    const hash = await smartAccount.sendSignedUserOperation(
      {
        ...(feeQuote.verifyingPaymasterGasless?.userOp as UserOp),
        signature,
      },
      {
        targetSession: sessions[0]! as SessionKey,
        sessions: sessions,
      }
    );

    notification.success({
      message: hash,
    });
  };

  return (
    <button className="sign-message-button" onClick={executeUserOp}>
      Execute User Operation
    </button>
  );
}
