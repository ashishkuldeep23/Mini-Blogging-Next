export interface Chat_User {
  _id: string;
  name: string;
  email: string;
  username: string;
  avatar?: string;
  bio?: string;
  isOnline: boolean;
  lastSeen: Date;
  friends: string[];
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
  lastMessageAt: Date;
  unreadCount?: number;
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

export interface FriendRequest {
  _id: string;
  sender: Chat_User;
  receiver: Chat_User;
  status: "pending" | "accepted" | "declined";
  message?: string;
  createdAt: Date;
}
