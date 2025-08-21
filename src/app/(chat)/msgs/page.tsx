"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Chat_User, Conversation } from "../../../types/chat-types";
import { FaPencil } from "react-icons/fa6";
import ImageReact from "@/app/components/ImageReact";
import {
  CreateConversations,
  fetchAllConversations,
  setCurrentConvo,
  useChatData,
} from "@/redux/slices/ChatSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import MainLoader from "@/app/components/LoaderUi";

import { TfiWorld } from "react-icons/tfi";
import NewChatDiv from "@/app/components/Chat_Componets/NewChatDiv";
import { decryptMessage } from "@/lib/Crypto-JS";

export default function MessagePage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const isLoading = useChatData().isLoading;
  const allConversations = useChatData().allConversations;
  const startConvo = useChatData().startConvo;
  const errMsg = useChatData().errMsg;

  const EmptyChats =
    !isLoading && allConversations.length === 0 && startConvo.length === 0;

  const [newChatDiv, setNewChatDiv] = useState(false);

  // const friendsAllFriend = useUserState().userData.friendsAllFriend;

  const generalClickHandler = () => {
    router.push("/general-msgs");
  };

  useEffect(() => {
    dispatch(fetchAllConversations());
  }, []);

  const onClickHandlerOfStartConvo = (friend: Chat_User) => {
    dispatch(
      CreateConversations({
        friendUserId: friend._id,
        successFn: (id) => {
          router.push(`/msgs/${id}`);
        },
      })
    );
  };

  const convoClickHandler = (convo: Conversation) => {
    dispatch(setCurrentConvo(convo));
    router.push(`/msgs/${convo._id}`);
  };

  const newChatClickHandler = () => {
    setNewChatDiv(!newChatDiv);
  };

  return (
    <div className=" min-h-[100vh] bg-black flex flex-col items-center relative">
      <MainLoader isLoading={isLoading} />

      {/* New Chat Div */}
      <NewChatDiv
        newChatDiv={newChatDiv}
        newChatClickHandler={newChatClickHandler}
      />

      <div
        className={` my-1 border-2 border-green-500 text-green-500 h-10 rounded w-full flex justify-center items-center md:w-[70%] lg:w-[60%] ${
          isLoading && " opacity-50"
        } ${EmptyChats && "hidden"}  `}
      >
        <p>Search Input here</p>
      </div>

      <div
        className={`my-1 border-2 border-yellow-500  h-24 rounded  flex justify-start px-2 items-center w-[98vw] sm:w-[97%] md:w-[70%] lg:w-[60%] overflow-hidden ${
          isLoading && " opacity-50"
        } ${EmptyChats && "hidden"} `}
      >
        <div
          onClick={generalClickHandler}
          className=" border-2  min-w-20 h-20 rounded-full overflow-hidden  flex flex-col  justify-end items-center p-1 m-0 active:scale-75 hover:bg-red-700 hover:cursor-pointer transition-all "
        >
          <TfiWorld className=" h-14 w-14 " />
          <p className=" text-[0.5rem] w-[80%] text-center  leading-[0.6rem] ">
            Chat with World
          </p>
        </div>

        <div className=" scrooller_bar_small pl-1.5 gap-1  h-full flex  justify-start items-center overflow-y-auto">
          {Array(5)
            .fill(null)
            .map((_, i) => {
              return (
                <div
                  key={i}
                  className=" border-2  min-w-20 h-20 rounded-full overflow-hidden  flex flex-col  justify-end items-center p-1 m-0 active:scale-75 hover:bg-red-700 hover:cursor-pointer transition-all "
                >
                  <span className=" relative">
                    <TfiWorld className=" h-14 w-14 " />
                    <span className=" h-2 w-2 rounded-full bg-green-500 absolute bottom-0 right-0 "></span>
                  </span>
                  <p className=" text-[0.5rem] w-[80%] text-center  leading-[0.6rem] ">
                    Name
                  </p>
                </div>
              );
            })}
        </div>
      </div>

      {EmptyChats ? (
        <div className=" my-5  min-h-[40vh] rounded w-full flex flex-col justify-center items-center overflow-hidden px-1 md:w-[70%] lg:w-[60%] ">
          <p className=" text-2xl w-[60%]  text-center opacity-55 font-semibold ">
            You haven't started a conversation with anyone yet.
          </p>
          {errMsg && (
            <p className="text-2xl w-[60%]  text-center opacity-55 font-semibold  text-red-500">
              Error : {errMsg}
            </p>
          )}
        </div>
      ) : (
        <></>
      )}

      {allConversations.length === 0 && isLoading ? (
        <div className=" my-5 text-yellow-500  rounded w-full flex flex-col justify-center items-center overflow-hidden px-1 md:w-[70%] lg:w-[60%] ">
          {Array(12)
            .fill(null)
            .map((_, i) => {
              return (
                <span
                  key={i}
                  className=" block w-full "
                  // href={`/msgs/${i + 1}`}
                >
                  <div className=" my-1 bg-teal-900 text-white h-16 rounded w-full flex  justify-center items-center ">
                    {/* <p>All msgs here {i + 1}</p> */}
                  </div>
                </span>
              );
            })}
        </div>
      ) : (
        <div className=" my-5   rounded w-full flex flex-col justify-center items-center overflow-hidden px-1 md:w-[70%] lg:w-[60%] ">
          {allConversations?.map((ele, i) => {
            return (
              <Link
                key={i}
                className={`block w-full overflow-hidden ${
                  isLoading && " opacity-50"
                }  `}
                href={`/msgs/${ele?._id}`}
                onClick={() => {
                  convoClickHandler(ele);
                }}
              >
                <div className=" my-1 bg-sky-950 text-white min-h-16 max-h-28 rounded w-full flex items-center active:scale-90 hover:bg-sky-700 active:bg-sky-700 hover:cursor-pointer overflow-hidden ">
                  <span className="  max-w-10 min-w-10 h-10 max-h-10 min-h-10 w-10 p-[0.1rem] rounded-full mx-4 border-2 border-sky-500 overflow-hidden">
                    <ImageReact
                      className="  w-[99%] h-[99%] rounded-full object-cover"
                      src={ele?.avatar || ""}
                    />
                  </span>

                  <div>
                    <p className=" text-lg font-semibold capitalize">
                      {ele?.name}
                    </p>
                    <p className=" opacity-70 text-sm ">
                      {ele?.lastMessage?.content
                        ? `${decryptMessage(ele?.lastMessage?.content).slice(
                            0,
                            40
                          )} ${
                            decryptMessage(ele?.lastMessage?.content).length >
                            40
                              ? "..."
                              : ""
                          } `
                        : "Dare to Chat."}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {startConvo.length > 0 ? (
        <div className=" mx-auto my-5  bg-teal-950 p-2  min-h-[10vh] rounded w-full flex flex-col justify-center overflow-hidden px-1 md:w-[70%] lg:w-[60%] ">
          <h3 className=" ml-4 py-2 opacity-80">
            Start Conversation with your Friends
          </h3>

          {startConvo.map((ele, i) => {
            return (
              <div
                key={i}
                onClick={() => onClickHandlerOfStartConvo(ele)}
                className={`overflow-hidden my-1 bg-sky-950 text-white min-h-16 rounded w-full flex items-center active:scale-90 hover:bg-sky-700 active:bg-sky-700 hover:cursor-pointer ${
                  isLoading && " opacity-50"
                } `}
              >
                <span className="  w-10 h-10 p-[0.1rem] rounded-full mx-4 border-2 border-sky-500 overflow-hidden">
                  <ImageReact
                    className=" w-[99%] h-[99%]rounded-full object-cover"
                    src={ele?.profilePic || ""}
                  />
                </span>

                <div>
                  <p className=" text-lg font-semibold">{ele?.username}</p>
                  <p className=" opacity-70 text-sm ">
                    Tap to start Conversation
                  </p>
                </div>
              </div>
              // </Link>
            );
          })}
        </div>
      ) : (
        <></>
      )}
      {!isLoading && (
        <div
          onClick={newChatClickHandler}
          className=" w-12 h-12 fixed bottom-7 right-7  md:bottom-10 md:right-[12rem] lg:right-[25rem] bg-sky-500 rounded-full hover:bg-sky-700 active:bg-sky-700 hover:cursor-pointer transition-all flex justify-center items-center"
        >
          <FaPencil className=" w-7 h-7" />
        </div>
      )}
    </div>
  );
}
