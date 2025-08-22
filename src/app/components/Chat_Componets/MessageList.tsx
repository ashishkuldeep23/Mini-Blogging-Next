"use client";

import { likeAnimationHandler } from "@/helper/likeAnimation";
import useOpenModalWithHTML from "@/Hooks/useOpenModalWithHtml";
import { pusherClient } from "@/lib/pusherClient";
import {
  fetchMsgsByConvoId,
  pushOneMoreMsg,
  setUpdatedMsg,
  updateMsgPutReq,
  useChatData,
} from "@/redux/slices/ChatSlice";
import { AppDispatch } from "@/redux/store";
import { Message, TypeUpdateMsg } from "@/types/chat-types";
import { UserInSession } from "@/types/Types";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import SingleMsgDiv from "./MessageSingleDiv";
import ImageReact from "../ImageReact";

export interface MessageListProps {
  messages: Message[];
  currentUserId: string;
  setUpdatingMsg?: React.Dispatch<React.SetStateAction<TypeUpdateMsg | null>>;
}

// MessageList Component
const MessageList: React.FC<MessageListProps> = ({
  messages,
  currentUserId,
  setUpdatingMsg,
}) => {
  const illFetchNewMsgs = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch<AppDispatch>();
  const params = useParams();
  const session = useSession();
  const userId = session?.data?.user?._id;
  const currentConvo = useChatData()?.currentConvo;
  const [typingUsers, setTypingUsers] = useState<UserInSession[]>([]);
  const conversationId = params?.id;
  const msgsForConvoObj = useChatData().msgsForConvoObj;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

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
      // console.log(data?.reactedemoji);
      // console.log(data?.reactedUser);

      // console.log(userId);
      // console.log(data?.reactedUser?._id);

      // if (userId !== data?.reactedUser?._id) {

      // toast(
      //   `${data?.reactedUser?.username} reacted with ${data?.reactedemoji}`
      // );

      likeAnimationHandler(
        `${window.innerWidth / 2 - 30}px`,
        "30%",
        data?.reactedemoji,
        "6rem",
        1500
      );
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

    channel.bind("pusher:subscribe", () => {
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

  useEffect(() => {
    if (page === 1) {
      scrollToBottom();
    }
  }, [messages]);

  useEffect(() => {
    // if (page === 1) {
    scrollToBottom();
  }, []);

  const callModalFn = useOpenModalWithHTML();

  const actualDeleteMsghandlerFn = (message: Message) => {
    // // // Now call dispatch to delete the message --------->>

    const msgSenderId =
      typeof message.sender === "string" ? message.sender : message.sender?._id;

    if (!userId) return;

    const isUserAdminOfConvo = currentConvo?.admins
      ?.map((a) => a?._id)
      .includes(userId);

    let innerHtml = (
      <div className=" w-[50vh] mx-auto flex flex-col items-center justify-center">
        <div className=" flex justify-between items-center gap-2 flex-col">
          <button
            className=" border border-red-500 px-2 text-lg text-red-500 font-semibold hover:bg-red-500 hover:text-white rounded-lg hover:cursor-pointer transition-all active:scale-90"
            onClick={() => {
              dispatch(
                updateMsgPutReq({
                  isUpdating: true,
                  isDeletingForMe: true,
                  message: message,
                })
              );
            }}
          >
            Delete for Me
          </button>
          {(msgSenderId === userId || isUserAdminOfConvo) && (
            <button
              className=" border border-red-500 px-2 text-lg text-red-500 font-semibold hover:bg-red-500 hover:text-white rounded-lg hover:cursor-pointer transition-all active:scale-90"
              onClick={() => {
                dispatch(
                  updateMsgPutReq({
                    isUpdating: true,
                    isDeleting: true,
                    message: message,
                  })
                );
              }}
            >
              Delete for Everyone
            </button>
          )}
        </div>
      </div>
    );

    callModalFn({ innerHtml });
  };

  // const page = useChatData().msgPagination.page;
  // const totalPages = useChatData().msgPagination.totalPages;

  // const conversationId = params?.id;

  // const page =
  //   typeof conversationId === "string"
  //     ? useChatData()?.msgsForConvoObj[conversationId]?.page || 0
  //     : 0;
  // const totalPages =
  //   typeof conversationId === "string"
  //     ? useChatData()?.msgsForConvoObj[conversationId]?.totalPages || 10
  //     : 10;

  let page = 0;
  let totalPages = 10;
  if (typeof conversationId === "string") {
    page = msgsForConvoObj[conversationId]?.page || 0;
    totalPages = msgsForConvoObj[conversationId]?.totalPages || 10;
  }

  // console.log({ page, totalPages });

  // // // fetching via api ------------>>

  const fetchData = useCallback(() => {
    // console.log("Fuckkkkkkkkkkk");
    // console.log({ page });

    const conversationId = params?.id;
    if (conversationId && typeof conversationId === "string") {
      dispatch(fetchMsgsByConvoId({ conversationId, page: `${page + 1}` }));
      // console.log("Now call server to laod the msgs with pagination");
    }

    // // // now here move the window for latest msg --------->>
    // page === 0 && scrollToBottom();
  }, [page, params]);

  useEffect(() => {
    const target = illFetchNewMsgs.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            fetchData();

            // obs.unobserve(entry.target); // remove if you want only once
          }
        });
      },
      { threshold: 0.5 } // 50% of div visible
    );

    observer.observe(target);

    // cleanup
    return () => {
      if (target) observer.unobserve(target);
    };
  }, [page]);

  return (
    <div className=" relative w-[98%] h-[85vh] flex flex-col overflow-y-auto overflow-x-hidden p-4 hide_scrollbar_totally ">
      {page < totalPages && (
        <div
          className=" flex justify-center items-center gap-1 my-2 relative z-10"
          ref={illFetchNewMsgs}
        >
          {/* <span className="animate-spin h-5 w-5 border-b-4 border-sky-500 rounded-full"></span> */}
          <span className=" animate-pulse font-bold ">Getting...</span>
        </div>
      )}

      {/* <button >Scroll</button> */}

      {messages.map((message) => (
        <SingleMsgDiv
          key={message._id}
          message={message}
          currentUserId={currentUserId}
          onReact={(message, emoji, delReaction = false) => {
            // // // Now call dispatch to React the message --------->>

            userId &&
              dispatch(
                updateMsgPutReq({
                  isUpdating: true,
                  reaction: {
                    emoji: emoji,
                    user: userId,
                  },
                  delReaction,
                  message: message,
                })
              );
          }}
          onEdit={(message) => {
            setUpdatingMsg &&
              setUpdatingMsg((prev) => ({
                // ...prev,
                isUpdating: true,
                isEditted: true,
                message: message,
                text: message.content,
              }));
          }}
          onReply={(message) => {
            setUpdatingMsg &&
              setUpdatingMsg((prev) => ({
                // ...prev,
                message: message,
                text: message.content,
                replyTo: message._id,
                isReplyed: true,
                isUpdating: true,
              }));
          }}
          onDel={(message) => {
            actualDeleteMsghandlerFn(message);
          }}
        />
      ))}

      {/* typing indicator */}
      <span className=" rounded bg-gray-900  sticky -bottom-2 left-0 flex gap-1 items-center">
        {typingUsers.filter((user) => user._id !== currentUserId).length >
          0 && (
          <>
            {typingUsers
              .filter((user) => user._id !== currentUserId)
              .map((user, i) => {
                return (
                  <span key={i}>
                    <ImageReact
                      src={user.image}
                      className=" w-5 h-5 rounded-full object-cover"
                    />
                  </span>
                );
              })}
            <span>Typing...</span>
          </>
        )}
      </span>

      {/* Below Div is only used to scrool the screen below --------->> */}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
