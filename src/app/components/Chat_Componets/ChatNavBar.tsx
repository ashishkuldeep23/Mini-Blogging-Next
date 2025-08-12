"use client";

import { useChatData } from "@/redux/slices/ChatSlice";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { TbArrowBackUpDouble } from "react-icons/tb";
import ImageReact from "../ImageReact";

const ChatNavBar = () => {
  const router = useRouter();
  const path = usePathname();
  const { data: session } = useSession();
  const username = session?.user.name;
  const ConvoName = useChatData().currentConvo?.name;
  const avatar = useChatData().currentConvo?.avatar;

  return (
    <div className=" bg-black sticky top-0 h-8 text-xl flex justify-start items-center gap-1 p-1">
      <button
        className=" rounded-md hover:bg-red-900 active:scale-90 transition-all "
        onClick={() => router.back()}
      >
        <TbArrowBackUpDouble />
      </button>
      {path !== "/msgs" && (
        <ImageReact src={avatar || ""} className=" w-6 h-6 rounded-full" />
      )}
      <div className=" capitalize ">
        {path === "/msgs" ? username || "Message" : ConvoName || "Message"}
      </div>
      <div className=" ml-auto mr-4">icon</div>
    </div>
  );
};

export default ChatNavBar;
