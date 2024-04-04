'use client'

import { PayloadAction, createAsyncThunk, createSlice, current } from "@reduxjs/toolkit"
import { useSelector } from "react-redux"
import { RootState } from "../store"
import toast from "react-hot-toast"
import { NewPostType } from "@/app/new-post/page"
import { UserDataInterface } from "./UserSlice"


// // // Not using now -------->
export const getAllPosts = createAsyncThunk('post/getAllPost', async () => {

    const option: RequestInit = {
        cache: 'no-store'
    }

    const response = await fetch('/api/post/all', option)
    let data = await response.json();
    return data

    // const response = await axios.post("/api/users/signup", body)
    // return response.data
})


export const createNewPost = createAsyncThunk("post/createNewPost", async ({ body, userId }: { body: NewPostType, userId: string }) => {

    let makeBody = {
        title: body.title,
        category: body.category,
        promptReturn: body.content,
        urlOfPrompt: body.url,
        aiToolName: body.origin,
        hashthats: body.hashs,
        author: userId
    }


    const options: RequestInit = {
        credentials: 'include',
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(makeBody)
    }


    const response = await fetch('/api/post', options)
    let data = await response.json();
    return data

})



export interface ReplyInterFace {
    commentId: string
    reply: string
    userId: UserDataInterface
    whenCreated: string
    _id: string
}



export interface Comment {
    comment: string,
    createdAt: string,
    likes: number,
    likesId: string[],
    replies: ReplyInterFace[],
    _id: string,
    userId: UserDataInterface
    whenCreated: string
}


export interface PostInterFace {
    _id: string,
    title: string,
    category: string,
    promptReturn: string,
    urlOfPrompt: string,
    aiToolName: string,
    hashthats: string[],
    author: {
        username: string,
        email: string,
        profilePic: string,
        isVerified: boolean,
        isAdmin: boolean
    }
    likes: 0,
    likesId: string[],
    comments: Comment[],
    isDeleted: boolean
}


interface PostSliceInterFace {
    isLoading: boolean,
    isFullfilled: boolean,
    writePostFullFilled: boolean;
    isError: boolean,
    errMsg: string,
    allPost: PostInterFace[],
    singlePostId: string,
    singlePostdata?: PostInterFace
}

const initialState: PostSliceInterFace = {
    isLoading: false,
    isFullfilled: false,
    writePostFullFilled: false,
    isError: false,
    errMsg: "",
    allPost: [],
    singlePostId: "",
    singlePostdata: {
        _id: "",
        title: "",
        category: "",
        promptReturn: "",
        urlOfPrompt: "",
        aiToolName: "",
        hashthats: [""],
        author: {
            username: "",
            email: "",
            profilePic: "",
            isVerified: false,
            isAdmin: false
        },
        likes: 0,
        likesId: [""],
        comments: [],
        isDeleted: false
    }
}



interface UpdateCommentInput {
    comment: Comment,
    whatUpadate: 'update' | 'delete' | 'like'
}


const psotSlice = createSlice({
    name: "theme",
    initialState,
    reducers: {

        setWriteFullFilledVal(state, action) {
            state.writePostFullFilled = action.payload
        },

        setSinglePostId(state, action) {
            state.singlePostId = action.payload
        },

        setIsLoading(state, action: PayloadAction<boolean>) {

            state.isLoading = action.payload
        },

        setErrMsg(state, action: PayloadAction<string>) {
            state.errMsg = action.payload
        },

        setAllPosts(state, action: PayloadAction<PostInterFace[]>) {
            state.allPost = action.payload
        },

        setSinglePostdata(state, action: PayloadAction<PostInterFace>) {
            state.singlePostdata = action.payload


            let currentState = current(state)

            let findIndex = [...currentState.allPost].findIndex(ele => ele._id === action.payload._id)

            // console.log(findIndex)

            state.allPost.splice(findIndex, 1, action.payload)


        },


        setUpdateComment(state, action: PayloadAction<UpdateCommentInput>) {
            let currentState = current(state)

            let currentSinglePost = currentState?.singlePostdata

            if (currentSinglePost) {

                if (action.payload.whatUpadate === "update") {
                    let commentsForSinglePost = currentSinglePost.comments.findIndex((ele) => ele._id === action.payload.comment._id)
                    state.singlePostdata?.comments.splice(commentsForSinglePost, 1, action.payload.comment)
                }

                else if (action.payload.whatUpadate === "delete") {
                    let commentsForSinglePost = currentSinglePost.comments.findIndex((ele) => ele._id === action.payload.comment._id)

                    // // // Here deleting comment from UI ------>
                    state.singlePostdata?.comments.splice(commentsForSinglePost, 1)
                }

                else if (action.payload.whatUpadate === 'like') {
                    let commentsForSinglePost = currentSinglePost.comments.findIndex((ele) => ele._id === action.payload.comment._id)
                    state.singlePostdata?.comments.splice(commentsForSinglePost, 1, action.payload.comment)

                }


            }

        },


    },

    extraReducers: (builder) => {

        builder

            // // Get all posts 

            .addCase(getAllPosts.pending, (state) => {
                state.isLoading = true
                state.errMsg = ''
            })

            .addCase(getAllPosts.fulfilled, (state, action) => {

                // console.log(action.payload)

                if (action.payload.success === true) {

                    state.allPost = action.payload.data
                    // toast.success(`${action.payload.message}`)
                    state.isFullfilled = true

                } else {
                    toast.error(`${action.payload.message || "Fetch failed."}`)
                    state.isError = true
                    state.errMsg = action.payload.message
                }

                state.isLoading = false

            })

            .addCase(getAllPosts.rejected, (state, action) => {

                state.isLoading = false
                state.isError = true
                toast.error(` ${action.error.message || "SignUp failed"}`)
                state.errMsg = action.error.message || 'Error'
            })


            // New post

            .addCase(createNewPost.pending, (state) => {
                state.writePostFullFilled = false
                state.isLoading = true
                state.errMsg = ''
            })

            .addCase(createNewPost.fulfilled, (state, action) => {

                // console.log(action.payload)

                if (action.payload.success === true) {
                    // state.isFullfilled = true

                    state.writePostFullFilled = true


                    // state.allPost = action.payload.data
                    toast.success(`${action.payload.message}`)

                    console.log(action.payload.data)

                    state.allPost.unshift(action.payload.data)

                } else {
                    toast.error(`${action.payload.message || "Fetch failed."}`)
                    state.isError = true
                    state.errMsg = action.payload.message
                }

                state.isLoading = false

            })

            .addCase(createNewPost.rejected, (state, action) => {

                state.isLoading = false
                state.isError = true
                toast.error(` ${action.error.message || "SignUp failed"}`)
                state.errMsg = action.error.message || 'Error'
            })



        // // // some reducers that trigger by others ---->
        // .addCase("post/createNewPost/fulfilled", (state, action: PayloadAction<any, never>) => {
        //     console.log(action) 
        // })


    }
})



export const {
    setWriteFullFilledVal,
    setSinglePostId,
    setIsLoading,
    setErrMsg,
    setAllPosts,
    setSinglePostdata,
    setUpdateComment,
    // setDeleteComment
} = psotSlice.actions

export const usePostData = () => useSelector((state: RootState) => state.postReducer)

export default psotSlice.reducer





