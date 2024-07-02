import Pusher from 'pusher';


let appId = process.env.PUSHER_APP_ID || ""
let key = process.env.PUSHER_KEY || ''
let secret = process.env.PUSHER_SECRET || ''
let cluster = process.env.PUSHER_CLUSTER || ''
let encryptedKey = process.env.PUSHER_ENCRYPTED_KEY || ''

const pusher = new Pusher({
    appId: appId,
    key: key,
    secret: secret,
    cluster: cluster,
    useTLS: true,
    // encryptionMasterKeyBase64: encryptedKey
});


import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest) {

    try {

        // console.log(req)
        // const requestHeaders = new Headers(req.headers);
        // const userName = requestHeaders.get('userName');
        // const userId = requestHeaders.get('userId');
        // console.log({ userName, userId })
        // console.log(requestHeaders.entries())


        const { event, data, channel } = await req.json();

        console.log({ event, data, channel })

        let responce = await pusher.trigger(`${channel}`, event, data);

        console.log(responce.status)
        // console.log(responce.body)
        // console.log(responce.status)


        return NextResponse.json({ success: true, message: 'Event triggered.', responce }, { status: 200 })

    }
    catch (error: any) {

        console.log(error.message)
        return NextResponse.json({ success: false, message: `${error.message} (Server Error)` }, { status: 500 })
    }
}
