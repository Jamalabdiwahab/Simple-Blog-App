import { useMutation } from "@tanstack/react-query";
import {
  registerUser,
  loginUser,
  logoutUser,
} from "../api/authApi";

import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";

export const useRegister = () => {
  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: registerUser,

    onSuccess: (data) => {
      toast.success("Registered successfully.");
      setAuth({
        user: data.user,
        accessToken: data.newAccessToken,
      });

      navigate("/dashboard");
    }
  });
};

export const useLogin = () => {
  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: loginUser,

    onSuccess: (data) => {
      toast.success("Welcome back!");
      setAuth({
        user: data.user,
        accessToken: data.newAccessToken,
      });
      navigate("/dashboard");

    },
  });
};

export const useLogout = () => {
  const logoutStore = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: logoutUser,

    onSuccess: () => {
      logoutStore();

      navigate("/login", {
        replace: true,
      });

      toast.success("Logged out successfully");
    },
  });
};