import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const OAuthSuccess = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const userParam = params.get("user");

    if (!userParam) {
      navigate("/login", { replace: true });
      return;
    }

    try {
      const user = JSON.parse(decodeURIComponent(userParam));

      // ✅ update context + storage together
      login(user);

      // ✅ delay guarantees router + state sync
      setTimeout(() => {
        navigate("/settings", { replace: true });
      }, 0);

    } catch (err) {
      console.error("Invalid user data", err);
      navigate("/login", { replace: true });
    }
  }, [login, navigate]);

  return <p>Signing you in...</p>;
};

export default OAuthSuccess;
