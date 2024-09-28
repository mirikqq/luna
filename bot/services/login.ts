import { env } from "bun";
import { useAxios } from "../modules/axiosInstance";

export const login = async () => {
  return useAxios("/login", {
    method: "POST",
    headers: {
      Accept: "application/json",
    },
    data: `username=${env.PANEL_LOGIN}&password=${env.PANEL_PASSWORD}`,
  }).then((response) => response.data);
};
