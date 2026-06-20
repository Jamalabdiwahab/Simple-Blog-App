import { useEffect } from "react";
import { refreshUser } from "../api/authApi";
import { useAuthStore } from "../store/authStore";

export const useRefreshToken = () => {
  const setAuth = useAuthStore((s) => s.setAuth);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const data = await refreshUser();

        setAuth({
          user: data.user,
          accessToken: data.accessToken,
        });
      } catch (err) {
        console.log("No active session");
      }
    };

    checkAuth();
  }, []);
};