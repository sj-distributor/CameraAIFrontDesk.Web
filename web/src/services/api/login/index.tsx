import { api } from "../../api";

export const Login = async (data: { userName: string; password: string }) => {
  const response = await api.post("/auth/login", data);

  return response.data;
};
