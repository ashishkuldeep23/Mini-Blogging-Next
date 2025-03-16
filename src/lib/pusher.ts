import {
  NEXT_PUBLIC_PUSHER_CLUSTER,
  NEXT_PUBLIC_PUSHER_KEY,
  PUSHER_APP_ID,
  PUSHER_CLUSTER,
  PUSHER_ENCRYPTED_KEY,
  PUSHER_KEY,
  PUSHER_SECRET,
} from "@/constant";
import Pusher from "pusher";

import PusherJs from "pusher-js";

// // Working pusher code ------------>
export const pusherServer = new Pusher({
  appId: PUSHER_APP_ID,
  key: PUSHER_KEY,
  secret: PUSHER_SECRET,
  cluster: PUSHER_CLUSTER,
  encryptionMasterKeyBase64: PUSHER_ENCRYPTED_KEY,
  useTLS: true,
});

// // Working pusher code ------------>
export const pusherClient = new PusherJs(NEXT_PUBLIC_PUSHER_KEY!, {
  cluster: NEXT_PUBLIC_PUSHER_CLUSTER!,
});
