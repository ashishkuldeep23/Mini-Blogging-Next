"use client";

import { decryptMessage, encryptMessage } from "@/lib/Crypto-JS";
import { sendMsgViaPusher } from "@/lib/sendMsgViaPusher";
import {
  sendMsgPostCall,
  setDraftMsg,
  updateMsgPutReq,
  useChatData,
} from "@/redux/slices/ChatSlice";
import { AppDispatch } from "@/redux/store";
import { TypeSendMsg, TypeUpdateMsg } from "@/types/chat-types";
import { debounce } from "@/utils/debounce";
import { toastError } from "@/utils/toastWithStyle";
import { Send, Type } from "lucide-react";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { TiAttachment } from "react-icons/ti";

import { ImFileVideo, ImFilePicture, ImFilePdf } from "react-icons/im";
import ImageReact from "../ImageReact";
import { PostFileInCloudinary } from "@/lib/cloudinaryHandlers";

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
  const isLoading = useChatData().isLoading;
  const convoId = useChatData().currentConvo?._id;
  const currentConvo = useChatData().currentConvo;
  const draftMsg = useChatData().currentConvo?.draftMsg;
  const dispatch = useDispatch<AppDispatch>();
  const [showSendFileOption, setShowSendFileOption] = useState(false);
  const [sendingFile, setSendingFile] = useState<File | null>(null);

  const setDraftMsgFn = (message: string) => dispatch(setDraftMsg(message));

  // // // New msgs and new msgs with reply is handled by this handler fn -------------->>
  const handleSubmit = async () => {
    let sendMsg = message.trim();

    if (!sendMsg && !sendingFile) {
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

    // if (sendMsg && convoId && userId) {
    if (convoId && userId) {
      // onSendMessage(message.trim());

      let makeBodyData: TypeSendMsg = {
        conversationId: convoId,
        sender: userId,
        content: sendMsg,
        messageType: "text",
      };

      if (sendingFile) {
        let fileType: TypeSendMsg["messageType"] = sendingFile.type.includes(
          "image"
        )
          ? "image"
          : sendingFile.type.includes("video")
          ? "video"
          : "file";

        let fileUrl = await PostFileInCloudinary(sendingFile);

        makeBodyData = {
          ...makeBodyData,
          messageType: fileType,
          fileUrl,
        };
      }

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
    setDraftMsgFn(e.target.value);
    sendTyping(true);
  };

  const reactHandler = (emoji: string) => {
    inputRef.current?.focus();
    setMessage(message + emoji);
    setDraftMsgFn(message + emoji);
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

  const fileInputClickHandler = (
    e: React.MouseEvent<HTMLSpanElement, MouseEvent>
  ) => {
    // console.log("yes cickd ");
    // console.log(showSendFileOption);

    e.stopPropagation();
    setShowSendFileOption(!showSendFileOption);
    // setShowSendFileOption((p) => !p);
    // setShowSendFileOption(true);
  };

  const fileInputOnchangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    e.preventDefault();

    // // // Check this letter why not getting below val from env

    if (e.target.files) {
      const file = e?.target?.files[0];

      // // // Here now set file ---------->
      // File size should less then 2 mb.
      let maxFileSize = 16007152;
      if (file.size > maxFileSize) {
        return toast.error("File size should less then 12 mb");
      }

      // // // Set variable here -------->>
      setSendingFile(file);
      // setPostImageUrl(URL.createObjectURL(file));

      // setNewGroupData({
      //   ...newGroupData,
      //   avatar: URL.createObjectURL(file),
      // });

      // setMetaDataType(file.type as ValidInputFiles);

      // // // Experiment ---------------------------------------->>
      // // // Now call the check fn defined in server.
      // checkMediaHnadler(file);
    }
  };

  const cancleUpdateFile = () => {
    setSendingFile(null);
  };

  const sendFileDivRef = useRef<HTMLDivElement>(null);
  // clickoutside make sendingFile null
  useEffect(() => {
    if (!showSendFileOption) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        showSendFileOption &&
        sendFileDivRef.current &&
        !sendFileDivRef.current.contains(event.target as Node)
      ) {
        // console.log("i'm working");

        setTimeout(() => {
          setSendingFile(null);
          setShowSendFileOption(false);
        }, 200);
      }
    };
    document.addEventListener("click", handleClickOutside);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showSendFileOption]);

  // // // Set msg by draftMsg ---------->>
  useEffect(() => {
    if (draftMsg) {
      setMessage(draftMsg);
    }
  }, []);

  return (
    <div className="border-t border-sky-600 w-full sticky bottom-0 ">
      {currentConvo?.adminOnly &&
      !currentConvo?.admins
        .map((admin) => admin?._id)
        ?.includes(userId || "") ? (
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
          {/* When user updatin msg ------>> */}
          <div
            className={`rounded-lg text-white text-lg  mb-1 opacity-70 flex flex-col gap-1 items-start overflow-hidden transition-all duration-500 border-sky-500
            ${
              updatingMsg?.message?.sender === userId
                ? "bg-sky-600 text-white"
                : "bg-black    "
            }

            ${
              updatingMsg?.isUpdating
                ? " max-h-24  p-1.5 border"
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

            {/* For files --------->> use this at input also when you replying  */}
            <div>
              {updatingMsg?.message?.messageType === "image" && (
                <ImageReact
                  src={updatingMsg?.message?.fileUrl || ""}
                  className="  w-7 h-7 rounded object-cover "
                />
              )}
              {updatingMsg?.message?.messageType === "video" && (
                <video
                  controls
                  muted
                  className="  w-20 h-16 rounded  "
                  src={updatingMsg?.message?.fileUrl || ""}
                  controlsList="nodownload noremoteplayback noplaybackrate"
                />
              )}

              {!updatingMsg?.message?.messageType.includes("image") &&
                !updatingMsg?.message?.messageType.includes("video") && (
                  <>
                    <div className=" flex gap-1">
                      {" "}
                      <span>
                        <ImFilePdf />
                      </span>{" "}
                      File
                    </div>
                  </>
                )}
            </div>

            <button
              onClick={cancleUpdateMsg}
              className=" ml-auto rounded-lg bg-red-500 px-2 text-white font-bold"
            >
              X
            </button>
          </div>

          {/* Emoji Div */}
          <div
            className={` overflow-hidden transition-all duration-500 px-3 ${
              !showSendFileOption
                ? " top-0  relative "
                : " top-[100%] h-0 absolute "
            } `}
          >
            <div className=" h-8 w-full rounded overflow-x-auto overflow-y-hidden flex scrooller_bar_hidden ">
              {[
                "😂",
                "🤣",
                "😍",
                "👍",
                "👏",
                "🙏",
                "😊",
                "😃",
                "😄",
                "😆",
                "😔",
                "😖",
                "😡",
                "😠",
                "👎",
                "👏",
                "👀",
              ].map((emoji, i) => (
                <span
                  key={i}
                  onClick={() => reactHandler(emoji)}
                  className=" cursor-pointer text-xl mx-1  active:scale-90 hover:scale-110 transition-all duration-200 "
                >
                  {emoji}
                </span>
              ))}
            </div>
          </div>

          {/* When user select file for sending ------>> */}
          <div
            className={` overflow-hidden transition-all duration-500 ${
              showSendFileOption
                ? " top-0  relative "
                : " top-[100%] h-0 absolute "
            } `}
            ref={sendFileDivRef}
          >
            {sendingFile ? (
              <div className=" p-3  ">
                {sendingFile?.type?.includes("image") && (
                  <div className=" relative">
                    <ImageReact
                      className=" w-40 h-40 object-cover object-center "
                      src={URL.createObjectURL(sendingFile)}
                    />

                    <span
                      onClick={cancleUpdateFile}
                      className=" absolute -top-1 -left-1 text-white rounded-md text-sm  px-1 bg-red-500 cursor-pointer active:scale-90 transition-all duration-200"
                    >
                      X
                    </span>
                  </div>
                )}

                {sendingFile?.type?.includes("video") && (
                  <div>
                    <video
                      // controls
                      autoPlay
                      muted
                      className="  w-40 h-40  "
                      src={URL.createObjectURL(sendingFile)}
                      controlsList="nodownload noremoteplayback noplaybackrate"
                    />

                    <span
                      onClick={cancleUpdateFile}
                      className=" absolute top-4 left-1.5 text-white rounded-md text-sm  px-1 bg-red-500 cursor-pointer active:scale-90 transition-all duration-200"
                    >
                      X
                    </span>
                  </div>
                )}

                {!sendingFile?.type?.includes("image") &&
                  !sendingFile?.type?.includes("video") && (
                    <div>
                      <div className=" flex gap-1">
                        {" "}
                        <span>
                          <ImFilePdf />
                        </span>{" "}
                        File
                      </div>

                      <p>{sendingFile?.name}</p>

                      <span
                        onClick={cancleUpdateFile}
                        className=" absolute top-0 -left-0.5 text-white rounded-md text-sm  px-1 bg-red-500 cursor-pointer active:scale-90 transition-all duration-200"
                      >
                        X
                      </span>
                    </div>
                  )}
              </div>
            ) : (
              <div
                className={` w-[92%] p-3 py-0  m-1 rounded-lg overflow-hidden flex items-center  gap-1 `}
              >
                {/* For Photo --------->>  */}
                <div className="">
                  <label htmlFor="send_file_img">
                    <ImFilePicture className=" text-sky-500 text-3xl mx-auto cursor-pointer active:scale-90 transition-all duration-200" />
                  </label>
                  <input
                    className={` hidden`}
                    type="file"
                    name=""
                    accept="image/png, image/png, image/jpeg"
                    id="send_file_img"
                    onChange={(e) => {
                      fileInputOnchangeHandler(e);
                    }}
                  />
                </div>
                {/* For Video --------->> */}
                <div className="">
                  <label htmlFor="send_file_vid">
                    <ImFileVideo className=" text-sky-500 text-3xl mx-auto cursor-pointer  active:scale-90 transition-all duration-200" />
                  </label>
                  <input
                    className={` hidden`}
                    type="file"
                    name=""
                    accept=" video/mp4, video/quicktime , video/webm"
                    id="send_file_vid"
                    onChange={(e) => {
                      fileInputOnchangeHandler(e);
                    }}
                  />
                </div>

                {/* For Any File ---------->> */}
                <div className="">
                  <label htmlFor="send_file_any">
                    <ImFilePdf className=" text-sky-500 text-3xl mx-auto cursor-pointer active:scale-90 transition-all duration-200" />
                  </label>
                  <input
                    className={` hidden`}
                    type="file"
                    name=""
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,.zip,.rar,.7z,.mp3,.wav,.json,.xml"
                    id="send_file_any"
                    onChange={(e) => {
                      fileInputOnchangeHandler(e);
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Input Div ------>> */}
          <div className=" p-3 pt-0 flex  space-x-3 relative z-10 bg-gray-900 ">
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
              <span onClick={fileInputClickHandler}>
                <TiAttachment
                  className={`absolute z-[1] top-3 right-1.5 w-5 h-5 cursor-pointer text-sky-500 border border-sky-500 rounded-md hover:scale-105 active:scale-90 transition-all ${
                    showSendFileOption && " !bg-sky-500 !text-white "
                  } `}
                />
              </span>
            </div>
            <button
              onClick={submitBtnClickHandler}
              disabled={(!message.trim() && !sendingFile) || isLoading}
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
