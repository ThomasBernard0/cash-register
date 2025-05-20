import api from "./api";

export const postLogin = async (
  username: string,
  password: string
): Promise<any> => {
  const res = await api.post(`/auth/login`, {
    username,
    password,
  });
  return res;
};
