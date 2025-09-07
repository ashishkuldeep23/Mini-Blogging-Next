import { useChatData } from "@/redux/slices/ChatSlice";
import { Conversation } from "@/types/chat-types";
import Link from "next/link";
import ImageReact from "../../ImageReact";
import { decryptMessage } from "@/lib/Crypto-JS";
import { formatDateToDDMMYYYY } from "@/helper/DateFomater";

const SingleConvoDiv = ({
  convo,
  isLoading = false,
  convoClickHandler,
}: {
  convo: Conversation;
  isLoading?: boolean;
  convoClickHandler?: (c: Conversation) => void;
}) => {
  const isOnline = useChatData()?.onlineUsers?.[convo?.directUserId || ""];

  return (
    <Link
      // key={i}
      className={`block w-full overflow-hidden ${isLoading && " opacity-50"}  `}
      href={`/msgs/${convo?._id}`}
      onClick={() => {
        convoClickHandler && convoClickHandler(convo);
      }}
    >
      <div className=" my-1 bg-sky-950 text-white min-h-16 max-h-28 rounded w-full flex gap-1 sm:gap-3 items-center flex-wrap active:scale-90 hover:bg-sky-700 active:bg-sky-700 hover:cursor-pointer overflow-hidden ">
        <span className=" ml-2 relative max-w-14 min-w-14 h-14 max-h-14 min-h-14 w-14 p-[0.1rem] rounded-full overflow-hidden">
          <ImageReact
            className="  w-[99%] h-[99%] rounded-full object-cover object-center "
            src={convo?.avatar || ""}
          />

          {isOnline && (
            <span className=" h-2.5 w-2.5 rounded-full border-2 border-black bg-green-500 absolute bottom-2 right-2 "></span>
          )}
        </span>

        <div className=" flex flex-col justify-center mt-1.5">
          <p className=" text-lg font-semibold capitalize leading-[0.85rem] ">
            {convo?.name}
          </p>
          <p className=" opacity-70 text-sm ">
            {convo?.lastMessage?.content
              ? `${decryptMessage(convo?.lastMessage?.content).slice(0, 40)} ${
                  decryptMessage(convo?.lastMessage?.content).length > 40
                    ? "..."
                    : ""
                } `
              : "Dare to Chat."}
          </p>

          {convo?.type === "group" ? (
            <div>
              <p className=" opacity-70 text-[0.6rem] ">
                {formatDateToDDMMYYYY(convo?.lastMessageAt)} (Last msg at)
              </p>
            </div>
          ) : (
            <div>
              {!isOnline &&
                convo.participants &&
                convo?.participants.find(
                  (user) =>
                    user?.username?.toString() === convo?.name?.toString()
                )?.lastSeen && (
                  <p className=" opacity-70 text-[0.6rem] ">
                    {formatDateToDDMMYYYY(
                      convo?.participants.find(
                        (user) =>
                          user?.username?.toString() === convo?.name?.toString()
                      )?.lastSeen
                    )}{" "}
                    (Active at)
                  </p>
                )}

              {isOnline && (
                <p className=" opacity-70 text-[0.6rem] ">
                  <span className=" text-green-200 font-semibold ">Active</span>
                </p>
              )}
            </div>
          )}

          {/* <p className=" opacity-70 text-[0.7rem] ">Active</p> */}
        </div>
      </div>
    </Link>
  );
};

export default SingleConvoDiv;
