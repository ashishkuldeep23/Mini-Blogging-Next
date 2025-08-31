"use client";

import { pusherClient } from "@/lib/pusherClient";
import { setOnlineUsers, useChatData } from "@/redux/slices/ChatSlice";
import { useUserState } from "@/redux/slices/UserSlice";
import { Chat_User } from "@/types/chat-types";
import { useSession } from "next-auth/react";
import Pusher from "pusher-js";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

// import React from "react";

const PusherInitEvents = () => {
  // const session = useSession();
  const dispatch = useDispatch();
  const onlineUsers = useChatData().onlineUsers;
  const userId = useUserState().userData._id;

  // // // Imp Pusher calls here ----------->>
  //   console.log(onlineUsers);

  // // // Online People related pusher events and their handlers ----------->>
  useEffect(() => {
    // console.log("Yes i'm working goos.");

    // console.log(pusherClient);

    // if (!pusherClient) return;
    // Pusher.logToConsole = true; // Enable logging

    // const pusher = getPusherClient();
    const userOnlinechannel = pusherClient.subscribe("presence-users");

    userOnlinechannel.bind("pusher:subscription_succeeded", (data: any) => {
      // setOnlineUsers(members.members);
      //   console.log({ data });
      //   console.log(data.members);

      let obj = { ...data.members };
      dispatch(setOnlineUsers(obj));

      //   console.log("Yessss1000");
    });

    userOnlinechannel.bind("pusher:member_added", (data: any) => {
      // setOnlineUsers((prev) => ({ ...prev, [member.id]: member.info }));
      //   console.log(data);

      let obj = { ...onlineUsers, [data.id]: data.info };
      dispatch(setOnlineUsers(obj));

      //   console.log("Yessss2");
    });

    userOnlinechannel.bind("pusher:member_removed", (data: any) => {
      // setOnlineUsers((prev) => {
      const obj = { ...onlineUsers };
      delete obj[data.id];
      dispatch(setOnlineUsers(obj));
      // });

      //   console.log({ data });
      //   console.log("Yessss3");
    });

    userOnlinechannel.bind("pusher:subscription_error", (err: any) => {
      // setOnlineUsers(members.members);

      console.log("Error", err);
    });

    return () => {
      userOnlinechannel.unbind_all();
      pusherClient.unsubscribe("presence-users");
    };
  }, [userId]);

  // // // Pusher events for user like convoList update and Notifications update (In App Events) ----------->>

  return <div></div>;
};

export default PusherInitEvents;
