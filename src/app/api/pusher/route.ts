
import { NextRequest, NextResponse } from "next/server";
import { pusherServer } from '@/lib/pusher';


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

        let responce = await pusherServer.trigger(`${channel}`, event, data);

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
