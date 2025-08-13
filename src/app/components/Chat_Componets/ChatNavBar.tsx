"use client";

import { useChatData } from "@/redux/slices/ChatSlice";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { TbArrowBackUpDouble } from "react-icons/tb";
import ImageReact from "../ImageReact";
import useOpenModalWithHTML from "@/Hooks/useOpenModalWithHtml";
import DmInfo from "./DmInfo";
import GroupInfo from "./GroupInfo";

const ChatNavBar = () => {
  const router = useRouter();
  const path = usePathname();
  const { data: session } = useSession();
  const username = session?.user.name;
  const ConvoName = useChatData().currentConvo?.name;
  const currentConvo = useChatData().currentConvo;
  const avatar = useChatData().currentConvo?.avatar;

  const callModalFn = useOpenModalWithHTML();

  const nameClickHandler = () => {
    if (path === "/msgs") return;
    if (currentConvo?.type === "direct") {
      callModalFn({ innerHtml: <DmInfo /> });
    } else if (currentConvo?.type === "group") {
      callModalFn({ innerHtml: <GroupInfo /> });
    }
  };

  return (
    <div className=" bg-black sticky top-0 h-8 text-xl flex justify-start items-center gap-1 p-1 z-10 ">
      <button
        className=" rounded-md hover:bg-red-900 active:scale-90 transition-all "
        onClick={() => router.back()}
      >
        <TbArrowBackUpDouble />
      </button>
      <span
        onClick={() => nameClickHandler()}
        className=" flex gap-1 justify-center items-center"
      >
        {path !== "/msgs" && (
          <ImageReact
            src={avatar || ""}
            className=" w-6 h-6 rounded-full object-cover"
          />
        )}
        <div className=" capitalize ">
          {path === "/msgs" ? username || "Message" : ConvoName || "Message"}
        </div>
      </span>
      <div className=" ml-auto mr-4">icon</div>
    </div>
  );
};

export default ChatNavBar;
