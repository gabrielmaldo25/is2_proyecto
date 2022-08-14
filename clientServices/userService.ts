import axios from "axios";

export const userServiceFactory = () => {
  function login(email: string, password: string) {
    return axios.post(`/api/login`, { email, password });
  }

  function logout() {
    return axios.post(`/api/logout`);
  }

  return { login, logout };
};
