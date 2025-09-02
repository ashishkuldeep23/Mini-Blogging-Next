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

import { UserDataInterface, UserInSession } from "./Types";

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
  participants: Chat_User[];
  adminOnly: boolean;
  admins: Chat_User[];
  name?: string;
  avatar?: string;
  // lastMessage?: {
  //   content: string;
  //   sender: Chat_User;
  //   timestamp: Date;
  //   messageType: "text" | "image" | "file";
  // };
  lastMessage?: Message;
  lastMessageAt?: Date;
  unreadCount?: number;
  theme?: ThemeConvo;
  directUserId?: string;
  description?: string;
}

export interface Message {
  _id: string;
  conversationId: string;
  sender: Chat_User | string;
  content: string;
  messageType: "text" | "image" | "file" | "system";
  replyTo?: Message;
  readBy: {
    user: string;
    readAt: Date;
  }[];
  reactions: {
    emoji: string;
    user: Chat_User;
  }[];
  isEdited: boolean;
  createdAt: Date;
  // deletedBy?: (Chat_User | string)[];
  deletedBy?: string[];
  isDeleted?: boolean;
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
  updatingMsg: TypeUpdateMsg | null;
  msgPagination: {
    page: number;
    limit: number;
    totalPages: number;
  };

  msgsForConvoObj: {
    [key: string]: {
      msgs: Message[];
      page: number;
      totalPages: number;
    };
  };
  typingUsers: UserInSession[];
  onlineUsers: {
    [key: string]: Chat_User;
  };
  chatStrories?: IChatStory[];
  // // // some states for pagination for fetching conversations and messages ------------->>
}

export interface IChatStory {
  _id: string;
  author: Chat_User;
  text: string;
  expiresAt: Date;
  createdAt: Date;
  seenBy?: (Chat_User | string)[];
  likedBy?: (Chat_User | string)[];
}

export type TypeSendMsg = {
  conversationId: string;
  sender: string;
  content: string;
  messageType: "text" | "image" | "file" | "system";
  successFn?: (id: any) => void;
  replyTo?: string;
};

export type TypeFetchMsgsByConvoId = {
  conversationId: string;
  page?: string;
  limit?: string;
  successFn?: (id: any) => void;
};

// // // Not Using this now --------------->>>
// export interface FriendRequest {
//   _id: string;
//   sender: Chat_User;
//   receiver: Chat_User;
//   status: "pending" | "accepted" | "declined";
//   message?: string;
//   createdAt: Date;
// }

export type TypeUpdateMsg = {
  isUpdating?: boolean;
  isEditted?: boolean;
  delReaction?: boolean;
  text?: string;
  replyTo?: string;
  reaction?: {
    emoji: string;
    user: string;
  };
  message?: Message;

  isDeleting?: boolean;
  isDeletingForMe?: boolean;
};
