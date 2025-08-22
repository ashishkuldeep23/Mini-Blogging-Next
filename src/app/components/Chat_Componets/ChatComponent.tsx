"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { fetchConversationById, useChatData } from "@/redux/slices/ChatSlice";
import { useSession } from "next-auth/react";
import { AppDispatch } from "@/redux/store";
import { useDispatch } from "react-redux";
import { TypeUpdateMsg } from "../../../types/chat-types";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";

// Demo Component showing how to use both components
const ChatCompoMain: React.FC = () => {
  // const [messages, setMessages] = useState<Message[]>([]);

  const [updatingMsg, setUpdatingMsg] = useState<TypeUpdateMsg | null>(null);

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
      className={`sm:my-10 sm:rounded-md overflow-hidden flex flex-col items-center h-[95vh] sm:h-[85vh] max-w-4xl mx-auto  shadow-lg bg-gray-900 text-white relative`}
    >
      {/* <MainLoader isLoading={useChatData().isLoading} /> */}
      <MessageList
        messages={messages || []}
        currentUserId={currentUserId}
        setUpdatingMsg={setUpdatingMsg}
      />
      <MessageInput updatingMsg={updatingMsg} setUpdatingMsg={setUpdatingMsg} />
    </div>
  );
};

export default ChatCompoMain;
