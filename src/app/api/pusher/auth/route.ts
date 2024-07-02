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

        console.log(req)
        // console.log('JSON ++++++++++++++',req.json())




        // console.log('body ----------->', req.body)

        const body = await req.json();


        // console.log(144444444444444444)

        console.log('body ===========>', body)

        const { socketId, channelName } = body


        let auth = pusher.authorizeChannel(socketId, channelName)

        // return NextResponse.json({ success: true, message: 'Event triggered.', responce }, { status: 200 })


        return NextResponse.json(auth)

    }
    catch (error: any) {

        console.log(error.message)
        return NextResponse.json({ success: false, message: `${error.message} (Server Error)` }, { status: 500 })
    }
}
