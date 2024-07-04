import { useApp } from "../hooks/useApp";

export default function Logout() {
  const { particle, setUserInfo } = useApp();

  const handleLogout = async () => {
    particle.auth.logout();
    setUserInfo(null);
  };

  return (
    <button className="disconnect-button" onClick={handleLogout}>
      Logout
    </button>
  );
}
