import { env } from "bun";
import { useAxios } from "../modules/axiosInstance";
import { login } from "./login";

type Subscription = "1month" | "3month" | "6month" | "12month";

export const createSubscription = async (subscriptionTime: Subscription, userId: string) => {
  const currentTimestamp = Date.now();

  const currentDate = new Date(currentTimestamp);

  switch (subscriptionTime) {
    case "1month":
      currentDate.setMonth(currentDate.getMonth() + 1);
      break;
    case "3month":
      currentDate.setMonth(currentDate.getMonth() + 3);
      break;
    case "6month":
      currentDate.setMonth(currentDate.getMonth() + 6);
      break;
    case "12month":
      currentDate.setMonth(currentDate.getMonth() + 12);
      break;
  }

  const newTimestamp = currentDate.getTime();

  const subData = {
    id: Number(env.CLIENTS_INBOUND_ID),
    settings: JSON.stringify({
      clients: [
        {
          id: userId,
          alterId: 0,
          email: userId,
          limitIp: 0,
          totalGB: 0,
          expiryTime: newTimestamp,
          enable: true,
          tgId: userId,
          subId: "",
        },
      ],
    }),
  };

  await login();
  return await useAxios("/panel/api/inbounds/addClient", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json; charset=utf-8",
    },
    data: subData,
  })
    .then((response) => response.data)
    .catch((error) => "");
};
