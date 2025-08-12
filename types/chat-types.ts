// export interface Chat_User {
//   // _id: string;
//   // email: string;
//   // username: string;
//   // profilePic?: string;
//   // bio?: string;
//   // isOnline: boolean;
//   // lastSeen: Date;
//   // friends: string[];
// }

import { UserDataInterface } from "./Types";

export interface Chat_User extends UserDataInterface {
  bio?: string;
  isOnline: boolean;
  lastSeen: Date;
  friends: string[];
}

export interface ThemeConvo {
  bgColor: string;
  color: string;
  bgImage: string;
  font: string;
}

export interface Conversation {
  _id: string;
  type: "direct" | "group";
  name?: string;
  avatar?: string;
  participants: Chat_User[];
  lastMessage?: {
    content: string;
    sender: Chat_User;
    timestamp: Date;
    messageType: "text" | "image" | "file";
  };
  lastMessageAt?: Date;
  unreadCount?: number;
  theme?: ThemeConvo;
}

export interface Message {
  _id: string;
  conversationId: string;
  sender: Chat_User;
  content: string;
  messageType: "text" | "image" | "file" | "system";
  replyTo?: Message;
  readBy: {
    user: string;
    readAt: Date;
  }[];
  reactions: {
    emoji: string;
    users: string[];
  }[];
  isEdited: boolean;
  createdAt: Date;
}

export interface ChatInterface {
  isLoading: boolean;
  isFullfilled: boolean;
  isError: boolean;
  errMsg: string;
  allConversations: Conversation[];
  startConvo: Chat_User[];
  allMessagesOfThisConvo?: Message[];
  currentConvo?: Conversation;
  isLoadingMsg?: boolean;

  // // // some states for pagination for fetching conversations and messages ------------->>
}

// // // Not Using this now --------------->>>
// export interface FriendRequest {
//   _id: string;
//   sender: Chat_User;
//   receiver: Chat_User;
//   status: "pending" | "accepted" | "declined";
//   message?: string;
//   createdAt: Date;
// }
