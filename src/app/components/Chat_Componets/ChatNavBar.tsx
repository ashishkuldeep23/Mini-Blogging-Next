"use client";

import { useChatData } from "@/redux/slices/ChatSlice";
import { useSession } from "next-auth/react";
import { useParams, usePathname, useRouter } from "next/navigation";
import React from "react";
import { TbArrowBackUpDouble } from "react-icons/tb";
import ImageReact from "../ImageReact";
import useOpenModalWithHTML from "@/Hooks/useOpenModalWithHtml";
import DmInfo from "./DmInfo";
import GroupInfo from "./GroupInfo";
import { TfiWorld } from "react-icons/tfi";
import Link from "next/link";
import { PiDotsThreeOutlineVertical } from "react-icons/pi";

const ChatNavBar = () => {
  const router = useRouter();
  const path = usePathname();
  const { data: session } = useSession();
  const username = session?.user.name;
  const ConvoName = useChatData().currentConvo?.name;
  const currentConvo = useChatData().currentConvo;
  const avatar = useChatData().currentConvo?.avatar;
  const params = useParams();
  const callModalFn = useOpenModalWithHTML();

  const nameClickHandler = () => {
    if (path === "/msgs") return;
    if (currentConvo?.type === "direct") {
      callModalFn({ innerHtml: <DmInfo /> });
    } else if (currentConvo?.type === "group") {
      callModalFn({ innerHtml: <GroupInfo /> });
    }
  };

  const generalChatClickHandler = () => {
    const innerHtml = (
      <div>
        <p className=" text-3xl text-center text-gray-400">
          I'm Public chat any one can chat here and test the chatting feature.
        </p>
      </div>
    );

    callModalFn({ innerHtml: innerHtml });
  };

  // console.log(currentConvo);

  const showMenuConvoCliked = () => {

    if(currentConvo?.type === "direct"){
      callModalFn({ innerHtml: <DmInfo /> });
    }else if(currentConvo?.type === "group"){
      callModalFn({ innerHtml: <GroupInfo /> });
    }

  };

  return (
    <div className=" bg-black sticky top-0 text-xl flex justify-start items-center gap-1 p-1  z-10 h-12 ">
      <button
        className=" rounded-md hover:bg-red-900 active:scale-90 transition-all "
        onClick={() => router.back()}
      >
        <TbArrowBackUpDouble />
      </button>
      <div
        onClick={() =>
          path !== "/general-msgs"
            ? nameClickHandler()
            : generalChatClickHandler()
        }
        className=" flex gap-2 justify-center items-center"
      >
        {path !== "/general-msgs" ? (
          path !== "/msgs" && (
            <span>
              <ImageReact
                src={avatar || ""}
                className=" w-8 h-8 rounded-full object-cover"
              />
            </span>
          )
        ) : (
          <span>
            <TfiWorld className=" w-5 h-5 active:scale-75 transition-all hover:bg-amber-500 rounded-md " />
          </span>
        )}
        <span className=" capitalize font-bold text-2xl  ">
          {path === "/msgs"
            ? username || "All Messages"
            : path === "/general-msgs"
            ? "Public Chatting Place"
            : ConvoName || "Direct Message"}
        </span>
      </div>

      <div className=" ml-auto mr-2 flex justify-center items-center gap-1">
        {path !== "/general-msgs" && (
          <Link href={"/general-msgs"}>
            <TfiWorld className=" w-5 h-5 active:scale-75 transition-all hover:bg-amber-500 rounded-md " />
          </Link>
        )}

        {params?.id && (
          <span onClick={showMenuConvoCliked}>
            <PiDotsThreeOutlineVertical className=" w-5 h-5 active:scale-75 transition-all hover:bg-blue-500 rounded-md hover:cursor-pointer " />
          </span>
        )}
      </div>
    </div>
  );
};

export default ChatNavBar;
