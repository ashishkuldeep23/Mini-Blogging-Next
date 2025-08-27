"use client";

import {
  PayloadAction,
  createAsyncThunk,
  createSlice,
  current,
} from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import toast from "react-hot-toast";
// import { NewPostType } from "@/app/new-post/page"
import {
  MetaDataInfoType,
  NewPostType,
  PostInterFace,
  PostSliceInterFace,
  PostTypeForBackend,
  SearchObj,
  UpdateCommentInput,
} from "../../types/Types";

// // // Not using now -------->
export const getAllPosts = createAsyncThunk(
  "post/getAllPost",
  async (queryObj?: SearchObj) => {
    // console.log("dfsfdsfa")
    // // // Do here filter code ---------->

    let url = `/api/post/all?timestamp=${Date.now()}`;

    // // / Now using body to send filter data ------>

    // if (hash && hash !== '') {
    //     url = url + `&hash=${queryObj?.hash}`
    // }
    // if (category && category !== '') {
    //     url = url + `&category=${queryObj?.category}`
    // }
    // if (!hash && !category) {
    //     url = url + `&page=${page}&limit=${limit}`
    // }
    // console.log(url)

    const option: RequestInit = {
      method: "POST",
      cache: "no-store",
      next: {
        revalidate: 3,
      },
      body: JSON.stringify(queryObj || {}),
    };

    const response = await fetch(`${url}`, option);
    let json = await response.json();

    return json;
    // const response = await axios.post("/api/users/signup", body)
    // return response.data
  }
);

// // Not using now -------->
export const getCatAndHash = createAsyncThunk(
  "post/getCatAndHash",
  async () => {
    const option: RequestInit = {
      cache: "no-store",
      method: "POST",
    };
    const response = await fetch("/api/post/cathash", option);
    let data = await response.json();
    return data;
  }
);

export const createNewPost = createAsyncThunk(
  "post/createNewPost",
  async ({
    body,
    userId,
    tested,
  }: {
    body: NewPostType;
    userId: string;
    tested?: boolean;
  }) => {
    // console.log({ tested });

    let date = new Date();
    let localDate = date.toLocaleDateString("en-GB");

    let makeBody: PostTypeForBackend = {
      title: body.title || "",
      category: body.category,
      promptReturn: body.content,
      // urlOfPrompt: body.url,
      aiToolName: body.origin,
      hashthats: body.hashs,
      customize: body.customize,
      image: body.image,
      metaDataType: body.metaDataType,
      metaDataUrl: body.metaDataUrl,
      whenCreated: localDate,
      author: userId,
      tested: tested || false,
    };

    const options: RequestInit = {
      credentials: "include",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(makeBody),
    };

    const response = await fetch("/api/post", options);
    let data = await response.json();
    return data;
  }
);

export const updatePost = createAsyncThunk(
  "post/updatePost",
  async ({
    body,
    userId,
    postId,
    tested,
  }: {
    body: NewPostType;
    userId: string;
    postId: string;
    tested?: boolean;
  }) => {
    // console.log({ body })
    // console.log({ tested });

    let makeBody = {
      title: body.title,
      category: body.category,
      promptReturn: body.content,
      urlOfPrompt: body.url,
      aiToolName: body.origin,
      hashthats: body.hashs,
      customize: body.customize,
      metaDataType: body.metaDataType,
      metaDataUrl: body.metaDataUrl,
      image: body.image,
      postId: postId,
      author: userId,
      tested: tested || false,
    };

    const options: RequestInit = {
      credentials: "include",
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(makeBody),
    };

    const response = await fetch("/api/post/update", options);
    let data = await response.json();
    return data;
  }
);

export const likePost = createAsyncThunk(
  "post/likePost",
  async ({ userId, postId }: { userId: string; postId: string }) => {
    // console.log({ body })

    const options: RequestInit = {
      credentials: "include",
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        postId: postId,
        userId: userId,
      }),
    };

    const response = await fetch("/api/post/like", options);
    let data = await response.json();
    return data;
  }
);

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
    _id: "",
  },
  likes: 0,
  likesId: [],
  comments: [],
  isDeleted: false,
  customize: {
    bgColor: "",
    color: "",
    bgImage: "",
    font: "",
  },
  whenCreated: "",
  createdAt: null,
  updatedAt: null,
};

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
  searchHashAndCate: {
    hash: "",
    category: "",
    page: 1,
  },
  searchByText: "",
  isMuted: true,
  metaDataInfo: {
    id: "",
    sec: "",
  },
  recentlyDeleted: [],
};

const psotSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setWriteFullFilledVal(state, action) {
      state.writePostFullFilled = action.payload;
    },

    setSinglePostId(state, action) {
      state.singlePostId = action.payload;
    },

    setIsLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },

    setErrMsg(state, action: PayloadAction<string>) {
      state.errMsg = action.payload;
    },

    setAllPosts(state, action: PayloadAction<PostInterFace[]>) {
      state.allPost = action.payload;
    },

    setUpdatingPost(state, action: PayloadAction<boolean>) {
      state.updatingPost = action.payload;
    },

    setSinglePostdata(state, action: PayloadAction<PostInterFace>) {
      state.singlePostdata = action.payload;

      let currentState = current(state);

      let findIndex = [...currentState.allPost].findIndex(
        (ele) => ele._id === action.payload._id
      );

      // console.log(findIndex)

      state.allPost.splice(findIndex, 1, action.payload);

      state.singlePostdata = action.payload;
    },

    setDeleteSinglePost(state, action: PayloadAction<PostInterFace>) {
      state.singlePostdata = action.payload;
      let currentState = current(state);

      // let findIndex = [...currentState.allPost].findIndex(ele => ele._id === action.payload._id);
      // state.allPost.splice(findIndex, 1)

      // // // deleting from allPost data -------->>
      // state.allPost = [...currentState.allPost].filter((ele) => ele._id !== action.payload._id)

      state.recentlyDeleted = [
        action.payload._id,
        ...currentState.recentlyDeleted,
      ];
    },

    setUpdateComment(state, action: PayloadAction<UpdateCommentInput>) {
      let currentState = current(state);

      let currentSinglePost = currentState?.singlePostdata;

      if (currentSinglePost) {
        if (action.payload.whatUpadate === "update") {
          let commentsForSinglePost = currentSinglePost.comments.findIndex(
            (ele) => ele._id === action.payload.comment._id
          );
          state.singlePostdata?.comments.splice(
            commentsForSinglePost,
            1,
            action.payload.comment
          );
        } else if (action.payload.whatUpadate === "delete") {
          let commentsForSinglePost = currentSinglePost.comments.findIndex(
            (ele) => ele._id === action.payload.comment._id
          );

          // // // Here deleting comment from UI ------>
          state.singlePostdata?.comments.splice(commentsForSinglePost, 1);
        } else if (action.payload.whatUpadate === "like") {
          let commentsForSinglePost = currentSinglePost.comments.findIndex(
            (ele) => ele._id === action.payload.comment._id
          );
          state.singlePostdata?.comments.splice(
            commentsForSinglePost,
            1,
            action.payload.comment
          );
        }
      }
    },

    setSaveSinglePost(
      state,
      action: PayloadAction<{ userId: string; postId: string }>
    ) {
      state.allPost.map((ele) => {
        if (ele._id === action.payload.postId) {
          if (ele?.savedById) {
            if (ele.savedById.includes(action.payload.userId)) {
              ele.savedById = ele?.savedById.filter(
                (id) => id !== action.payload.userId
              );
            } else {
              ele.savedById = [action.payload.userId, ...ele?.savedById];
            }
          } else {
            ele.savedById = [action.payload.userId];
          }
        }
      });
    },

    setSearchBrandAndCate(
      state,
      action: PayloadAction<{ hash?: string; category?: string; page?: number }>
    ) {
      // console.log(action.payload)
      // state.searchBrandAndCate = action.payload.brand || ""
      // state.searchBrandAndCate = action.payload.category || ''

      state.searchHashAndCate = {
        hash: action.payload.hash || "",
        category: action.payload.category || "",
        page: action.payload.page || 1,
      };
    },

    setSearchByText(state, action: PayloadAction<string>) {
      state.searchByText = action.payload;
    },

    setIsMuted(state, action: PayloadAction<boolean>) {
      state.isMuted = action.payload;
    },

    setMetaDataInfo(state, action: PayloadAction<MetaDataInfoType>) {
      state.metaDataInfo = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder

      // Get all posts

      // // Now using here now ----->

      .addCase(getAllPosts.pending, (state) => {
        state.isLoading = true;
        state.errMsg = "";
        state.isFullfilled = false;
      })

      .addCase(getAllPosts.fulfilled, (state, action) => {
        // console.log(action)
        // console.log(action.payload)
        // console.log(action.payload.data);

        if (action.payload.success === true) {
          state.allPost = [...state.allPost, ...action.payload.data];
          // state.allPost.push(action.payload.data);
          // toast.success(`${action.payload.message}`)
          state.isFullfilled = true;
        } else {
          toast.error(`${action.payload.message || "Fetch failed."}`);
          state.isError = true;
          state.errMsg = action.payload.message;
        }

        state.isLoading = false;
      })

      .addCase(getAllPosts.rejected, (state, action) => {
        console.log(action);

        state.isLoading = false;
        state.isError = true;
        toast.error(` ${action.error.message || "SignUp failed"}`);
        state.errMsg = action.error.message || "Error";
      })

      .addCase(getCatAndHash.pending, (state) => {
        state.isLoading = true;
        state.errMsg = "";
      })

      .addCase(getCatAndHash.fulfilled, (state, action) => {
        // console.log(action)

        // console.log(action.payload)

        if (action.payload.success === true) {
          // state.allPost = action.payload.data
          // toast.success(`${action.payload.message}`)

          state.postCategories = action.payload.data.postCategories;
          state.posthashtags = action.payload.data.posthashtags;
          state.allPostsLength = action.payload.data.allPostsLength;

          state.isFullfilled = true;
        } else {
          toast.error(`${action.payload.message || "Fetch failed."}`);
          state.isError = true;
          state.errMsg = action.payload.message;
        }

        state.isLoading = false;
      })

      .addCase(getCatAndHash.rejected, (state, action) => {
        // console.log(action)

        state.isLoading = false;
        state.isError = true;
        toast.error(` ${action.error.message || "SignUp failed"}`);
        state.errMsg = action.error.message || "Error";
      })

      // New post

      .addCase(createNewPost.pending, (state) => {
        state.writePostFullFilled = false;
        state.isLoading = true;
        state.errMsg = "";
      })

      .addCase(createNewPost.fulfilled, (state, action) => {
        // console.log(action.payload)

        if (action.payload.success === true) {
          // state.isFullfilled = true

          state.writePostFullFilled = true;

          // state.allPost = action.payload.data
          toast.success(`${action.payload.message}`);

          // console.log(action.payload.data)

          state.allPost.unshift(action.payload.data);
        } else {
          toast.error(`${action.payload.message || "Fetch failed."}`);
          state.isError = true;
          state.errMsg = action.payload.message;
        }

        state.isLoading = false;
      })

      .addCase(createNewPost.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        toast.error(` ${action.error.message || "SignUp failed"}`);
        state.errMsg = action.error.message || "Error";
      })

      // Update post

      .addCase(updatePost.pending, (state) => {
        state.writePostFullFilled = false;
        state.isLoading = true;
        state.errMsg = "";
      })

      .addCase(updatePost.fulfilled, (state, action) => {
        // console.log(action.payload)

        if (action.payload.success === true) {
          // state.isFullfilled = true

          state.writePostFullFilled = true;

          // state.allPost = action.payload.data
          toast.success(`${action.payload.message}`);

          // // // Storing errMsg (success message in this case) bcoz using in updated post code ------>
          state.errMsg = action.payload.message;

          // console.log(action.payload.data)

          // // // set post data into single post data
          state.singlePostdata = action.payload.data;
          let currentState = current(state);

          let findIndex = [...currentState.allPost].findIndex(
            (ele) => ele._id === action.payload.data._id
          );

          state.allPost.splice(findIndex, 1, action.payload.data);


          // // // now reirect this (Apne tareeke se)


          // state.allPost.unshift(action.payload.data)
        } else {
          toast.error(`${action.payload.message || "Fetch failed."}`);
          state.isError = true;
          state.errMsg = action.payload.message;
        }

        state.isLoading = false;
      })

      .addCase(updatePost.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        toast.error(` ${action.error.message || "SignUp failed"}`);
        state.errMsg = action.error.message || "Error";
      })

      // .addCase(likePost.pending, (state) => {
      //     state.writePostFullFilled = false
      //     state.isLoading = true
      //     state.errMsg = ''
      // })

      .addCase(likePost.fulfilled, (state, action) => {
        // console.log(action.payload)

        if (action.payload.success === true) {
          // state.isFullfilled = true

          state.writePostFullFilled = true;

          // state.allPost = action.payload.data
          toast.success(`${action.payload.message}`);

          // // // Storing errMsg (success message in this case) bcoz using in updated post code ------>
          // state.errMsg = action.payload.message

          // console.log(action.payload.data)

          // // // set post data into single post data
          state.singlePostdata = action.payload.data;
          let currentState = current(state);

          let findIndex = [...currentState.allPost].findIndex(
            (ele) => ele._id === action.payload.data._id
          );

          state.allPost.splice(findIndex, 1, action.payload.data);

          // state.allPost.unshift(action.payload.data)
        } else {
          toast.error(`${action.payload.message || "Fetch failed."}`);
          state.isError = true;
          state.errMsg = action.payload.message;
        }

        state.isLoading = false;
      })

      .addCase(likePost.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        toast.error(` ${action.error.message || "SignUp failed"}`);
        state.errMsg = action.error.message || "Error";
      });

    // // // some reducers that trigger by others ---->
    // .addCase("post/createNewPost/fulfilled", (state, action: PayloadAction<any, never>) => {
    //     console.log(action)
    // })
  },
});

export const {
  setWriteFullFilledVal,
  setSinglePostId,
  setIsLoading,
  setErrMsg,
  setAllPosts,
  setSinglePostdata,
  setUpdateComment,
  setDeleteSinglePost,
  setUpdatingPost,
  setSearchBrandAndCate,
  setSearchByText,
  setIsMuted,
  setMetaDataInfo,
  setSaveSinglePost,
  // setDeleteComment
} = psotSlice.actions;

export const usePostData = () =>
  useSelector((state: RootState) => state.postReducer);

export default psotSlice.reducer;
