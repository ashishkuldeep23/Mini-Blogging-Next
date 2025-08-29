// import Pusher from 'pusher';

import { NextRequest, NextResponse } from "next/server";
import { pusherServer } from "@/lib/pusherServer";
import { getUserDataFromServer } from "../../getUserDataServer";
import User from "@/models/userModel";
import { connect } from "@/dbConfig/dbConfig";

export async function POST(req: NextRequest) {
  try {
    const bodyText = await req.text();

    // console.log({ bodyText });

    // Parse it as URLSearchParams
    const params = new URLSearchParams(bodyText);
    const socket_id = params.get("socket_id") || "";
    const channel_name = params.get("channel_name") || "";

    // console.log({ socket_id, channel_name });

    // let response = await pusherServer.trigger(`${channel_name}`, event, data);

    // console.log({ status: response });

    // // // Very imp code, we need to send auth return code to the clients ---------->>

    // // // check userToken here -------->>

    await connect();

    let userData = await getUserDataFromServer();

    // // // console.log(userData);

    if (userData) {
      // console.log(
      //   "Yes now we can do what we want for making user online or offline"
      // );

      await User.findByIdAndUpdate(
        userData._id,
        {
          isOnline: true,
          lastSeen: new Date(),
        },
        { new: true, upsert: true }
      );

      // console.log({ ashish });
    }

    const presenceData = {
      user_id: userData._id,
      user_info: {
        _id: userData._id,
        username: userData.username,
        email: userData.email,
        profilePic: userData.profilePic,
        isOnline: userData.isOnline,
        lastSeen: userData.lastSeen,
        friends: userData.friends,
      },
    };

    // This authenticates every user. Don't do this in production!
    const authResponse = pusherServer.authorizeChannel(
      socket_id,
      channel_name,
      presenceData
    );
    // res.send(authResponse);

    // console.log({ authResponse });

    return NextResponse.json(authResponse, { status: 200 });
    // return NextResponse.json(authResponse);
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
