"use client";

import MessageInput from "@/app/components/Chat_Componets/MessageInput";
import MessageList from "@/app/components/Chat_Componets/MessageList";
import { fetchConversationById, useChatData } from "@/redux/slices/ChatSlice";
import { AppDispatch } from "@/redux/store";
import { Message, TypeUpdateMsg } from "@/types/chat-types";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

const ChatUI = () => {
  const [updatingMsg, setUpdatingMsg] = useState<TypeUpdateMsg | null>(null);

  const params = useParams();
  const convo = useChatData().currentConvo;
  const { data: session } = useSession();
  const dispatch = useDispatch<AppDispatch>();
  const currentUserId = session?.user?._id || "";
  const msgsForConvoObj = useChatData().msgsForConvoObj;

  // let messages: Message[] = [];

  // if (params?.id && typeof params?.id === "string") {
  //   messages = msgsForConvoObj[params?.id]?.msgs || [];
  // }

  // / // Call to fetch convarsation data from server -------->>
  useEffect(() => {
    if (
      params?.id &&
      typeof params?.id === "string" &&
      session?.user?._id &&
      // true
      convo?._id !== params?.id
    ) {
      console.log("Check i'm running or not -------->> ");

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
        messages={
          typeof params?.id === "string"
            ? msgsForConvoObj[params?.id]?.msgs || []
            : []
        }
        currentUserId={currentUserId}
        setUpdatingMsg={setUpdatingMsg}
      />
      <MessageInput updatingMsg={updatingMsg} setUpdatingMsg={setUpdatingMsg} />
    </div>
  );
};

export default ChatUI;
