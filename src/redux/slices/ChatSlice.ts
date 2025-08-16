"use client";

import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import {
  ChatInterface,
  Conversation,
  Message,
  TypeFetchMsgsByConvoId,
  TypeSendMsg,
} from "../../../types/chat-types";
import { RequestInit } from "next/dist/server/web/spec-extension/request";
import toast from "react-hot-toast";
import { encryptMessage } from "@/lib/Crypto-JS";

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
    limit = "50",
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
  },
  isLoadingMsg: false,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setCurrentConvo(state, action: PayloadAction<Conversation>) {
      state.currentConvo = action.payload;
    },
    pushOneMoreMsg(state, action: PayloadAction<Message>) {
      if (state?.currentConvo?._id === action.payload.conversationId) {
        state?.allMessagesOfThisConvo?.push(action.payload);
      }
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
          console.log(action);

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

          if (conversationId === state.currentConvo?._id) {
            state?.allMessagesOfThisConvo?.push(data);
          }

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

          let msgsId =
            state?.allMessagesOfThisConvo?.map((msg) => msg._id) || [];

          // console.log(data, total, pagination);

          // console.log(msgsId, data);

          const allMsgsFilteredArr = data.filter((msg: any) => {
            return !msgsId.includes(msg._id);
          });

          state.allMessagesOfThisConvo = [
            ...(state.allMessagesOfThisConvo || []),
            ...allMsgsFilteredArr,
          ];

          state.isFullfilled = true;
        }

        state.isLoading = false;
      })
      .addCase(fetchMsgsByConvoId.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        toast.error(` ${action.error.message || "Fetching failed"}`);
        state.errMsg = action.error.message || "Fetching failed";
      });
  },
});

export const { setCurrentConvo, pushOneMoreMsg } = chatSlice.actions;

export const useChatData = () =>
  useSelector((state: RootState) => state.chatReducer);

export default chatSlice.reducer;
