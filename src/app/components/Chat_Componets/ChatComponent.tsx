"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, User, Bot } from "lucide-react";
import Link from "next/link";
import { useThemeData } from "@/redux/slices/ThemeSlice";
import { useParams } from "next/navigation";
import { fetchConversationById, useChatData } from "@/redux/slices/ChatSlice";
import { useSession } from "next-auth/react";
import { AppDispatch } from "@/redux/store";
import { useDispatch } from "react-redux";

// Types
interface Message {
  id: string;
  content: string;
  userId: string;
  timestamp: Date;
  type?: "user" | "bot" | "system";
}

interface MessageListProps {
  messages: Message[];
  currentUserId: string;
}

interface MessageInputProps {
  onSendMessage: (content: string) => void;
}

// MessageList Component
const MessageList: React.FC<MessageListProps> = ({
  messages,
  currentUserId,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const formatTime = (timestamp: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(timestamp);
  };

  const themeMode = useThemeData().mode;

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4  hide_scrollbar_totally ">
      {messages.map((message) => {
        const isCurrentUser = message.userId === currentUserId;
        const isBot = message.type === "bot";
        const isSystem = message.type === "system";

        if (isSystem) {
          return (
            <div key={message.id} className="flex justify-center">
              <div className="bg-gray-200 text-gray-600 px-3 py-1 rounded-full text-sm">
                {message.content}
              </div>
            </div>
          );
        }

        return (
          <div
            key={message.id}
            className={`flex ${
              isCurrentUser ? "justify-end" : "justify-start"
            } items-start space-x-2`}
          >
            {!isCurrentUser && (
              <div className="flex-shrink-0">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    isBot ? "bg-sky-600 " : "bg-gray-400"
                  }`}
                >
                  {isBot ? (
                    <Bot className="w-4 h-4 text-white" />
                  ) : (
                    <User className="w-4 h-4 text-white" />
                  )}
                </div>
              </div>
            )}

            <div
              className={`max-w-xs lg:max-w-xl px-4 py-2 rounded-lg ${
                isCurrentUser
                  ? "bg-sky-600 text-white"
                  : isBot
                  ? ` ${
                      !themeMode ? "bg-black" : " bg-white"
                    } border border-gray-500`
                  : "bg-black "
              }`}
            >
              <div className="break-words">{message.content}</div>
              <div
                className={`text-xs mt-1 ${
                  isCurrentUser ? "text-blue-100" : "text-gray-500"
                }`}
              >
                {formatTime(message.timestamp)}
              </div>
            </div>

            {/* {isCurrentUser && (
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-sky-600 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
              </div>
            )} */}
          </div>
        );
      })}

      {/* Below Div is only used to scrool the screen below --------->> */}
      <div ref={messagesEndRef} />
    </div>
  );
};

// MessageInput Component
const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage }) => {
  const [message, setMessage] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = () => {
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="border-t border-sky-600  p-4">
      <div className="flex space-x-3">
        <div className="flex-1 relative">
          <input
            ref={inputRef}
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 bg-inherit"
          />
        </div>
        <button
          onClick={handleSubmit}
          disabled={!message.trim()}
          className="bg-sky-600 hover:bg-blue-600 disabled:bg-sky-300 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg transition-colors duration-200 flex items-center justify-center"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

// Demo Component showing how to use both components
const ChatDemoUI: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    // {
    //   id: "1",
    //   content: "Welcome to the chat!",
    //   userId: "system",
    //   timestamp: new Date(),
    //   type: "system",
    // },
    {
      id: "2",
      content: "Hello! How can I help you today?",
      userId: "bot-1",
      timestamp: new Date(),
      type: "bot",
    },
  ]);

  const currentUserId = "user-123";

  const handleSendMessage = (content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      userId: currentUserId,
      timestamp: new Date(),
      type: "user",
    };

    setMessages((prev) => [...prev, newMessage]);

    // Simulate bot response
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `You said: "${content}". How can I assist you further?`,
        userId: "bot-1",
        timestamp: new Date(),
        type: "bot",
      };
      setMessages((prev) => [...prev, botMessage]);
    }, 1000);
  };

  const params = useParams();
  const convo = useChatData().currentConvo;
  const { data: session } = useSession();
  const dispatch = useDispatch<AppDispatch>();

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
      className={`sm:my-10 sm:rounded-md overflow-hidden flex flex-col h-[95vh] sm:h-[85vh] max-w-4xl mx-auto  shadow-lg bg-gray-900 text-white`}
    >
      {/* <div className="bg-sky-600  text-white px-2  flex items-center gap-1 ">
        <Link href={"/msgs"}>◁</Link>
        <h1 className="text-xl font-semibold">Name and Img of User</h1>
      </div> */}

      <MessageList messages={messages} currentUserId={currentUserId} />
      <MessageInput onSendMessage={handleSendMessage} />
    </div>
  );
};

export default ChatDemoUI;
