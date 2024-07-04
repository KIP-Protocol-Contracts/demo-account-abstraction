import { LoginOptions } from "@particle-network/auth";

import { useApp } from "../hooks/useApp";

export default function Login() {
  const { particle, setUserInfo } = useApp();

  const handleLogin = async (
    preferredAuthType: LoginOptions["preferredAuthType"]
  ) => {
    const user = !particle.auth.isLogin()
      ? await particle.auth.login({ preferredAuthType })
      : particle.auth.getUserInfo();
    setUserInfo(user);
  };

  return (
    <div className="login-section">
      <button className="sign-button" onClick={() => handleLogin("google")}>
        Sign in with Google
      </button>
      <button className="sign-button" onClick={() => handleLogin("twitter")}>
        Sign in with Twitter
      </button>
    </div>
  );
}
