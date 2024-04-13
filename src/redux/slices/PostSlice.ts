'use client'

import { PayloadAction, createAsyncThunk, createSlice, current } from "@reduxjs/toolkit"
import { useSelector } from "react-redux"
import { RootState } from "../store"
import toast from "react-hot-toast"
import { NewPostType } from "@/app/new-post/page"
import { UserDataInterface } from "./UserSlice"


// // // Not using now -------->
// export const getAllPosts = createAsyncThunk('post/getAllPost', async () => {
//     const option: RequestInit = {
//         cache: 'no-store'
//     }
//     const response = await fetch('/api/post/all', option)
//     let data = await response.json();
//     return data
//     // const response = await axios.post("/api/users/signup", body)
//     // return response.data
// })



// // Not using now -------->
export const getCatAndHash = createAsyncThunk('post/getCatAndHash', async () => {
    const option: RequestInit = {
        cache: 'no-store',
        method: "POST"
    }
    const response = await fetch('/api/post/cathash', option)
    let data = await response.json();
    return data
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


// interface UpdatePostBody extends NewPostType {
//     postId: string
// }


export const updatePost = createAsyncThunk("post/updatePost", async ({ body, userId, postId }: { body: NewPostType, userId: string, postId: string }) => {

    let makeBody = {
        title: body.title,
        category: body.category,
        promptReturn: body.content,
        urlOfPrompt: body.url,
        aiToolName: body.origin,
        hashthats: body.hashs,
        author: userId,
        postId: postId
    }


    const options: RequestInit = {
        credentials: 'include',
        method: "PUT",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(makeBody)
    }


    const response = await fetch('/api/post/update', options)
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
        isAdmin: boolean,
        _id: string
    }
    likes: 0,
    // likesId: UserDataInterface[]|string[],
    likesId: Array<string | UserDataInterface>,
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
    updatingPost: boolean,
    singlePostdata?: PostInterFace
    postCategories: string[],
    posthashtags: string[],
    allPostsLength: number
}



const innitialSingleState: PostInterFace = {

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
        isAdmin: false,
        _id: ""

    },
    likes: 0,
    likesId: [],
    comments: [],
    isDeleted: false
}


const initialState: PostSliceInterFace = {
    isLoading: false,
    isFullfilled: false,
    writePostFullFilled: false,
    isError: false,
    errMsg: "",
    allPost: [],
    singlePostId: "",
    updatingPost: false,
    singlePostdata: innitialSingleState,
    postCategories: [],
    posthashtags: [],
    allPostsLength: 0,
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

        setUpdatingPost(state, action: PayloadAction<boolean>) {
            state.updatingPost = action.payload
        },

        setSinglePostdata(state, action: PayloadAction<PostInterFace>) {
            state.singlePostdata = action.payload


            let currentState = current(state)

            let findIndex = [...currentState.allPost].findIndex(ele => ele._id === action.payload._id)

            // console.log(findIndex)

            state.allPost.splice(findIndex, 1, action.payload)

            state.singlePostdata = action.payload


        },

        setDeleteSinglePost(state, action: PayloadAction<PostInterFace>) {
            state.singlePostdata = action.payload


            let currentState = current(state)

            let findIndex = [...currentState.allPost].findIndex(ele => ele._id === action.payload._id)

            // console.log(findIndex)

            state.allPost.splice(findIndex, 1)


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

            // // // Now using here now ----->

            // .addCase(getAllPosts.pending, (state) => {
            //     state.isLoading = true
            //     state.errMsg = ''
            // })

            // .addCase(getAllPosts.fulfilled, (state, action) => {

            //     console.log(action)


            //     // console.log(action.payload)

            //     if (action.payload.success === true) {

            //         state.allPost = action.payload.data
            //         // toast.success(`${action.payload.message}`)
            //         state.isFullfilled = true

            //     } else {
            //         toast.error(`${action.payload.message || "Fetch failed."}`)
            //         state.isError = true
            //         state.errMsg = action.payload.message
            //     }

            //     state.isLoading = false

            // })

            // .addCase(getAllPosts.rejected, (state, action) => {

            //     console.log(action)


            //     state.isLoading = false
            //     state.isError = true
            //     toast.error(` ${action.error.message || "SignUp failed"}`)
            //     state.errMsg = action.error.message || 'Error'
            // })

            .addCase(getCatAndHash.pending, (state) => {
                state.isLoading = true
                state.errMsg = ''
            })

            .addCase(getCatAndHash.fulfilled, (state, action) => {

                // console.log(action)


                // console.log(action.payload)

                if (action.payload.success === true) {

                    // state.allPost = action.payload.data
                    // toast.success(`${action.payload.message}`)


                    state.postCategories = action.payload.data.postCategories
                    state.posthashtags = action.payload.data.posthashtags
                    state.allPostsLength = action.payload.data.allPostsLength

                    state.isFullfilled = true

                } else {
                    toast.error(`${action.payload.message || "Fetch failed."}`)
                    state.isError = true
                    state.errMsg = action.payload.message
                }

                state.isLoading = false

            })

            .addCase(getCatAndHash.rejected, (state, action) => {

                // console.log(action)

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

                    // console.log(action.payload.data)

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


            // Update post

            .addCase(updatePost.pending, (state) => {
                state.writePostFullFilled = false
                state.isLoading = true
                state.errMsg = ''
            })

            .addCase(updatePost.fulfilled, (state, action) => {

                // console.log(action.payload)

                if (action.payload.success === true) {
                    // state.isFullfilled = true

                    state.writePostFullFilled = true

                    // state.allPost = action.payload.data
                    toast.success(`${action.payload.message}`)

                    // console.log(action.payload.data)


                    state.singlePostdata = action.payload.data
                    let currentState = current(state)

                    let findIndex = [...currentState.allPost].findIndex(ele => ele._id === action.payload.data._id)

                    state.allPost.splice(findIndex, 1, action.payload.data)

                    state.singlePostdata = action.payload.data



                    // state.allPost.unshift(action.payload.data)

                } else {
                    toast.error(`${action.payload.message || "Fetch failed."}`)
                    state.isError = true
                    state.errMsg = action.payload.message
                }

                state.isLoading = false

            })

            .addCase(updatePost.rejected, (state, action) => {

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
    setDeleteSinglePost,
    setUpdatingPost
    // setDeleteComment
} = psotSlice.actions

export const usePostData = () => useSelector((state: RootState) => state.postReducer)

export default psotSlice.reducer





