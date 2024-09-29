import { PostCustomization } from "./redux/slices/PostSlice";

// interfaces.ts
export interface MessageInterface {
    id: number;
    text: string;
    timestamp: number;
    senderId: number;
}

export interface FriendInterface {
    id: number;
    name: string;
    online: boolean;
}



export interface NewPostType {
    title: string,
    category: string,
    content: string,
    url: string,
    origin: string,
    hashs: string[],
    customize?: PostCustomization,
    image?: string
}


