"use client";

import React, { useState, useRef, useEffect, use, useCallback } from "react";
import { Send, User } from "lucide-react";
import { useParams } from "next/navigation";
import {
  fetchConversationById,
  fetchMsgsByConvoId,
  pushOneMoreMsg,
  sendMsgPostCall,
  setUpdatedMsg,
  updateMsgPutReq,
  useChatData,
} from "@/redux/slices/ChatSlice";
import { useSession } from "next-auth/react";
import { AppDispatch } from "@/redux/store";
import { useDispatch } from "react-redux";
import { Message, TypeSendMsg, TypeUpdateMsg } from "../../../types/chat-types";
import toast from "react-hot-toast";
import ImageReact from "../ImageReact";
import { pusherClient } from "@/lib/pusherClient";
import { decryptMessage, encryptMessage } from "@/lib/Crypto-JS";
import { TiPen } from "react-icons/ti";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useSwipeable } from "react-swipeable";
import MainLoader from "../LoaderUi";
import EmojiPicker, { Theme } from "emoji-picker-react";
import { LiaCheckDoubleSolid, LiaCheckSolid } from "react-icons/lia";
import useOpenModalWithHTML from "@/Hooks/useOpenModalWithHtml";
import { debounce } from "@/utils/debounce";
import { sendMsgViaPusher } from "@/lib/sendMsgViaPusher";
import { UserDataInterface, UserInSession } from "@/types/Types";
import { likeAnimationHandler } from "@/helper/likeAnimation";

// Demo Component showing how to use both components
const ChatDemoUI: React.FC = () => {
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

export default ChatDemoUI;

interface MessageListProps {
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

  // type TypeReactAnimation = {
  //   emoji: string;
  //   top: string;
  //   scale: number;
  //   show: boolean;
  // };

  // const initialReactAnimation: TypeReactAnimation = {
  //   emoji: "",
  //   top: "",
  //   scale: 0,
  //   show: false,
  // };

  // const [reactAnimation, setReactAnimation] = useState<TypeReactAnimation>(
  //   initialReactAnimation
  // );

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // console.log(params.id);

  // useEffect(() => {
  //   const conversationId = params?.id;
  //   if (conversationId && typeof conversationId === "string") {
  //     dispatch(fetchMsgsByConvoId({ conversationId }));
  //     // console.log("Now call server to laod the msgs with pagination");
  //   }
  // }, [params?.id]);

  // // //  new we can bind the pusher code ----------->>
  // Subscribe to the conversation channel
  useEffect(() => {
    const conversationId = params?.id;

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

  const callModalFn = useOpenModalWithHTML();

  const actualDeleteMsghandlerFn = (message: Message) => {
    // // // Now call dispatch to delete the message --------->>

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
          {(message?.sender?._id === userId || isUserAdminOfConvo) && (
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

  const page = useChatData().msgPagination.page;
  const totalPages = useChatData().msgPagination.totalPages;

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
          <span className="animate-spin h-5 w-5 border-b-4 border-sky-500 rounded-full"></span>
          <span>Loading...</span>
        </div>
      )}

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

type TypeSingleMsg = {
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
  const isCurrentUser = message.sender._id === currentUserId;
  // const isBot = message.type === "bot";
  const isElsePerson = message.sender._id !== currentUserId;
  const [offset, setOffset] = useState(0);
  // const [offsetY, setOffsetY] = useState(0);
  const [showOptions, setShowOptions] = useState(false);

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

  return (
    <div
      className={`my-2 flex flex-col ${
        (message?.isEdited || message?.reactions.length > 0) && " mb-3 "
      } `}
    >
      {message?.replyTo ? (
        <div
          className={` -mb-1 opacity-70 max-w-xs lg:max-w-xl px-2 py-1 rounded-lg flex 
            ${
              isCurrentUser
                ? "justify-end ml-auto mr-6 "
                : " justify-start ml-9 mr-auto"
            }
            ${
              currentUserId === message?.replyTo?.sender?._id
                ? " !bg-black border border-sky-500 text-white "
                : " bg-sky-600 border border-sky-500  "
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
        <div className=" flex relative ">
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
                    src={message?.sender?.profilePic || ""}
                    className="  w-7 h-7 rounded-full object-cover mr-1 "
                  />
                ) : (
                  <User className="w-4 h-4 text-white" />
                )}
              </div>
            </div>
          )}

          {/* Main Msg Div */}
          <div
            className={`relative !max-w-[17rem] lg:max-w-xl px-4 py-2 rounded-lg ${
              isCurrentUser
                ? "bg-sky-600 text-white"
                : "bg-black border border-sky-500 rounded-bl-none "
            }`}
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
            onClick={() => {
              setShowOptions(!showOptions);
            }}
            className=" mt-auto mb-4 mx-1  px-1 rounded-md bg-black border border-sky-500 font-bold text-sky-500 hover:cursor-pointer active:scale-95 transition-all"
          >
            ⁝
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
            {message?.sender?._id === currentUserId && (
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

interface MessageInputProps {
  updatingMsg: TypeUpdateMsg | null;
  setUpdatingMsg?: React.Dispatch<React.SetStateAction<TypeUpdateMsg | null>>;

  // onSendMessage: (content: string) => void;
}
// MessageInput Component
const MessageInput: React.FC<MessageInputProps> = ({
  updatingMsg,
  setUpdatingMsg,
}) => {
  const [message, setMessage] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const { data: session } = useSession();
  const userId = session?.user?._id;
  const userData = session?.user;
  const convoId = useChatData().currentConvo?._id;
  const currentConvo = useChatData().currentConvo;
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

      if (updatingMsg?.isUpdating && updatingMsg?.replyTo) {
        makeBodyData = {
          ...makeBodyData,
          replyTo: updatingMsg?.replyTo,
        };
      }

      // // // Final Call to send message to server -------->>
      dispatch(sendMsgPostCall(makeBodyData));

      // // // state reset -------->>
      setMessage("");
      setUpdatingMsg && setUpdatingMsg(null);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submitBtnClickHandler();
    }
  };

  // Debounced typing event
  const sendTyping = useCallback(
    debounce((isTyping: boolean) => {
      // const payload: TypingPayload = { userId, roomId, isTyping };
      // socket.emit("typing", payload);
      // // // now send a pusher event to server -------->>

      sendMsgViaPusher({
        event: "user-typing",
        channelName: `private-conversation-${convoId}`,
        bodyData: { isTyping, userData },
      });
    }, 500), // 300ms debounce
    [userId, convoId]
  );

  const handleChangeFn = (e: React.ChangeEvent<HTMLInputElement>) => {
    // console.log("message", message);
    setMessage(e.target.value);
    sendTyping(true);
  };

  const onUpdateMsgHandler = () => {
    if (!updatingMsg?.isUpdating && !updatingMsg?.isEditted && !message) {
      toast.error("Please click on the message you want to edit");
      return;
    }

    // // // here logic needed to seprate update fields ------>>
    dispatch(
      updateMsgPutReq({
        isUpdating: true,
        isEditted: true,
        text: encryptMessage(message),
        replyTo: updatingMsg?.message?._id,
        message: updatingMsg?.message,
      })
    );

    // // // state reset -------->>
    setMessage("");
    setUpdatingMsg && setUpdatingMsg(null);
  };

  const submitBtnClickHandler = () => {
    if (
      updatingMsg?.isUpdating &&
      updatingMsg?.isEditted &&
      updatingMsg?.text
    ) {
      onUpdateMsgHandler();
    } else {
      handleSubmit();
    }
  };

  useEffect(() => {
    if (
      updatingMsg?.isUpdating &&
      updatingMsg?.isEditted &&
      updatingMsg?.text
    ) {
      inputRef.current?.focus();
      setMessage(decryptMessage(updatingMsg?.text || ""));
    }
  }, [updatingMsg]);

  const cancleUpdateMsg = () => {
    setUpdatingMsg && setUpdatingMsg(null);
    setMessage("");
  };

  return (
    <div className="border-t border-sky-600  p-3 pt-2 w-full sticky bottom-0 ">
      {/* <div className="  flex justify-between items-end ">
        <div className=" w-[90%">
          <EmojiPicker
            // lazyLoadEmojis={true}
            // height={"200px"}
            // size={20}
            onEmojiClick={(e) => {
              setMessage(message + e.emoji);
            }}
            theme={Theme.DARK}
            // autoFocusSearch={true}
            // reactionsDefaultOpen={false}

            // reactionsDefaultOpen={true}
          />
        </div>

        <span className=" flex items-center justify-center  ml-auto mr-0.5  min-w-16 h-4 rounded-md border border-white text-[0.6rem] my-0.5 text-center font-bold active:scale-90 transition-all ">
          +
        </span>
      </div> */}

      {currentConvo?.adminOnly ? (
        <>
          <p className="p-4  text-center">
            Only{" "}
            <span className=" text-center text-sky-500 font-semibold">
              admin
            </span>{" "}
            can send the messages!
          </p>
        </>
      ) : (
        <>
          {/* Input divs */}
          {updatingMsg?.isUpdating ? (
            <div className="rounded-lg bg-sky-600 text-white text-lg p-1 mb-1 opacity-70 flex gap-1">
              <span className=" font-bold rounded-lg bg-green-400 px-1 text-white">
                {updatingMsg.isEditted ? "Edi:" : "Rep:"}
              </span>
              <p>{decryptMessage(updatingMsg?.text || "")}</p>
              <button
                onClick={cancleUpdateMsg}
                className=" ml-auto rounded-lg bg-red-500 px-2 text-white font-bold"
              >
                X
              </button>
            </div>
          ) : null}
          <div className="flex  space-x-3">
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
              onClick={submitBtnClickHandler}
              disabled={!message.trim()}
              className="bg-sky-600 hover:bg-blue-600 disabled:bg-sky-300 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg transition-colors duration-200 flex items-center justify-center"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </>
      )}
    </div>
  );
};
