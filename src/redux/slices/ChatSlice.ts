"use client";

import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import {
  Chat_User,
  ChatInterface,
  Conversation,
  Message,
  TypeFetchMsgsByConvoId,
  TypeSendMsg,
  TypeUpdateMsg,
} from "../../types/chat-types";
import { RequestInit } from "next/dist/server/web/spec-extension/request";
import toast from "react-hot-toast";
import { encryptMessage } from "@/lib/Crypto-JS";
import { UserInSession } from "@/types/Types";

export const fetchAllConversations = createAsyncThunk(
  "chat/fetchingAllConvos",
  async () => {
    const option: RequestInit = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };

    const response = await fetch("/api/chat/conversation", option);
    let data = await response.json();
    return data;
  }
);

type CreateConvoType = {
  friendUserId: string;
  successFn: (id: any) => void;
};

export const CreateConversations = createAsyncThunk(
  "chat/CreateConvo",
  async ({ friendUserId, successFn }: CreateConvoType) => {
    const option: RequestInit = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ friendUserId }),
    };

    const response = await fetch("/api/chat/conversation", option);
    let data = await response.json();
    return { ...data, successFn, friendUserId };
  }
);

export const fetchConversationById = createAsyncThunk(
  "chat/fetchConversationById",
  async ({ id, userId }: { id: string; userId: string }) => {
    const option: RequestInit = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };

    const response = await fetch(`/api/chat/conversation/${id}`, option);
    let data = await response.json();
    return { ...data, userId };
  }
);

export const sendMsgPostCall = createAsyncThunk(
  "chat/sendMsg",
  async ({ successFn, content, ...body }: TypeSendMsg) => {
    content = encryptMessage(content);

    const option: RequestInit = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content, ...body }),
    };

    const response = await fetch("/api/chat/messages", option);
    let data = await response.json();
    return { ...data, successFn };
  }
);

export const fetchMsgsByConvoId = createAsyncThunk(
  "chat/fetchMsgsByConvoId",
  async ({
    conversationId,
    page = "1",
    limit = "10",
  }: TypeFetchMsgsByConvoId) => {
    const option: RequestInit = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };

    const response = await fetch(
      `/api/chat/messages?conversationId=${conversationId}&page=${page}&limit=${limit}`,
      option
    );
    let data = await response.json();
    return { ...data, conversationId };
  }
);

export const updateMsgPutReq = createAsyncThunk(
  "chat/updateMsgPutReq",
  async (body: TypeUpdateMsg) => {
    const {
      isUpdating,
      isEditted,
      text,
      replyTo,
      reaction,
      message,
      isDeleting,
      isDeletingForMe,
    } = body;

    if (!isUpdating && !isEditted) return;

    const option: RequestInit = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...body,
      }),
    };

    const response = await fetch(`/api/chat/messages`, option);
    let data = await response.json();
    return { ...data };
  }
);

export const getChatStrories = createAsyncThunk(
  "chat/getChatStrories",
  async (userId: string) => {
    const option: RequestInit = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };

    const response = await fetch(`/api/chat/story?userId=${userId}`, option); // `/api/chat/story?userId=${userId}", option);
    let data = await response.json();
    return data;
  }
);

export const PostChatStory = createAsyncThunk(
  "chat/PostChatStory",
  async (body: { userId: string; text: string }) => {
    const option: RequestInit = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    };

    const response = await fetch(`/api/chat/story`, option); // `/api/chat/story?userId=${userId}", option);
    let data = await response.json();
    return data;
  }
);

export const DeleteChatStory = createAsyncThunk(
  "chat/DeleteChatStory",
  async (storyId: string) => {
    const option: RequestInit = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    };

    const response = await fetch(`/api/chat/story?storyId=${storyId}`, option); // `/api/chat/story?userId=${userId}", option);
    let data = await response.json();
    return data;
  }
);

const initialState: ChatInterface = {
  isLoading: false,
  isFullfilled: false,
  isError: false,
  errMsg: "",
  allConversations: [],
  startConvo: [],
  allMessagesOfThisConvo: [],
  currentConvo: {
    _id: "",
    type: "direct",
    name: "",
    avatar: "",
    participants: [],
    admins: [],
    adminOnly: false,
  },
  msgPagination: {
    page: 0,
    limit: 10,
    totalPages: 10,
  },
  isLoadingMsg: false,
  updatingMsg: null,
  msgsForConvoObj: {},
  typingUsers: [],
  onlineUsers: {},
  chatStrories: [],
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setCurrentConvo(state, action: PayloadAction<Conversation>) {
      state.currentConvo = action.payload;
    },
    pushOneMoreMsg(state, action: PayloadAction<Message>) {
      // console.log(action.payload);
      // console.log(action.payload.conversationId);
      // console.log(state?.currentConvo?._id);

      if (
        state?.currentConvo?._id.toString() ===
        action.payload.conversationId.toString()
      ) {
        // console.log("yessss");

        const convoId = action?.payload?.conversationId || "";

        state.msgsForConvoObj[convoId].msgs = [
          ...(state.msgsForConvoObj[convoId]?.msgs || []),
          action.payload,
        ];

        // state?.allMessagesOfThisConvo?.push(action.payload);
      }
    },
    setUpdatedMsg(state, action: PayloadAction<Message>) {
      const convoId = action?.payload?.conversationId || "";

      state.msgsForConvoObj[convoId].msgs?.splice(
        state.msgsForConvoObj[convoId].msgs?.findIndex(
          (ele: Message) => ele._id === action.payload._id
        ),
        1,
        action.payload
      );
    },

    setTypingUsersArr(state, action: PayloadAction<UserInSession[]>) {
      state.typingUsers = action.payload;
    },

    setOnlineUsers(state, action: PayloadAction<{ [key: string]: Chat_User }>) {
      state.onlineUsers = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllConversations.pending, (state) => {
        state.isLoading = true;
        state.errMsg = "";
        state.isError = false;
      })
      .addCase(fetchAllConversations.fulfilled, (state, action) => {
        if (action.payload.success === false) {
          toast.error(`${action.payload.message || "Conversation Error"}`);
          state.isError = true;
          state.errMsg = action.payload.message;
        } else {
          const { data, startConvo, userId } = action.payload;

          // console.log({ data, startConvo });

          let allConversations = data?.map((convo: any) => {
            if (convo?.type === "direct") {
              // console.log(convo?.participants);

              let convoObj: any = { ...convo };

              convo?.participants.forEach((participants: any) => {
                if (participants?._id !== userId) {
                  convoObj.name = participants?.username;
                  convoObj.avatar = participants?.profilePic;
                  convoObj.directUserId = participants?._id;
                }
              });

              return convoObj;
            } else {
              return convo;
            }
          });

          // console.log({ allConversations });

          state.allConversations = allConversations;
          state.startConvo = startConvo;
          state.isFullfilled = true;
        }

        state.isLoading = false;
      })
      .addCase(fetchAllConversations.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        toast.error(` ${action.error.message || "Fetching failed"}`);
        state.errMsg = action.error.message || "Fetching failed";
      })
      .addCase(CreateConversations.pending, (state) => {
        // state.isLoading = true;
        state.errMsg = "";
        state.isError = false;
      })
      .addCase(CreateConversations.fulfilled, (state, action) => {
        if (action.payload.success === false) {
          toast.error(`${action.payload.message || "Conversation Error"}`);
          state.isError = true;
          state.errMsg = action.payload.message;
        } else {
          // console.log(action);

          const { data, successFn, friendUserId = "" } = action.payload;

          // console.log({ data });

          // state.allConversations = data;
          // state.startConvo = startConvo;

          // // // logics here --------->>

          let convoObj = { ...data };

          let friendsData = convoObj?.participants?.find(
            (user: any) => user?._id === friendUserId
          );

          if (friendsData) {
            if (friendsData?.username) convoObj.name = friendsData?.username;
            if (friendsData?.profilePic)
              convoObj.avatar = friendsData?.profilePic;
          }

          // console.log({ friendsData });

          state.allConversations.unshift(convoObj);
          state.currentConvo = convoObj;

          state.startConvo = state.startConvo.filter((ele) => {
            // console.log(ele?._id, friendUserId);
            return ele._id !== friendUserId;
          });

          // console.log({ action });

          state.isFullfilled = true;

          // // // now run success fn() ----------->>

          successFn && successFn(data?._id);
        }

        state.isLoading = false;
      })
      .addCase(CreateConversations.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        toast.error(` ${action.error.message || "Fetching failed"}`);
        state.errMsg = action.error.message || "Fetching failed";
      })
      .addCase(fetchConversationById.pending, (state) => {
        state.isLoading = true;
        state.errMsg = "";
        state.isError = false;
      })
      .addCase(fetchConversationById.fulfilled, (state, action) => {
        if (action.payload.success === false) {
          toast.error(`${action.payload.message || "Conversation Error"}`);
          state.isError = true;
          state.errMsg = action.payload.message;
        } else {
          const { data, messageArr, convoId, userId } = action.payload;

          // console.log(action.payload);

          let convoObj = { ...data };

          // let friendsData = convoObj?.participants?.find(
          //   (user: any) => user?._id !== userId
          // );

          // if (friendsData) {
          //   if (friendsData?.username) convoObj.name = friendsData?.username;
          //   if (friendsData?.profilePic)
          //     convoObj.avatar = friendsData?.profilePic;
          // }

          state.currentConvo = convoObj;
          if (state.allMessagesOfThisConvo?.length === 0) {
            state.allMessagesOfThisConvo = messageArr;
          }

          state.isFullfilled = true;
        }

        state.isLoading = false;
      })
      .addCase(fetchConversationById.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        toast.error(` ${action.error.message || "Fetching failed"}`);
        state.errMsg = action.error.message || "Fetching failed";
      })
      .addCase(sendMsgPostCall.pending, (state) => {
        // state.isLoading = true;
        state.errMsg = "";
        state.isError = false;
        state.isLoadingMsg = true;
      })
      .addCase(sendMsgPostCall.fulfilled, (state, action) => {
        if (action.payload.success === false) {
          toast.error(`${action.payload.message || "Conversation Error"}`);
          state.isError = true;
          state.errMsg = action.payload.message;
        } else {
          // console.log(action);

          const { data, successFn, conversationId = "" } = action.payload;

          state.isFullfilled = true;

          // // // Updating by pusher js ------------->>
          // if (conversationId === state.currentConvo?._id) {
          //   state?.allMessagesOfThisConvo?.push(data);
          // }

          // // // now run success fn() ----------->>

          successFn && successFn(data?._id);
        }

        state.isLoadingMsg = false;
        state.isLoading = false;
      })
      .addCase(sendMsgPostCall.rejected, (state, action) => {
        state.isLoadingMsg = false;
        state.isLoading = false;
        state.isError = true;
        toast.error(` ${action.error.message || "Fetching failed"}`);
        state.errMsg = action.error.message || "Fetching failed";
      })
      .addCase(fetchMsgsByConvoId.pending, (state) => {
        state.isLoading = true;
        state.errMsg = "";
        state.isError = false;
      })
      .addCase(fetchMsgsByConvoId.fulfilled, (state, action) => {
        if (action.payload.success === false) {
          toast.error(`${action.payload.message || "Conversation Error"}`);
          state.isError = true;
          state.errMsg = action.payload.message;
        } else {
          const { data, total, pagination } = action.payload;
          const { page, totalPages } = pagination || {};

          const convoId = data[0]?.conversationId || "";

          const checkMsgsInStateObj = state.msgsForConvoObj[convoId] || {};

          // console.log({ checkMsgsInStateObj });

          if (Object.keys(checkMsgsInStateObj).length > 0) {
            // console.log(page, totalPages);

            state.msgsForConvoObj[convoId].msgs = [
              ...data,
              ...(state.msgsForConvoObj[convoId]?.msgs || []),
            ];
            state.msgsForConvoObj[convoId].page = page ?? 1;
            state.msgsForConvoObj[convoId].totalPages = totalPages ?? 10;
          } else {
            // console.log(page, totalPages);

            let makeObj = {
              msgs: data,
              page: page,
              totalPages: totalPages,
            };

            state.msgsForConvoObj[convoId] = makeObj;
          }

          // let msgsId =
          //   state?.allMessagesOfThisConvo?.map((msg) => msg._id) || [];

          // const allMsgsFilteredArr = data.filter((msg: any) => {
          //   return !msgsId.includes(msg._id);
          // });

          // state.allMessagesOfThisConvo = [
          //   ...allMsgsFilteredArr,
          //   ...(state.allMessagesOfThisConvo || []),
          // ];

          // // // // set pagination
          // state.msgPagination.page = pagination.page;
          // state.msgPagination.limit = pagination.limit;
          // state.msgPagination.totalPages = pagination.totalPages;

          state.isFullfilled = true;
        }

        state.isLoading = false;
      })
      .addCase(fetchMsgsByConvoId.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        toast.error(` ${action.error.message || "Fetching failed"}`);
        state.errMsg = action.error.message || "Fetching failed";
      })
      .addCase(updateMsgPutReq.pending, (state) => {
        // state.isLoading = true;
        state.errMsg = "";
        state.isError = false;
      })
      .addCase(updateMsgPutReq.fulfilled, (state, action) => {
        if (action.payload.success === false) {
          toast.error(`${action.payload.message || "Conversation Error"}`);
          state.isError = true;
          state.errMsg = action.payload.message;
        } else {
          // console.log(action);
          // const { data } = action.payload;
          // console.log({ action });

          // // // set null again
          state.updatingMsg = null;

          state.isFullfilled = true;

          // // // now run success fn() ----------->>
          // successFn && successFn(data?._id);
        }

        state.isLoading = false;
      })
      .addCase(updateMsgPutReq.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        toast.error(` ${action.error.message || "Fetching failed"}`);
        state.errMsg = action.error.message || "Fetching failed";
      })
      .addCase(getChatStrories.pending, (state) => {
        // state.isLoading = true;
        state.errMsg = "";
        state.isError = false;
      })
      .addCase(getChatStrories.fulfilled, (state, action) => {
        if (action.payload.success === false) {
          toast.error(`${action.payload.message || "Conversation Error"}`);
          state.isError = true;
          state.errMsg = action.payload.message;
        } else {
          state.chatStrories = action.payload.data;
          state.isFullfilled = true;
        }

        state.isLoading = false;
      })
      .addCase(getChatStrories.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        toast.error(` ${action.error.message || "Fetching failed"}`);
        state.errMsg = action.error.message || "Fetching failed";
      })
      .addCase(PostChatStory.pending, (state) => {
        // state.isLoading = true;
        state.errMsg = "";
        state.isError = false;
      })
      .addCase(PostChatStory.fulfilled, (state, action) => {
        if (action.payload.success === false) {
          toast.error(`${action.payload.message || "Conversation Error"}`);
          state.isError = true;
          state.errMsg = action.payload.message;
        } else {
          const data = action?.payload?.data;
          state.chatStrories = [data, ...(state.chatStrories || [])];

          state.isFullfilled = true;
        }

        state.isLoading = false;
      })
      .addCase(PostChatStory.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        toast.error(` ${action.error.message || "Fetching failed"}`);
        state.errMsg = action.error.message || "Fetching failed";
      })
      .addCase(DeleteChatStory.pending, (state) => {
        // state.isLoading = true;
        state.errMsg = "";
        state.isError = false;
      })
      .addCase(DeleteChatStory.fulfilled, (state, action) => {
        if (action.payload.success === false) {
          toast.error(`${action.payload.message || "Conversation Error"}`);
          state.isError = true;
          state.errMsg = action.payload.message;
        } else {
          const data = action?.payload?.data;
          let storyId = data?._id;
          state.chatStrories =
            state?.chatStrories &&
            state?.chatStrories.filter((story) => story._id !== storyId);

          state.isFullfilled = true;
        }

        state.isLoading = false;
      })
      .addCase(DeleteChatStory.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        toast.error(` ${action.error.message || "Fetching failed"}`);
        state.errMsg = action.error.message || "Fetching failed";
      });
  },
});

export const {
  setCurrentConvo,
  pushOneMoreMsg,
  setUpdatedMsg,
  setTypingUsersArr,
  setOnlineUsers,
  // setOnlineFriends,
} = chatSlice.actions;

export const useChatData = () =>
  useSelector((state: RootState) => state.chatReducer);

export default chatSlice.reducer;
