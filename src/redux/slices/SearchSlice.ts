'use client'

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { useSelector } from "react-redux"
import { RootState } from "../store"
import { PostInterFace } from "./PostSlice"
import { FriendsAllFriendData } from "./UserSlice"



type BodyOfSearchLook = {
    key: string,
    type: "soft" | "hard"
}


export const searchUserAndPost = createAsyncThunk("search/searchUserAndPost", async (body: BodyOfSearchLook) => {

    // console.log(12345)

    let option: RequestInit = {
        credentials: 'include',
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)

    }


    // console.log(body)
    // return



    const response = await fetch(`/api/searchUserAndPost`, option)
    let data = await response.json();
    return data

})


interface SearchInter {
    isLoading: boolean,
    isFullFilled: boolean,
    isError: boolean,
    errMsg: string,
    keyText: string,
    postSuggetionArr: PostInterFace[],
    userSuggetionArr: FriendsAllFriendData[],
}

const initialState: SearchInter = {
    isLoading: false,
    isFullFilled: false,
    isError: false,
    errMsg: "",
    keyText: "",
    postSuggetionArr: [],
    userSuggetionArr: [],
}

const searchSlice = createSlice({
    name: "search",
    initialState,
    reducers: {

        setKeyText(state, action) {
            state.keyText = action.payload
        },

    },

    extraReducers: (builder) => {
        builder
            .addCase(searchUserAndPost.pending, (state) => {
                state.isLoading = true,
                    state.isFullFilled = false,
                    state.isError = false
            })

            .addCase(searchUserAndPost.fulfilled, (state, action) => {
                state.isLoading = false

                // console.log(action.payload.data)
                // console.log(12345)

                if (action.payload.success) {
                    state.isFullFilled = true
                    // state.productSuggetionArr = action.payload.data

                    state.userSuggetionArr = action.payload.data.users
                    state.postSuggetionArr = action.payload.data.posts

                } else {
                    state.isError = true;
                    state.errMsg = action.payload.message
                }
            })

            .addCase(searchUserAndPost.rejected, (state) => {
                state.isLoading = false,
                    state.isFullFilled = false,
                    state.isError = true
            })
    }

})

export const { setKeyText } = searchSlice.actions

export const useSearchData = () => useSelector((state: RootState) => state.searchReducer)

export default searchSlice.reducer





