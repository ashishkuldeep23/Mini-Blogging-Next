"use client";

import { decryptMessage, encryptMessage } from "@/lib/Crypto-JS";
import { sendMsgViaPusher } from "@/lib/sendMsgViaPusher";
import {
  sendMsgPostCall,
  updateMsgPutReq,
  useChatData,
} from "@/redux/slices/ChatSlice";
import { AppDispatch } from "@/redux/store";
import { TypeSendMsg, TypeUpdateMsg } from "@/types/chat-types";
import { debounce } from "@/utils/debounce";
import { toastError } from "@/utils/toastWithStyle";
import { Send } from "lucide-react";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";

export interface MessageInputProps {
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
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { data: session } = useSession();
  const userId = session?.user?._id;
  const userData = session?.user;
  const convoId = useChatData().currentConvo?._id;
  const currentConvo = useChatData().currentConvo;
  const dispatch = useDispatch<AppDispatch>();

  // // // New msgs and new msgs with reply is handled by this handler fn -------------->>
  const handleSubmit = () => {
    let sendMsg = message.trim();

    if (!sendMsg) {
      toastError("Message can't be empty");
      return;
    }
    if (!userId) {
      toastError("User not found");
      return;
    }
    if (!convoId) {
      toastError("Conversation not found");
      return;
    }

    if (message.length > 300) {
      toastError("Message can't be more than 300 characters");
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

  const handleChangeFn = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    // console.log("message", message);
    setMessage(e.target.value);
    sendTyping(true);
  };

  // // // basically Editing of any msg is handled by this handler fn ------------->>
  const onUpdateMsgHandler = () => {
    if (!updatingMsg?.isUpdating && !updatingMsg?.isEditted && !message) {
      toastError("Please click on the message you want to edit");
      return;
    }

    if (message.length > 300) {
      if (message.length > 300) {
        toastError("Message can't be more than 300 characters");
        return;
      }
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
          <div
            className={`rounded-lg text-white text-lg  mb-1 opacity-70 flex gap-1 items-start overflow-hidden transition-all duration-500 border-sky-500
            ${
              updatingMsg?.message?.sender === userId
                ? "bg-sky-600 text-white"
                : "bg-black    "
            }

            ${
              updatingMsg?.isUpdating
                ? " max-h-24 h-12 p-1.5 border"
                : " h-0 p-0 border-0 "
            }
            `}
          >
            {/* <span className=" font-bold rounded-lg bg-green-400 px-1 text-white">
                {updatingMsg.isEditted ? "Edi:" : "Rep:"}
              </span> */}
            <p className=" max-h-20 overflow-hidden overflow-y-auto text-sm ">
              {decryptMessage(updatingMsg?.text || "")}
            </p>
            <button
              onClick={cancleUpdateMsg}
              className=" ml-auto rounded-lg bg-red-500 px-2 text-white font-bold"
            >
              X
            </button>
          </div>

          <div className="flex  space-x-3">
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                value={message}
                onChange={handleChangeFn}
                onKeyDown={handleKeyPress}
                placeholder="Type your message..."
                className="  max-h-16 h-12 w-full  px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 bg-inherit"
              ></textarea>

              {/* <input
                ref={inputRef}
                type="text"
                value={message}
                onChange={handleChangeFn}
                onKeyDown={handleKeyPress}
                placeholder="Type your message..."
                className=" min-h-5 max-h-20 w-full overscroll-none px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 bg-inherit"
              /> */}
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

export default MessageInput;
