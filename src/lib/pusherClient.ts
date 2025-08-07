import { NEXT_PUBLIC_PUSHER_CLUSTER, NEXT_PUBLIC_PUSHER_KEY } from "@/constant";

import PusherJs from "pusher-js";

// Function to get auth token (modify based on your auth system)
const getAuthToken = () => {
  if (typeof window !== "undefined") {
    return (
      localStorage.getItem("token") || sessionStorage.getItem("token") || ""
    );
  }
  return "";
};

// // Working pusher code ------------>
export const pusherClient = new PusherJs(NEXT_PUBLIC_PUSHER_KEY!, {
  cluster: NEXT_PUBLIC_PUSHER_CLUSTER!,
  authEndpoint: "/api/pusher/auth",
  auth: {
    headers: {
      authorization: `Bearer ${getAuthToken()}`,
    },
  },
});
