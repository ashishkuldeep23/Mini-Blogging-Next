'use client'

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { useSelector } from "react-redux"
import { RootState } from "../store"
import toast from "react-hot-toast"




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



export interface UserDataInterface {
    username: string,
    profilePic: string,
    email: string,
    isVerified: boolean,
    isAdmin: boolean,
}


interface UserInter {
    isLoading: boolean,
    isFullfilled: boolean,
    isError: boolean,
    errMsg: string
    userData: UserDataInterface
}

const initialState: UserInter = {

    isLoading: false,
    isFullfilled: false,
    isError: false,
    errMsg: "",
    userData: {
        username: "",
        profilePic: "",
        email: "",
        isVerified: false,
        isAdmin: false
    }
}

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {

        setUserDataBySession(state, action) {

            // console.log(action.payload)
            state.userData.username = action.payload.email
            state.userData.profilePic = action.payload.image
            state.userData.email = action.payload.email
        }

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


    }
})


export const { setUserDataBySession } = userSlice.actions

export const useUserState = () => useSelector((state: RootState) => state.userReducer)

export default userSlice.reducer





