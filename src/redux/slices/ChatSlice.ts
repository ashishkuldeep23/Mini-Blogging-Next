"use client";

import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { ChatInterface, Conversation } from "../../../types/chat-types";
import { RequestInit } from "next/dist/server/web/spec-extension/request";
import toast from "react-hot-toast";

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

          let friendsData = convoObj?.participants?.find(
            (user: any) => user?._id !== userId
          );

          if (friendsData) {
            if (friendsData?.username) convoObj.name = friendsData?.username;
            if (friendsData?.profilePic)
              convoObj.avatar = friendsData?.profilePic;
          }

          state.currentConvo = convoObj;
          state.allMessagesOfThisConvo = messageArr;

          state.isFullfilled = true;
        }

        state.isLoading = false;
      })
      .addCase(fetchConversationById.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        toast.error(` ${action.error.message || "Fetching failed"}`);
        state.errMsg = action.error.message || "Fetching failed";
      });
  },
});

export const { setCurrentConvo } = chatSlice.actions;

export const useChatData = () =>
  useSelector((state: RootState) => state.chatReducer);

export default chatSlice.reducer;
