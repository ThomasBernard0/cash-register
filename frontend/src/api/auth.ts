import api from "./api";

export const postLogin = async (
  name: string,
  password: string
): Promise<any> => {
  const res = await api.post(`/auth/login`, {
    name,
    password,
  });
  return res;
};
