'use client'

import { createAsyncThunk, createSlice, current } from "@reduxjs/toolkit"
import { useSelector } from "react-redux"
import { RootState } from "../store"
import toast from "react-hot-toast"
import { PostInterFace } from "./PostSlice"


type BodyData = {
    email: string,
    password: string,
    username: string,
}


export const createNewUser = createAsyncThunk('user/createNewUser', async (body: BodyData) => {

    const option: RequestInit = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
    }
    const response = await fetch('/api/users/signup', option)
    let data = await response.json();
    return data

    // const response = await axios.post("/api/users/signup", body)
    // return response.data
})



export const logInUser = createAsyncThunk('user/login', async (body: { email: string, password: string }) => {

    const option: RequestInit = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
    }
    const response = await fetch('/api/users/login', option)
    let data = await response.json();
    return data

    // const response = await axios.post("/api/users/signup", body)
    // return response.data
})


export const getUserData = createAsyncThunk('user/getUserData', async (userId: string) => {


    const option: RequestInit = {
        cache: 'no-store',
        method: "POST",
    }
    const response = await fetch(`/api/users/${userId}`, option)
    let data = await response.json();
    return data
})


type WhatUpdateData = "sendFriendRequest" | "addFriend" | 'removeFriend' | "cancelFrndRequest" | "newProfilePic" | "makeProfilePic"

type UpdateUser = {
    whatUpdate: WhatUpdateData,
    sender: string,
    reciver: string,
    newProfilePic?: string,

}

export const updateUserData = createAsyncThunk('user/updateUserData', async (bodyObj: UpdateUser) => {

    const option: RequestInit = {
        cache: 'no-store',
        method: "PUT",
        body: JSON.stringify({ ...bodyObj })
    }
    const response = await fetch(`/api/users/update`, option)
    let data = await response.json();
    return data
})


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



const initialSingleUserData: AddMoreFeilsUserData = {
    _id: "",
    username: "",
    profilePic: "",
    email: "",
    isVerified: false,
    isAdmin: false,
    allPostOfUser: [],
}


interface UserInter {
    isLoading: boolean,
    isFullfilled: boolean,
    isError: boolean,
    errMsg: string
    userData: AddMoreFeilsUserData,
    searchedUser: AddMoreFeilsUserData,
}

const initialState: UserInter = {
    isLoading: false,
    isFullfilled: false,
    isError: false,
    errMsg: "",
    userData: initialSingleUserData,
    searchedUser: initialSingleUserData,
    // allPostOfUser: []
}

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {

        setUserDataBySession(state, action) {

            // console.log(action.payload)
            state.userData.username = action.payload.name
            state.userData.profilePic = action.payload.image
            state.userData.email = action.payload.email
        },

    },
    extraReducers: (builder) => {
        builder
            // // // SingUp user --------->
            .addCase(createNewUser.pending, (state) => {
                state.isLoading = true
                state.errMsg = ''
            })
            .addCase(createNewUser.fulfilled, (state, action) => {
                // console.log(action.payload)

                if (action.payload.success === false) {

                    toast.error(`${action.payload.message || "SignUp Error"}`)
                    state.isError = true
                    state.errMsg = action.payload.message

                } else {

                    state.userData = action.payload.data
                    toast.success(`${action.payload.message}`)
                    state.isFullfilled = true
                }


                // console.log(action.payload.message)

                state.isLoading = false

            })
            .addCase(createNewUser.rejected, (state, action) => {

                // console.log(action)

                state.isLoading = false
                state.isError = true
                toast.error(` ${action.error.message || "SignUp failed"}`)
                state.errMsg = action.error.message || 'Error'
            })


            .addCase(logInUser.pending, (state) => {
                state.isLoading = true
                state.errMsg = ''
            })
            .addCase(logInUser.fulfilled, (state, action) => {
                console.log(action.payload)

                if (action.payload.success === true) {

                    state.userData = action.payload.data
                    toast.success(`${action.payload.message}`)

                    state.isFullfilled = true

                } else {
                    toast.error(`${action.payload.message || "Login Error"}`)
                    state.isError = true

                    state.errMsg = action.payload.message
                }


                // console.log(action.payload.message)

                state.isLoading = false

            })
            .addCase(logInUser.rejected, (state, action) => {

                // console.log(action)

                state.isLoading = false
                state.isError = true

                toast.error(` ${action.error.message || "SignUp failed"}`)
                state.errMsg = action.error.message || 'Error'
            })


            .addCase(getUserData.pending, (state) => {
                state.isLoading = true
                state.errMsg = ''
            })
            .addCase(getUserData.fulfilled, (state, action) => {

                // console.log(action.payload.data)

                if (action.payload.success === true) {

                    // console.log("All good ------>")
                    const { friendsAllFriend, user, posts } = action.payload.data


                    // state.allPostOfUser = posts
                    // state.searchedUser = user
                    // state.friendsAllFriend = friendsAllFriend


                    // // // check getting some extra or not (User personal data) ---------->

                    const { reciveRequest, sendRequest, whoSeenProfile
                    } = user

                    // if (reciveRequest) state.reciveRequest = reciveRequest
                    // if (sendRequest) state.sendRequest = sendRequest
                    // if (whoSeenProfile) state.whoSeenProfile = whoSeenProfile

                    // // Searcher User data
                    // // Means searching for different user ----->
                    if (!sendRequest && !whoSeenProfile) {
                        state.searchedUser = user
                        state.searchedUser.allPostOfUser = posts
                        state.searchedUser.friendsAllFriend = friendsAllFriend
                        state.searchedUser.reciveRequest = reciveRequest
                    }


                    // // User data
                    // // Means of my own ----->
                    if (sendRequest && whoSeenProfile) {

                        state.userData = user
                        state.userData.allPostOfUser = posts
                        state.userData.friendsAllFriend = friendsAllFriend
                        state.userData.whoSeenProfile = whoSeenProfile
                        state.userData.sendRequest = sendRequest
                        state.userData.reciveRequest = reciveRequest
                    }


                    // // // rest data set ------>
                    // state.userData = action.payload.data.user
                    // state.postCategories = action.payload.data.postCategories
                    // state.posthashtags = action.payload.data.posthashtags
                    // state.allPostsLength = action.payload.data.allPostsLength

                    state.isFullfilled = true

                } else {
                    toast.error(`${action.payload.message || "Fetch failed."}`)
                    state.isError = true
                    state.errMsg = action.payload.message
                }

                state.isLoading = false

            })
            .addCase(getUserData.rejected, (state, action) => {

                // console.log(action)

                state.isLoading = false
                state.isError = true
                toast.error(` ${action.error.message || "SignUp failed"}`)
                state.errMsg = action.error.message || 'Error'
            })


            .addCase(updateUserData.pending, (state) => {
                state.isLoading = true
                state.errMsg = ''
            })
            .addCase(updateUserData.fulfilled, (state, action) => {

                // console.log(action.payload)

                if (action.payload.success === true) {

                    let whatUpdate = action.payload.whatUpdate as WhatUpdateData

                    if (whatUpdate === "addFriend") {

                        // // // yaha pr hume krna hai ------->

                        // console.log(action.payload.data)

                        let { reciveRequest, friends } = action.payload.data

                        // console.log({ reciveRequest, friends })

                        state.userData.reciveRequest = reciveRequest
                        state.userData.friendsAllFriend = friends

                    }

                    else if (whatUpdate === "cancelFrndRequest") {

                        // console.log(action.payload.data)

                        let { reciveRequest, sendRequest } = action.payload.data

                        // console.log({ reciveRequest, sendRequest })

                        state.userData.sendRequest = sendRequest
                        state.searchedUser.reciveRequest = reciveRequest

                    }

                    else if (whatUpdate === "removeFriend") {

                        // console.log(action.payload.data)

                        let { friends } = action.payload.data

                        // console.log({ reciveRequest, sendRequest })

                        state.userData.friendsAllFriend = friends

                    }

                    else if (whatUpdate === "sendFriendRequest") {

                        // let currentState = current(state)

                        // console.log(action.payload.data)

                        let { yourData } = action.payload.data


                        // // // sendRequest is the updated data of user ------->

                        // console.log({ yourData })

                        // state.userData.friendsAllFriend = friends

                        // if (currentState.searchedUser._id === sendRequest._id) {
                        //     console.log("Yes ------>")
                        //     state.searchedUser = sendRequest
                        // }

                        state.userData.sendRequest = yourData.sendRequest

                    }
                    else if (whatUpdate === "newProfilePic") {
                        state.userData.profilePic = action.payload.data.profilePic
                        state.userData.allProfilePic = action.payload.data.allProfilePic

                    }
                    else if (whatUpdate === "makeProfilePic") {
                        state.userData.profilePic = action.payload.data.profilePic
                        // state.userData.allProfilePic = action.payload.data.allProfilePic

                    }

                    else {

                        location.reload()
                    }

                    state.isFullfilled = true

                } else {
                    toast.error(`${action.payload.message || "Fetch failed."}`)
                    state.isError = true
                    state.errMsg = action.payload.message
                }

                state.isLoading = false

            })
            .addCase(updateUserData.rejected, (state, action) => {

                // console.log(action)

                state.isLoading = false
                state.isError = true
                toast.error(` ${action.error.message || "SignUp failed"}`)
                state.errMsg = action.error.message || 'Error'
            })




    }
})


export const { setUserDataBySession } = userSlice.actions

export const useUserState = () => useSelector((state: RootState) => state.userReducer)

export default userSlice.reducer





