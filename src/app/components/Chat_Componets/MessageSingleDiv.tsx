"use client";

import useOpenModalWithHTML from "@/Hooks/useOpenModalWithHtml";
import { useChatData } from "@/redux/slices/ChatSlice";
import { Message } from "@/types/chat-types";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useSwipeable } from "react-swipeable";
import ImageReact from "../ImageReact";
import { decryptMessage } from "@/lib/Crypto-JS";
import { User } from "lucide-react";
import { LiaCheckDoubleSolid, LiaCheckSolid } from "react-icons/lia";
import EmojiPicker, { Theme } from "emoji-picker-react";
import { TiPen } from "react-icons/ti";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useLongPress } from "@uidotdev/usehooks";
import { PiDotsThreeOutlineVertical, PiSealCheckDuotone } from "react-icons/pi";
import useInViewAnimate from "@/Hooks/useInViewAnimate";

export type TypeSingleMsg = {
  message: Message;
  currentUserId: string;
  onReply?: (m: Message) => void;
  onDel?: (m: Message) => void;
  onEdit?: (m: Message) => void;
  onReact?: (m: Message, reaction: string, delReaction?: boolean) => void;
};

const SingleMsgDiv: React.FC<TypeSingleMsg> = ({
  message,
  currentUserId,
  onReply,
  onEdit,
  onDel,
  onReact,
}) => {
  const currentConvo = useChatData().currentConvo;
  const session = useSession();
  const userId = session?.data?.user?._id;

  const senderId =
    typeof message.sender === "string" ? message.sender : message.sender._id;
  const isCurrentUser = senderId === currentUserId;
  // const isBot = message.type === "bot";
  const isElsePerson = senderId !== currentUserId;
  const [offset, setOffset] = useState(0);
  // const [offsetY, setOffsetY] = useState(0);
  const [showOptions, setShowOptions] = useState(false);
  const isFullfilled = useChatData().isFullfilled;
  const { ref: viewDivRef, inView } = useInViewAnimate();

  useEffect(() => {
    // console.log(2);

    if (isFullfilled) {
      // console.log(20);
      setShowOptions(false);
    }
  }, [isFullfilled]);

  const messageSender =
    typeof message.sender === "string"
      ? { _id: "", profilePic: "" }
      : message.sender;

  // // // Swipe Handler ----------->>
  const handlers = useSwipeable({
    onSwiping: (e) => {
      // console.log(e);
      // console.log(e.dir);

      if (e.dir === "Right") {
        !isCurrentUser && setOffset(e.deltaX > 100 ? e.deltaX : 0); // Limit swipe distance
      } else if (e.dir === "Left") {
        isCurrentUser && setOffset(e.deltaX > 100 ? 0 : e.deltaX); // Limit swipe distance
      }
      // else if (e.dir === "Up") {
      //   // setOffsetY(e.deltaY > 100 ? e.deltaY : 0);
      //   setShowOptions(true);
      // }
      // else if (e.dir === "Down") {
      //   // setOffsetY(e.deltaY > 100 ? e.deltaY : 0);
      //   setShowOptions(false);
      // }
    },

    // // // UnComment this for checking the touch events
    // onTouchStartOrOnMouseDown: () => {
    //   setOffset(0);
    //   // setOffsetY(0);
    //   setShowOptions(!showOptions);
    // },

    // onTouchEndOrOnMouseUp: () => {
    //   setOffset(0);
    //   // setOffsetY(0);
    //   setShowOptions(!showOptions);
    // },

    onSwipedRight: () => {
      onReply && !isCurrentUser && onReply(message);
      setOffset(0);
    },
    onSwipedLeft: () => {
      onReply && isCurrentUser && onReply(message);
      setOffset(0);
    },
    onSwipedUp: () => {
      // onReply && isCurrentUser && onReply();
      setOffset(0);
    },
    onSwiped: () => {
      setOffset(0);
      // setOffsetY(0);
      // setShowOptions(false);
    },
    trackMouse: true,
  });

  // // // Long Press handler ----->>>

  const attrs = useLongPress(
    () => {
      setShowOptions(true);
    },
    {
      // onStart: (event) => console.log("Press started"),
      // onFinish: (event) => console.log("Press Finished"),
      // onCancel: (event) => console.log("Press cancelled"),
      threshold: 500,
    }
  );

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

  const editMsgHandler = () => {
    onEdit && onEdit(message);
  };

  const deleteMsgHandler = () => {
    onDel && onDel(message);
  };

  const callModalFn = useOpenModalWithHTML();

  const reactionDivHandler = () => {
    // console.log(JSON.stringify(message.reactions));

    let innerHtml = (
      <div className=" w-[50vh] mx-auto flex flex-col items-center justify-center">
        <h3 className=" font-bold text-lg">Reactions</h3>
        <div>
          {message.reactions.map((r, i) => {
            return (
              <div key={i} className=" flex justify-between items-center gap-2">
                <div className=" my-1  text-white h-16 rounded w-full flex items-center active:scale-90 hover:cursor-pointer ">
                  <span className="  w-10 h-10 p-[0.1rem] rounded-full mx-1.5 border-2 border-sky-500 overflow-hidden">
                    <ImageReact
                      className="  w-[99%] h-[99%] rounded-full object-cover"
                      src={r?.user?.profilePic || ""}
                    />
                  </span>

                  <div>
                    <p className=" text-base capitalize">{r?.user?.username}</p>

                    {r?.user?._id === currentUserId && (
                      <p
                        onClick={() =>
                          onReact && onReact(message, r.emoji, true)
                        }
                        className=" opacity-70 text-sm "
                      >
                        Tab to remove
                      </p>
                    )}
                  </div>
                </div>
                <p className=" text-3xl">{r.emoji}</p>
              </div>
            );
          })}
        </div>
      </div>
    );

    callModalFn({ innerHtml });
  };

  const msgTextDivHandler = (e: React.MouseEvent<HTMLDivElement | null>) => {
    e?.stopPropagation();
    setShowOptions((p) => !p);
    clickAnimationForOptionDiv();
  };

  const clickAnimationForOptionDiv = () => {
    let getOptionDiv = document.getElementById(
      `msg_options_div_${message?._id}`
    );

    if (getOptionDiv) {
      getOptionDiv.style.scale = "0.5";

      setTimeout(() => {
        getOptionDiv.style.scale = "1";
      }, 1);
    }
  };

  const optionClickHandler = () => {
    setShowOptions(!showOptions);
    clickAnimationForOptionDiv();
  };

  // // // we'll work letter for this --------->>
  // console.log(message?.replyFor);

  // // // UI begans here --------->>>>>

  if (message?.isDeleted) {
    return (
      <p className=" text-center text-red-500 text-sm">
        {" "}
        This message is deleted!
      </p>
    );
  }

  if (userId && message?.deletedBy?.includes(userId)) {
    // return <p> This message is deleted by you!</p>;
    return <></>;
  }
  // console.log(message?.replyTo);
  // console.log(message?.replyTo?.sender._id);
  // console.log(message?.replyTo?.sender._id === currentUserId);
  // console.log(message?.replyTo?.sender);

  return (
    <div
      id={`msg_${message?._id}`}
      className={`my-2 flex flex-col ${
        (message?.isEdited || message?.reactions.length > 0) && " mb-3 "
      } no_select `}
    >
      {/* here we'll use to show reply for */}
      <div
        className={` ${inView ? "animate__animated animate__bounceIn " : ""} `}
      >
        {message?.replyFor && (
          <div
            ref={viewDivRef as React.LegacyRef<HTMLDivElement>}
            className={` p-0.5 w-[60%] bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500
             rounded-md overflow-y-auto ${
               isCurrentUser
                 ? "justify-end ml-auto mr-6 "
                 : " justify-start ml-9 mr-auto"
             }`}
          >
            <div className=" bg-gray-900 p-1 rounded-md h-full w-full flex justify-center items-center flex-col">
              <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
            </div>
          </div>
        )}
      </div>

      {/* // // When you replying someone --------->>  */}
      {message?.replyTo ? (
        <div
          className={`-mb-1 opacity-70 max-w-xs lg:max-w-xl px-2 py-1 rounded-lg flex 
            ${
              isCurrentUser
                ? "justify-end ml-auto mr-6 "
                : " justify-start ml-9 mr-auto"
            }
              ${
                message?.replyTo?.sender === userId
                  ? "bg-sky-600 text-white"
                  : "bg-black border-sky-500   "
              }`}
        >
          <div className="break-words">
            {decryptMessage(message?.replyTo?.content)}
          </div>
        </div>
      ) : null}
      <div
        {...handlers}
        style={{
          transform: `translateX(${offset}px)`,
        }}
        className={` relative mt-auto  flex ${
          isCurrentUser ? "justify-end" : "justify-start"
        } items-start `}
      >
        <div {...attrs} className=" flex relative hover:cursor-pointer ">
          {/* Profile Pic Div */}
          {!isCurrentUser && (
            <div className="flex-shrink-0">
              <div
                className={`w-9 h-8 rounded-full rounded-br-[3rem] mt-6 flex items-center justify-center ${
                  isElsePerson ? "bg-sky-600 -mr-0.5 " : "bg-gray-400"
                }`}
              >
                {isElsePerson ? (
                  <ImageReact
                    src={messageSender.profilePic || ""}
                    className="  w-7 h-7 rounded-full object-cover mr-1 "
                  />
                ) : (
                  <User className="w-4 h-4 text-white" />
                )}
              </div>
            </div>
          )}

          {/* Main Msg Div */}
          {/* I'm the main handler ---------->> */}
          <div
            className={`relative !max-w-[17rem] lg:max-w-xl px-4 py-2 rounded-lg ${
              isCurrentUser
                ? "bg-sky-600 text-white"
                : "bg-black border border-sky-500 rounded-bl-none "
            }`}
            onClick={msgTextDivHandler}
          >
            <div className="break-words">{decryptMessage(message.content)}</div>
            <div
              className={`text-xs mt-1 flex items-center justify-between gap-1 flex-wrap ${
                isCurrentUser ? "text-blue-100" : "text-gray-500"
              }`}
            >
              <span> {formatTime(message?.createdAt)}</span>
              {/* Implement letter */}
              {isCurrentUser && (
                <>
                  {message?.readBy.length ===
                  currentConvo?.participants.length ? (
                    <span>
                      <LiaCheckDoubleSolid />
                    </span>
                  ) : (
                    <span>
                      <LiaCheckSolid />
                    </span>
                  )}
                </>
              )}
            </div>
            {message?.reactions.length > 0 && (
              <div
                onClick={(e) => {
                  e?.stopPropagation();
                  // toast.success("Open modal now");

                  reactionDivHandler();
                }}
                className={` scrooller_bar_small max-w-28 overflow-x-auto absolute -bottom-3 right-0 flex hover:cursor-pointer active:scale-90 transition-all z-10 px-1 text-xs ${
                  isCurrentUser
                    ? " bg-black !border border-sky-500 rounded-full  "
                    : " rounded-full bg-black !border border-sky-500 ml-9 mr-auto"
                } `}
              >
                <>
                  {message?.reactions?.map((reaction, i) => {
                    return (
                      <span
                        key={i}
                        className={` flex ml-auto mr-0 ${
                          isCurrentUser
                            ? "  rounded-full  "
                            : " rounded-full  ml-9 mr-auto"
                        }`}
                      >
                        {reaction.emoji}
                      </span>
                    );
                  })}

                  <span
                    className={` flex ml-auto ${
                      message?.reactions.length > 1 && " mr-1 "
                    } `}
                  >
                    {message?.reactions.length > 1 && message?.reactions.length}
                  </span>
                </>
              </div>
            )}
          </div>

          {/* Show option btn  */}
          <span
            id={`msg_options_div_${message?._id}`}
            onClick={optionClickHandler}
            className={`mt-auto mb-4 mx-1  px-1 rounded-md bg-black border border-sky-500 font-bold text-sky-500 hover:cursor-pointer active:scale-90 transition-all ${
              !showOptions ? " px-0  " : "px-0.5"
            } transition-all`}
          >
            {!showOptions ? (
              <span>
                <PiDotsThreeOutlineVertical />
              </span>
            ) : (
              "x"
            )}
          </span>

          {/* Edited sapn */}
          {message?.isEdited && (
            <span
              className={` absolute -bottom-3 text-[0.6rem] text-sky-400 flex ${
                isCurrentUser ? " ml-auto mr-2 " : "ml-9 mr-auto"
              }`}
            >
              Edited
            </span>
          )}
        </div>
      </div>

      {/* Reactions */}
      {showOptions && (
        <div
          className={` rounded-lg flex gap-1 items-center ${
            isCurrentUser ? "justify-end" : "justify-start"
          }`}
        >
          <EmojiPicker
            lazyLoadEmojis={true}
            // size={20}
            theme={Theme.DARK}
            onEmojiClick={(e) => {
              // console.log(e);
              // console.log(e.emoji);
              onReact && onReact(message, e.emoji);
              setShowOptions(false);
            }}
            autoFocusSearch={false}
            reactionsDefaultOpen={true}
          />

          {/* Btns del and Edit */}

          {/* {message?.sender?._id === currentUserId && ( */}
          <div className=" mt-0.5 flex flex-nowrap gap-0.5">
            {!message?.isEdited && messageSender._id === currentUserId && (
              <button
                onClick={editMsgHandler}
                className="   text-xl p-0.5 mx-0.5  active:scale-90 transition-all hover:bg-green-600 hover:cursor-pointer rounded-md"
              >
                <TiPen />
              </button>
            )}

            <button
              onClick={deleteMsgHandler}
              className="   text-xl p-0.5 mx-0.5  active:scale-90 transition-all hover:bg-red-600 hover:cursor-pointer rounded-md"
            >
              <RiDeleteBin6Line />
            </button>
          </div>
          {/* )} */}
        </div>
      )}
    </div>
  );
};

export default SingleMsgDiv;
