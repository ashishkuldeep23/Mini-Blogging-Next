"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, User } from "lucide-react";
import { useParams } from "next/navigation";
import {
  fetchConversationById,
  fetchMsgsByConvoId,
  pushOneMoreMsg,
  sendMsgPostCall,
  useChatData,
} from "@/redux/slices/ChatSlice";
import { useSession } from "next-auth/react";
import { AppDispatch } from "@/redux/store";
import { useDispatch } from "react-redux";
import { Message, TypeSendMsg } from "../../../../types/chat-types";
import toast from "react-hot-toast";
import ImageReact from "../ImageReact";
import { pusherClient } from "@/lib/pusherClient";
import { decryptMessage } from "@/lib/Crypto-JS";
import { sendMsgViaPusher } from "@/lib/sendMsgViaPusher";
import Pusher from "pusher-js";

interface MessageListProps {
  messages: Message[];
  currentUserId: string;
}

// MessageList Component
const MessageList: React.FC<MessageListProps> = ({
  messages,
  currentUserId,
}) => {
  const illFetchNewMsgs = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch<AppDispatch>();
  const params = useParams();
  const session = useSession();

  const userId = session?.data?.user?._id;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const formatTime = (timestamp: Date) => {
    // console.log(timestamp);
    if (typeof timestamp === "string") {
      timestamp = new Date(timestamp);
    }
    return new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(timestamp);
  };
  // console.log(params.id);

  useEffect(() => {
    const conversationId = params?.id;
    if (conversationId && typeof conversationId === "string") {
      dispatch(fetchMsgsByConvoId({ conversationId }));
      // console.log("Now call server to laod the msgs with pagination");
    }
  }, [params?.id]);

  // // //  new we can bind the pusher code ----------->>
  // Subscribe to the conversation channel
  useEffect(() => {
    const conversationId = params?.id;

    if (!conversationId || typeof conversationId !== "string") return;

    // Pusher.logToConsole = true; // Enable logging

    let channel = pusherClient.subscribe(
      `private-conversation-${conversationId}`
    );

    channel.bind("new-message", (data: any) => {
      // setMessages((prev) => [...prev, data]);
      // console.log(data);

      // // // Now add msg in state and also decrypt that ------>>

      let whoSendMsg = data?.sender?._id;

      if (whoSendMsg.toString() !== currentUserId.toString()) {
        dispatch(pushOneMoreMsg(data as Message));
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
    scrollToBottom();
  }, [messages]);

  return (
    <div className=" h-[85vh] flex flex-col overflow-y-auto p-4 space-y-4 hide_scrollbar_totally ">
      <div ref={illFetchNewMsgs} />

      {messages.map((message) => {
        const isCurrentUser = message.sender._id === currentUserId;
        // const isBot = message.type === "bot";
        const isElsePerson = message.sender._id !== currentUserId;
        // const isSystem = message.type === "system";
        return (
          <div
            key={message._id}
            className={` mt-auto  flex ${
              isCurrentUser ? "justify-end" : "justify-start"
            } items-start space-x-2`}
          >
            {!isCurrentUser && (
              <div className="flex-shrink-0">
                <div
                  className={` rotate-45  mt-1 w-8 h-8 rounded-full rounded-tr-[3rem] flex items-center justify-center ${
                    isElsePerson ? "bg-sky-600 -mr-0.5 " : "bg-gray-400"
                  }`}
                >
                  {isElsePerson ? (
                    <ImageReact
                      src={message?.sender?.profilePic || ""}
                      className=" -rotate-45 w-7 h-7 rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-4 h-4 text-white" />
                  )}
                </div>
              </div>
            )}

            <div
              className={`max-w-xs lg:max-w-xl px-4 py-2 rounded-lg ${
                isCurrentUser
                  ? "bg-sky-600 text-white"
                  : "bg-black border border-sky-500 "
              }`}
            >
              <div className="break-words">
                {decryptMessage(message.content)}
              </div>
              <div
                className={`text-xs mt-1 ${
                  isCurrentUser ? "text-blue-100" : "text-gray-500"
                }`}
              >
                {formatTime(message?.createdAt)}
              </div>
            </div>
          </div>
        );
      })}

      {/* Below Div is only used to scrool the screen below --------->> */}
      <div ref={messagesEndRef} />
    </div>
  );
};

interface MessageInputProps {
  // onSendMessage: (content: string) => void;
}
// MessageInput Component
const MessageInput: React.FC<MessageInputProps> = () => {
  const [message, setMessage] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const { data: session } = useSession();
  const userId = session?.user?._id;
  const convoId = useChatData().currentConvo?._id;
  const dispatch = useDispatch<AppDispatch>();

  const handleSubmit = () => {
    let sendMsg = message.trim();

    if (!sendMsg) {
      toast.error("Message can't be empty");
      return;
    }
    if (!userId) {
      toast.error("User not found");
      return;
    }
    if (!convoId) {
      toast.error("Conversation not found");
      return;
    }

    if (sendMsg && convoId && userId) {
      // onSendMessage(message.trim());

      let makeBodyData: TypeSendMsg = {
        conversationId: convoId,
        sender: userId,
        content: sendMsg,
        messageType: "text",
      };

      dispatch(sendMsgPostCall(makeBodyData));

      // // // now here we can call pusher fn ---------->>
      // sendMsgViaPusher({
      //   event: "new-message",
      //   channelName: `private-conversation-${convoId}`,
      //   bodyData: makeBodyData,
      // });

      setMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleChangeFn = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  return (
    <div className="border-t border-sky-600  p-4">
      <div className="flex space-x-3">
        <div className="flex-1 relative">
          <input
            ref={inputRef}
            type="text"
            value={message}
            onChange={handleChangeFn}
            onKeyDown={handleKeyPress}
            placeholder="Type your message..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 bg-inherit"
          />
        </div>
        <button
          onClick={handleSubmit}
          disabled={!message.trim()}
          className="bg-sky-600 hover:bg-blue-600 disabled:bg-sky-300 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg transition-colors duration-200 flex items-center justify-center"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

// Demo Component showing how to use both components
const ChatDemoUI: React.FC = () => {
  // const [messages, setMessages] = useState<Message[]>([]);

  const messages = useChatData().allMessagesOfThisConvo;
  // const messagesEndRef = useRef<HTMLDivElement>(null);

  const params = useParams();
  const convo = useChatData().currentConvo;
  const { data: session } = useSession();
  const dispatch = useDispatch<AppDispatch>();
  const currentUserId = session?.user?._id || "";

  // / // Call to fetch convarsation data from server -------->>
  useEffect(() => {
    if (
      params?.id &&
      typeof params?.id === "string" &&
      session?.user?._id &&
      // true
      convo?._id !== params?.id
    ) {
      // // // Call to fetch convo data from server -------->>

      dispatch(
        fetchConversationById({ id: params?.id, userId: session?.user._id })
      );
    }
  }, [params?.id, session?.user?._id]);

  return (
    <div
      className={`sm:my-10 sm:rounded-md overflow-hidden flex flex-col h-[95vh] sm:h-[85vh] max-w-4xl mx-auto  shadow-lg bg-gray-900 text-white`}
    >
      <MessageList messages={messages || []} currentUserId={currentUserId} />
      <MessageInput />
    </div>
  );
};

export default ChatDemoUI;
