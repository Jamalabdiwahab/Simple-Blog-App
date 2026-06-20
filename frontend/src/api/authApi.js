import { api } from "./axios";

export const registerUser = async (data) => {
  const res = await api.post("/auth/register", data);
  return res.data;
};

export const loginUser = async (data) => {
  const res = await api.post("/auth/login", data);
  return res.data;
};

export const refreshUser = async () => {
  const res = await api.get("/auth/refresh");
  return res.data;
};

export const logoutUser = async () => {
  const res = await api.post("/auth/logout");
  return res.data;
};
export const updateProfile = async (data) => {
  const res = await api.put("/auth/profile", data);
  return res.data;
};

export const updatePassword = async (data) => {
  const res = await api.put("/auth/password", data);
  return res.data;
};
export const updateProfilePic = async (file) => {
  const formData = new FormData();
  formData.append("profilePic", file);

  const res = await api.put("/auth/profile-pic", formData);
  return res.data;
};