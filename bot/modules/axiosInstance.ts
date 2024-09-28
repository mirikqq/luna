import axios from "axios";
import { env } from "bun";

let token = "";

export const useAxios = axios.create({
  baseURL: env.SERVER_API,
});

useAxios.interceptors.response.use((response) => {
  token = response.headers["Set-Cookie"]?.findLast((el: string) => el.split(";")[0].split("=")[0] === "3x-ui");
  return response;
});

useAxios.interceptors.request.use((request) => {
  request.headers.Cookie = [token];
  return request;
});
