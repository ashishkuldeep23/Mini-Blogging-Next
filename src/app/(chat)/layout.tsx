"use client";

import React, { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import ChatNavBar from "../components/Chat_Componets/ChatNavBar";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { pusherClient } from "@/lib/pusherClient";
import { Message } from "@/types/chat-types";
import {
  pushOneMoreMsg,
  setTypingUsersArr,
  setUpdatedMsg,
  useChatData,
} from "@/redux/slices/ChatSlice";
import { likeAnimationHandler } from "@/helper/likeAnimation";
import { UserInSession } from "@/types/Types";

const LayoutPage = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const session = useSession();
  const router = useRouter();
  const params = useParams();
  const conversationId = params?.id;
  const dispatch = useDispatch<AppDispatch>();
  const typingUsers = useChatData().typingUsers;
  const setTypingUsers = (userArr: UserInSession[]) =>
    dispatch(setTypingUsersArr(userArr));

  useEffect(() => {
    if (session.status === "unauthenticated") {
      router.push("/home");
    }
  }, []);

  const scrollToBottom = () => {
    let msgEndDiv = document.querySelector("#messages_end_ref");
    let msgListDiv = document.querySelector("#message_list_div");

    // if (msgEndDiv) {
    // msgListDiv && msgListDiv.scrollTo(0, msgListDiv.scrollHeight + 50);
    // }
    msgEndDiv && msgEndDiv.scrollIntoView({ behavior: "smooth" });
    msgListDiv && msgListDiv.scrollTo(0, msgListDiv.scrollHeight);

    // messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // // // All chat related Pusher code here --------->>
  // // //  Now we can bind the pusher code ----------->>
  // Subscribe to the conversation channel
  useEffect(() => {
    if (!conversationId || typeof conversationId !== "string") return;

    // Pusher.logToConsole = true; // Enable logging

    let channel = pusherClient.subscribe(
      `private-conversation-${conversationId}`
    );

    // // // data is going to be new message data --------->>
    channel.bind("new-message", (data: Message) => {
      // console.log({ data });
      // console.log(decryptMessage(data?.content));

      dispatch(pushOneMoreMsg(data as Message));
      // // // now here move the window for latest msg --------->>
      scrollToBottom();
    });

    // // // data is going to be new message data --------->>
    channel.bind("put-message", (data: Message) => {
      // console.log({ data });
      // console.log(decryptMessage(data?.content));

      dispatch(setUpdatedMsg(data as Message));
    });
    channel.bind("reacted-emoji", (data: any) => {
      // console.log({ data });
      // console.log(data?.divKey);

      let msgDiv = document.getElementById(
        `msg_${data?.divKey || "non"}`
      ) as HTMLDivElement;

      let x = `${window.innerWidth / 2 - 130}px`;
      let y = "30%";
      let emojiSize = "12rem";

      if (msgDiv) {
        x = `${msgDiv.getBoundingClientRect().left}px`;
        y = `${msgDiv.getBoundingClientRect().top - 20}px`;

        emojiSize = `3rem`;

        msgDiv.style.transform = "scale(1.2)";

        setTimeout(() => {
          msgDiv.style.transform = " scale(1) ";
        }, 1000);

        msgDiv.scrollIntoView({ behavior: "smooth" });
      }

      likeAnimationHandler(x, y, data?.reactedemoji, emojiSize, 1500);

      // console.log(data?.reactedemoji);
      // console.log(data?.reactedUser);

      // console.log(userId);
      // console.log(data?.reactedUser?._id);

      // if (userId !== data?.reactedUser?._id) {

      // toast(
      //   `${data?.reactedUser?.username} reacted with ${data?.reactedemoji}`
      // );

      // likeAnimationHandler(
      //   `${window.innerWidth / 2 - 130}px`,
      //   "30%",
      //   data?.reactedemoji,
      //   "12rem",
      //   1500
      // );
    });

    // // Old emoji recation code
    // channel.bind("reacted-emoji", (data: any) => {
    //   // console.log({ data });
    //   // console.log(data?.reactedemoji);
    //   // console.log(data?.reactedUser);

    //   // console.log(userId);
    //   // console.log(data?.reactedUser?._id);

    //   // if (userId !== data?.reactedUser?._id) {

    //   // toast(
    //   //   `${data?.reactedUser?.username} reacted with ${data?.reactedemoji}`
    //   // );

    //   setReactAnimation({
    //     emoji: data?.reactedemoji,
    //     top: "-50vh",
    //     scale: 4,
    //     show: true,
    //   });

    //   setTimeout(() => {
    //     setReactAnimation({ ...initialReactAnimation });
    //   }, 1000);
    // });

    // // // data is going to be new message data --------->>
    channel.bind("user-typing", (data: any) => {
      // dispatch(pushOneMoreMsg(data as Message));

      // console.log({ data });

      let usersArr = [...typingUsers];

      if (!usersArr.map((u) => u?._id).includes(data?.userData?._id)) {
        // if (data?.userData?._id !== userId) {
        usersArr.push(data?.userData as UserInSession);
        setTypingUsers(usersArr);
        // }

        setTimeout(() => {
          usersArr = usersArr.filter((u) => u?._id !== data?.userData?._id);
          setTypingUsers(usersArr);
        }, 1500);
      }
    });

    channel.bind("pusher:subscription_succeeded", () => {
      console.log("Subscription succeeded"); // Log subscription success
    });

    channel.bind("pusher:error", (status: any) => {
      console.error("Subscription error:", status); // Log subscription error
    });

    // pusherClient.connection.bind("connected", () => {
    //   const socketId = pusherClient.connection.socket_id;
    //   console.log("Socket ID:", socketId);
    // });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
      pusherClient.unsubscribe(`private-conversation-${conversationId}`);
    };
  }, [params?.id]);

  return (
    <div>
      {/* <Navbar /> */}
      <ChatNavBar />
      <div className=" w-full sm:w-[80%]  mx-auto">{children}</div>
    </div>
  );
};

export default LayoutPage;
