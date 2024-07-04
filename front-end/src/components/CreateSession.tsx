/* eslint-disable @typescript-eslint/no-explicit-any */
import { notification } from "antd";
import { Wallet } from "ethers";
import { useApp } from "../hooks/useApp";
import { Transaction } from "ethers";
import { FeeQuotesResponse, UserOp } from "@particle-network/aa";

export default function CreateSession() {
  const { smartAccount, setSessionKey, setWallet } = useApp();

  const createSession = async () => {
    notification.info({
      message: "Creating session key...",
    });

    const signer = Wallet.createRandom();
    const address = await smartAccount.getAddress();
    const sessionKey = await smartAccount.createSessions([
      {
        validUntil: 0,
        validAfter: 0,
        sessionValidationModule: import.meta.env
          .VITE_SESSION_VALIDATION_CONTRACT_ADDR as string,
        sessionKeyDataInAbi: [
          ["address", "address"],
          [signer.address, address],
        ],
      },
    ]);
    const feeQuote: FeeQuotesResponse = await smartAccount.getFeeQuotes(
      sessionKey.transactions as any
    );

    await smartAccount.sendTransaction({
      userOp: feeQuote.verifyingPaymasterGasless?.userOp as UserOp,
      userOpHash: feeQuote.verifyingPaymasterGasless?.userOpHash as string,
    });

    setSessionKey(sessionKey);
    setWallet(signer);

    notification.success({
      message: "Session key creation successful",
    });
  };

  return (
    <button className="create-session-key-button" onClick={createSession}>
      Create Session Key
    </button>
  );
}
