import { useApp } from "../hooks/useApp";
import CreateSession from "./CreateSession";
import Execute from "./Execute";
import Logout from "./Logout";

export default function Main() {
  const { userInfo, balance, sessionKey } = useApp();

  return (
    <div className="profile-card">
      <h2>{userInfo.name}</h2>
      <div className="balance-section">
        <small>{balance} Sepolia Base ETH</small>
        {sessionKey ? <Execute /> : <CreateSession />}
        <Logout />
      </div>
    </div>
  );
}
