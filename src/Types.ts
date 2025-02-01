// import { PostCustomization } from "./redux/slices/PostSlice";

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


export interface UserDataInterface {
    _id: string,
    username: string,
    profilePic: string,
    email: string,
    isVerified: boolean,
    isAdmin: boolean,
    allProfilePic?: string[]
}


export interface AddMoreFeilsUserData extends UserDataInterface {
    allPostOfUser: PostInterFace[],
    friendsAllFriend?: FriendsAllFriendData[],
    reciveRequest?: UserDataInterface[],
    sendRequest?: UserDataInterface[],
    whoSeenProfile?: UserDataInterface[]
}


export interface FriendsAllFriendData extends UserDataInterface {
    friends: string[]
}


export interface ReplyInterFace {
    commentId: string
    reply: string
    userId: UserDataInterface
    whenCreated: string
    _id: string
}


export interface Comment {
    _id: string,
    comment: string,
    createdAt: string,
    likes: number,
    likesId: string[],
    replies: ReplyInterFace[],
    userId: UserDataInterface
    whenCreated: string
}


export interface PostCustomization {
    bgColor: string,
    color: string,
    bgImage: string,
    font: string,
}


export interface UpdateCommentInput {
    comment: Comment,
    whatUpadate: 'update' | 'delete' | 'like'
}


export type SearchObj = {
    hash?: string,
    category?: string,
    page?: number,
    limit?: number,
}



export interface PostInterFace {
    _id: string,
    title: string,
    category: string,
    promptReturn: string,
    urlOfPrompt: string,
    aiToolName: string,
    hashthats: string[],
    image?: string,
    author: {
        username: string,
        email: string,
        profilePic: string,
        isVerified: boolean,
        isAdmin: boolean,
        _id: string
    }
    likes: 0,
    // likesId: UserDataInterface[]|string[],
    likesId: Array<string | UserDataInterface>,
    comments: Comment[],
    isDeleted: boolean,
    customize?: PostCustomization
    whenCreated?: string
    metaDataType?: ValidInputFiles
    metaDataUrl?: string,
    createdAt: Date,
    updatedAt: Date,
}


// // // Baking type for single post -------->
export interface SinglePostType extends Omit<PostInterFace, 'likesId'> {
    likesId: UserDataInterface[]
}


export type MetaDataInfoType = {
    id: string,
    sec: string
}


export interface PostSliceInterFace {
    isLoading: boolean,
    isFullfilled: boolean,
    writePostFullFilled: boolean;
    isError: boolean,
    errMsg: string,
    allPost: PostInterFace[],
    singlePostId: string,
    updatingPost: boolean,
    singlePostdata?: PostInterFace
    postCategories: string[],
    posthashtags: string[],
    allPostsLength: number,
    searchHashAndCate: {
        hash: string,
        category: string,
        page: number
    },
    searchByText?: string;
    isMuted: boolean;
    metaDataInfo?: MetaDataInfoType;
}


export interface NewPostType {
    category: string,
    content: string,
    url: string,
    origin: string,
    hashs: string[],
    title?: string,
    customize?: PostCustomization,
    image?: string,
    metaDataType?: ValidInputFiles
    metaDataUrl?: string
}


export interface PostTypeForBackend {
    title: string,                             // // // === title 
    category: string,                         // // // === category 
    promptReturn: string,                    // // // === content 
    // urlOfPrompt: string,                 // // // === url 
    aiToolName: string,                    // // // === origin
    hashthats: string[],                  // // // === hashs
    customize?: PostCustomization,       // // // === customize
    image?: string                      // // // === image
    author?: string                    // // // === author
    whenCreated?: string              // // // === whenCreated
    metaDataType?: ValidInputFiles   // // // === metaDataType
    metaDataUrl?: string            // // // === metaDataUrl
}


export type ValidInputFiles = "image/png" | "image/jpeg" | "video/mp4" | null
