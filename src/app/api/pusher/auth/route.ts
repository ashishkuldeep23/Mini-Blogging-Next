// import Pusher from 'pusher';

import { NextRequest, NextResponse } from "next/server";
import { pusherServer } from "@/lib/pusherServer";

export async function POST(req: NextRequest) {
  try {
    const bodyText = await req.text();

    // console.log({ bodyText });

    // Parse it as URLSearchParams
    const params = new URLSearchParams(bodyText);
    const socket_id = params.get("socket_id") || "";
    const channel_name = params.get("channel_name") || "";

    // console.log({ socket_id, channel_name, event, data, email });

    // This authenticates every user. Don't do this in production!
    const authResponse = pusherServer.authorizeChannel(socket_id, channel_name);
    // res.send(authResponse);

    console.log(authResponse);

    // let response = await pusherServer.trigger(`${channel_name}`, event, data);

    // console.log({ status: response });

    // // // Very imp code, we need to send auth return code to the clients ---------->>
    return NextResponse.json(authResponse, { status: 200 });
    // return NextResponse.json(
    //   { success: true, message: "Event triggered." },
    //   { status: 200 }
    // );
  } catch (error: any) {
    console.log(error.message);
    return NextResponse.json(
      { success: false, message: `${error.message} (Server Error)` },
      { status: 500 }
    );
  }
}
