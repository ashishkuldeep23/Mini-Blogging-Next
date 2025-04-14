"use client";

import {
  createAsyncThunk,
  createSlice,
  current,
  PayloadAction,
} from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import toast from "react-hot-toast";
import { AddMoreFeilsUserData, SavedPostDataType } from "../../../types/Types";

type BodyData = {
  email: string;
  password: string;
  username: string;
};

export const createNewUser = createAsyncThunk(
  "user/createNewUser",
  async (body: BodyData) => {
    const option: RequestInit = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    };
    const response = await fetch("/api/users/signup", option);
    let data = await response.json();
    return data;

    // const response = await axios.post("/api/users/signup", body)
    // return response.data
  }
);

export const logInUser = createAsyncThunk(
  "user/login",
  async (body: { email: string; password: string }) => {
    const option: RequestInit = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    };
    const response = await fetch("/api/users/login", option);
    let data = await response.json();
    return data;

    // const response = await axios.post("/api/users/signup", body)
    // return response.data
  }
);

export const getUserData = createAsyncThunk(
  "user/getUserData",
  async ({ userId, page = 1 }: { userId: string; page?: number }) => {
    const option: RequestInit = {
      cache: "no-store",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ page }),
    };
    const response = await fetch(`/api/users/${userId}`, option);
    let data = await response.json();
    return data;
  }
);

export const getProfileData = createAsyncThunk(
  "user/getProfileData",
  async ({ userId, page = 1 }: { userId: string; page?: number }) => {
    const option: RequestInit = {
      cache: "no-store",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ page }),
    };
    const response = await fetch(`/api/profile/${userId}`, option);
    let data = await response.json();
    return data;
  }
);

export const getSavedPostData = createAsyncThunk(
  "user/getSavedPostData",
  async () => {
    const option: RequestInit = {
      cache: "no-store",
      method: "GET",
    };
    const response = await fetch(`/api/post/save`, option);
    let data = await response.json();
    return data;
  }
);

type WhatUpdateData =
  | "sendFriendRequest"
  | "addFriend"
  | "removeFriend"
  | "cancelFrndRequest"
  | "newProfilePic"
  | "makeProfilePic";

type UpdateUser = {
  whatUpdate: WhatUpdateData;
  sender: string;
  reciver: string;
  newProfilePic?: string;
};

export const updateUserData = createAsyncThunk(
  "user/updateUserData",
  async (bodyObj: UpdateUser) => {
    const option: RequestInit = {
      cache: "no-store",
      method: "PUT",
      body: JSON.stringify({ ...bodyObj }),
    };
    const response = await fetch(`/api/users/update`, option);
    let data = await response.json();
    return data;
  }
);

const initialSingleUserData: AddMoreFeilsUserData = {
  _id: "",
  username: "",
  profilePic: "",
  email: "",
  isVerified: false,
  isAdmin: false,
  allPostOfUser: [],
  savedPost: {},
  allProfilePic: [],
};

interface UserInter {
  isLoading: boolean;
  isFullfilled: boolean;
  isError: boolean;
  errMsg: string;
  userData: AddMoreFeilsUserData;
  searchedUser: AddMoreFeilsUserData;
  page: number;
}
const initialState: UserInter = {
  isLoading: false,
  isFullfilled: false,
  isError: false,
  errMsg: "",
  userData: initialSingleUserData,
  searchedUser: initialSingleUserData,
  page: 1,
  // allPostOfUser: []
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserDataBySession(state, action) {
      // console.log(action.payload)
      state.userData.username = action.payload.name;
      state.userData.profilePic = action.payload.image;
      state.userData.email = action.payload.email;
    },

    setIsLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },

    setPageValue(state, action: PayloadAction<number>) {
      state.page = action.payload;
    },

    setSavedPostData(state, action: PayloadAction<SavedPostDataType>) {
      state.userData.savedPost = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // // // SingUp user --------->
      .addCase(createNewUser.pending, (state) => {
        state.isLoading = true;
        state.errMsg = "";
      })
      .addCase(createNewUser.fulfilled, (state, action) => {
        // console.log(action.payload)

        if (action.payload.success === false) {
          toast.error(`${action.payload.message || "SignUp Error"}`);
          state.isError = true;
          state.errMsg = action.payload.message;
        } else {
          state.userData = action.payload.data;
          toast.success(`${action.payload.message}`);
          state.isFullfilled = true;
        }

        // console.log(action.payload.message)

        state.isLoading = false;
      })
      .addCase(createNewUser.rejected, (state, action) => {
        // console.log(action)

        state.isLoading = false;
        state.isError = true;
        toast.error(` ${action.error.message || "SignUp failed"}`);
        state.errMsg = action.error.message || "Error";
      })

      .addCase(logInUser.pending, (state) => {
        state.isLoading = true;
        state.errMsg = "";
      })
      .addCase(logInUser.fulfilled, (state, action) => {
        console.log(action.payload);

        if (action.payload.success === true) {
          state.userData = action.payload.data;
          toast.success(`${action.payload.message}`);

          state.isFullfilled = true;
        } else {
          toast.error(`${action.payload.message || "Login Error"}`);
          state.isError = true;

          state.errMsg = action.payload.message;
        }

        // console.log(action.payload.message)

        state.isLoading = false;
      })
      .addCase(logInUser.rejected, (state, action) => {
        // console.log(action)

        state.isLoading = false;
        state.isError = true;

        toast.error(` ${action.error.message || "SignUp failed"}`);
        state.errMsg = action.error.message || "Error";
      })

      .addCase(getUserData.pending, (state) => {
        state.isLoading = true;
        state.errMsg = "";
      })
      .addCase(getUserData.fulfilled, (state, action) => {
        if (action.payload.success === true) {
          // console.log("All good ------>")
          const { friendsAllFriend, user, posts, page } = action.payload.data;

          // // // check getting some extra or not (User personal data) ---------->

          const { reciveRequest, sendRequest, whoSeenProfile } = user;

          // // Searcher User data
          // // Means searching for different user ----->
          // if (sendRequest && !whoSeenProfile) {

          if (page === 1) {
            state.searchedUser = user;
            state.searchedUser.allPostOfUser = posts;
            state.searchedUser.friendsAllFriend = friendsAllFriend;
            state.searchedUser.reciveRequest = reciveRequest;
          } else {
            state.searchedUser.allPostOfUser = posts;
          }
          // }

          state.isFullfilled = true;
        } else {
          toast.error(`${action.payload.message || "Fetch failed."}`);
          state.isError = true;
          state.errMsg = action.payload.message;
        }

        state.isLoading = false;
      })
      .addCase(getUserData.rejected, (state, action) => {
        // console.log(action)

        state.isLoading = false;
        state.isError = true;
        toast.error(` ${action.error.message || "SignUp failed"}`);
        state.errMsg = action.error.message || "Error";
      })

      .addCase(getProfileData.pending, (state) => {
        state.isLoading = true;
        state.errMsg = "";
      })
      .addCase(getProfileData.fulfilled, (state, action) => {
        // console.log(action.payload.data)

        // console.log(action.payload.data?.posts?.length)
        // console.log(action.payload.data.posts)

        if (action.payload.success === true) {
          // console.log("All good ------>")
          const { friendsAllFriend, user, posts } = action.payload.data;

          // // // check getting some extra or not (User personal data) ---------->
          const { reciveRequest, sendRequest, whoSeenProfile } = user;

          // // User data --------->>
          // // Means this data is my own data ----->
          if (sendRequest && whoSeenProfile) {
            state.userData = user;
            state.userData.allPostOfUser = posts;
            state.userData.friendsAllFriend = friendsAllFriend;
            state.userData.whoSeenProfile = whoSeenProfile;
            state.userData.sendRequest = sendRequest;
            state.userData.reciveRequest = reciveRequest;
          }

          state.isFullfilled = true;
        } else {
          toast.error(`${action.payload.message || "Fetch failed."}`);
          state.isError = true;
          state.errMsg = action.payload.message;
        }

        state.isLoading = false;
      })
      .addCase(getProfileData.rejected, (state, action) => {
        // console.log(action)

        state.isLoading = false;
        state.isError = true;
        toast.error(` ${action.error.message || "SignUp failed"}`);
        state.errMsg = action.error.message || "Error";
      })

      .addCase(updateUserData.pending, (state) => {
        state.isLoading = true;
        state.errMsg = "";
      })
      .addCase(updateUserData.fulfilled, (state, action) => {
        // console.log(action.payload)

        if (action.payload.success === true) {
          let whatUpdate = action.payload.whatUpdate as WhatUpdateData;

          if (whatUpdate === "addFriend") {
            // // // yaha pr hume krna hai ------->

            // console.log(action.payload.data)

            let { reciveRequest, friends } = action.payload.data;

            // console.log({ reciveRequest, friends })

            state.userData.reciveRequest = reciveRequest;
            state.userData.friendsAllFriend = friends;
          } else if (whatUpdate === "cancelFrndRequest") {
            // console.log(action.payload.data)

            let { reciveRequest, sendRequest } = action.payload.data;

            // console.log({ reciveRequest, sendRequest })

            state.userData.sendRequest = sendRequest;
            state.searchedUser.reciveRequest = reciveRequest;
          } else if (whatUpdate === "removeFriend") {
            // console.log(action.payload.data)

            let { friends } = action.payload.data;

            // console.log({ reciveRequest, sendRequest })

            state.userData.friendsAllFriend = friends;
          } else if (whatUpdate === "sendFriendRequest") {
            // let currentState = current(state)

            // console.log(action.payload.data)

            let { yourData } = action.payload.data;

            // // // sendRequest is the updated data of user ------->

            // console.log({ yourData })

            // state.userData.friendsAllFriend = friends

            // if (currentState.searchedUser._id === sendRequest._id) {
            //     console.log("Yes ------>")
            //     state.searchedUser = sendRequest
            // }

            state.userData.sendRequest = yourData.sendRequest;
          } else if (whatUpdate === "newProfilePic") {
            state.userData.profilePic = action.payload.data.profilePic;
            state.userData.allProfilePic = action.payload.data.allProfilePic;
          } else if (whatUpdate === "makeProfilePic") {
            state.userData.profilePic = action.payload.data.profilePic;
            // state.userData.allProfilePic = action.payload.data.allProfilePic
          } else {
            location.reload();
          }

          state.isFullfilled = true;
        } else {
          toast.error(`${action.payload.message || "Fetch failed."}`);
          state.isError = true;
          state.errMsg = action.payload.message;
        }

        state.isLoading = false;
      })
      .addCase(updateUserData.rejected, (state, action) => {
        // console.log(action)

        state.isLoading = false;
        state.isError = true;
        toast.error(` ${action.error.message || "SignUp failed"}`);
        state.errMsg = action.error.message || "Error";
      })

      .addCase(getSavedPostData.pending, (state) => {
        state.isLoading = true;
        state.errMsg = "";
      })
      .addCase(getSavedPostData.fulfilled, (state, action) => {
        // console.log(action.payload);

        if (action.payload.success === true) {
          state.userData.savedPost = action.payload.data;
        }

        state.isLoading = false;
      })
      .addCase(getSavedPostData.rejected, (state, action) => {
        // console.log(action)

        state.isLoading = false;
        state.isError = true;
        toast.error(` ${action.error.message || "SignUp failed"}`);
        state.errMsg = action.error.message || "Error";
      });
  },
});

export const {
  setUserDataBySession,
  setIsLoading,
  setPageValue,
  setSavedPostData,
} = userSlice.actions;

export const useUserState = () =>
  useSelector((state: RootState) => state.userReducer);

export default userSlice.reducer;
