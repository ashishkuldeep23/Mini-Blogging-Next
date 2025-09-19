"use client";

import useOpenModalWithHTML from "@/Hooks/useOpenModalWithHtml";
import {
  fetchMsgsByConvoId,
  updateMsgPutReq,
  useChatData,
} from "@/redux/slices/ChatSlice";
import { AppDispatch } from "@/redux/store";
import { Message, TypeUpdateMsg } from "@/types/chat-types";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";
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
  const conversationId = params?.id;
  const session = useSession();
  const userId = session?.data?.user?._id;
  const currentConvo = useChatData()?.currentConvo;
  const msgsForConvoObj = useChatData().msgsForConvoObj;
  const typingUsers = useChatData().typingUsers;
  const isLoading = useChatData().isLoading;
  let page =
    typeof conversationId === "string"
      ? msgsForConvoObj[conversationId]?.page ?? 0
      : 0;
  let totalPages =
    typeof conversationId === "string"
      ? msgsForConvoObj[conversationId]?.totalPages ?? 10
      : 10;

  // console.log({ msgsForConvoObj });
  // const isLoading = useChatData()?.isLoading;
  // const [typingUsers, setTypingUsers] = useState<UserInSession[]>([]);
  // const setTypingUsers = (userArr: UserInSession[]) =>
  //   dispatch(setTypingUsersArr(userArr));

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

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

  // useEffect(() => {
  //   if (typeof conversationId === "string") {
  //     page = msgsForConvoObj[conversationId]?.page || 0;
  //     totalPages = msgsForConvoObj[conversationId]?.totalPages || 10;
  //   }
  // }, [conversationId]);

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

  const reactHandler = (
    message: Message,
    emoji: string,
    delReaction: boolean = false
  ) => {
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
  };

  return (
    <div
      id="message_list_div"
      className=" relative w-[98%] h-[85vh] flex flex-col overflow-y-auto overflow-x-hidden p-4 hide_scrollbar_totally pb-14 "
    >
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

      <div>
        {messages.length === 0 && !isLoading && (
          <div className={`pt-10`}>
            <p className=" text-gray-400 text-3xl mt-10 text-center">
              Say Hello!
            </p>
            <p className=" text-gray-400 text-xl text-center">
              (No messages found)
            </p>
          </div>
        )}
      </div>

      {messages.map((message, i) => (
        <SingleMsgDiv
          key={message._id}
          message={message}
          currentUserId={currentUserId}
          onReact={reactHandler}
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
          lastMsgUser={messages[i - 1]?.sender}
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
            <span className="flex space-x-1">
              <span className="w-2 h-2 bg-white rounded-full animate-bounce"></span>
              <span className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.2s]"></span>
              <span className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.4s]"></span>
            </span>
          </>
        )}
      </span>

      {/* Below Div is only used to scrool the screen below --------->> */}
      <div id="messages_end_ref" ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
