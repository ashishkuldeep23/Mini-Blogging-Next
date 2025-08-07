// import Pusher from 'pusher';




import { NextRequest, NextResponse } from "next/server";
import { pusherServer } from '@/lib/pusherServer';


export async function POST(req: NextRequest) {

    try {
        const { socket_id, channel_name } = await req.json();

        const socketId = socket_id;
        const channel = channel_name;
        // This authenticates every user. Don't do this in production!
        const authResponse = pusherServer.authorizeChannel(socketId, channel);
        // res.send(authResponse);


        return NextResponse.json({ success: true, message: 'Event triggered.', authResponse }, { status: 200 })
    }
    catch (error: any) {

        console.log(error.message)
        return NextResponse.json({ success: false, message: `${error.message} (Server Error)` }, { status: 500 })
    }
}
