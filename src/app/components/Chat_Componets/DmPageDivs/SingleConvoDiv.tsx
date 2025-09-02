import { useChatData } from "@/redux/slices/ChatSlice";
import { Conversation } from "@/types/chat-types";
import Link from "next/link";
import ImageReact from "../../ImageReact";
import { decryptMessage } from "@/lib/Crypto-JS";

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
      <div className=" my-1 bg-sky-950 text-white min-h-16 max-h-28 rounded w-full flex items-center active:scale-90 hover:bg-sky-700 active:bg-sky-700 hover:cursor-pointer overflow-hidden ">
        <span className=" relative max-w-10 min-w-10 h-10 max-h-10 min-h-10 w-10 p-[0.1rem] rounded-full mx-4 border-2 border-sky-500 overflow-hidden">
          <ImageReact
            className="  w-[99%] h-[99%] rounded-full object-cover object-center "
            src={convo?.avatar || ""}
          />

          {isOnline && (
            <span className=" h-2.5 w-2.5 rounded-full border-2 border-black bg-green-500 absolute bottom-0.5 right-0.5 "></span>
          )}
        </span>

        <div>
          <p className=" text-lg font-semibold capitalize">{convo?.name}</p>
          <p className=" opacity-70 text-sm ">
            {convo?.lastMessage?.content
              ? `${decryptMessage(convo?.lastMessage?.content).slice(0, 40)} ${
                  decryptMessage(convo?.lastMessage?.content).length > 40
                    ? "..."
                    : ""
                } `
              : "Dare to Chat."}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default SingleConvoDiv;
