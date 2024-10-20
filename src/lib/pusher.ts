import Pusher from 'pusher';

import PusherJs from "pusher-js";

let appId = process.env.PUSHER_APP_ID || ""
let key = process.env.PUSHER_KEY || ''
let secret = process.env.PUSHER_SECRET || ''
let cluster = process.env.PUSHER_CLUSTER || ''
let encryptedKey = process.env.PUSHER_ENCRYPTED_KEY || '8qdCNaqitxRS9mNIBgQGw3vDbCKEp0GvWtXnx+up3cU='

export const pusherServer = new Pusher({
    appId: appId,
    key: key,
    secret: secret,
    cluster: cluster,
    useTLS: true,
    encryptionMasterKeyBase64: encryptedKey
});



// // Working pusher code ------------>
export const pusherClient = new PusherJs(
    process.env.NEXT_PUBLIC_PUSHER_KEY!,
    {
        cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!
    }
)

