import {
  setDeleteSinglePost,
  setSaveSinglePost,
  setSinglePostdata,
  setUpdatingPost,
} from "@/redux/slices/PostSlice";
import { setIsLoading, setSavedPostData } from "@/redux/slices/UserSlice";
import { AppDispatch } from "@/redux/store";
import {
  PostInterFace,
  SavedPostDataType,
  SinglePostType,
} from "../types/Types";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setCloseMoadal } from "@/redux/slices/ModalSlice";

const useEditAndDelPostFns = (ele: SinglePostType | PostInterFace | null) => {
  const [showOptionPanel, setShowOptionPanel] = useState<boolean>(false);
  const { data: session } = useSession();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const params = usePathname();
  const setLoading = (data: boolean) => dispatch(setIsLoading(data));

  const updatePostHandler = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.stopPropagation();

    if (!ele) {
      toast.error("Post not found!");
      return;
    }

    // // // All dispatches here -------->
    dispatch(setSinglePostdata(ele));
    dispatch(setUpdatingPost(true));

    // // // Page navigation here  -------->
    router.push("/create");
    // // // Use with "/" (forword slash) to go somewhere --->
    // router.replace('new-post')

    setShowOptionPanel(false);
  };

  const deletePostHandler = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.stopPropagation();

    if (!ele) {
      toast.error("Post not found!");
      return;
    }

    try {
      setLoading(true);

      const option: RequestInit = {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postId: ele._id,
          userId: session?.user?.id,
        }),
      };
      const response = await fetch("/api/post/delete", option);
      let json = await response.json();
      if (json.success) {
        // dispatch(updateOnePost(json.data))
        // dispatch(setSinglePostdata(json.data))

        dispatch(setDeleteSinglePost(json.data));

        if (params.includes("post")) {
          // router.push("/home")
          router.back();
        }
      } else {
        toast.error(json.message);
      }
    } catch (e: any) {
      console.log(e);
    } finally {
      setLoading(false);
      setShowOptionPanel(false);
    }
  };

  const savePostHandler = async (saveKey: string) => {
    try {
      setLoading(true);

      if (!ele) {
        toast.error("Post not found!");
        return;
      }

      const options: RequestInit = {
        credentials: "include",
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          postId: ele._id,
          userId: session?.user?._id,
          saveKey: saveKey || session?.user?.name || "default",
        }),
      };

      const response = await fetch("/api/post/save", options);
      let json = await response.json();
      if (json.success) {
        if (session)
          dispatch(
            setSaveSinglePost({ userId: session?.user?._id, postId: ele._id })
          );
      } else {
        toast.error(json.message);
      }
    } catch (e: any) {
      console.log(e);
    } finally {
      dispatch(setCloseMoadal());

      setTimeout(() => {
        setLoading(false);
        setShowOptionPanel(false);
      }, 100);
    }
  };

  const savePostDeleteHandler = async (postId: string) => {
    try {
      setLoading(true);

      const options: RequestInit = {
        credentials: "include",
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          postId: postId,
          userId: session?.user?._id,
        }),
      };

      const response = await fetch("/api/post/save", options);
      let json = await response.json();
      if (json.success) {
        // dispatch(updateOnePost(json.data))
        // dispatch(setSinglePostdata(json.data))
        // console.log(json);

        if (session)
          dispatch(
            setSaveSinglePost({ userId: session?.user?._id, postId: postId })
          );

        // // // hide modal now and clear the inner html here ------->>
      } else {
        toast.error(json.message);
      }
    } catch (e: any) {
      console.log(e);
    } finally {
      setLoading(false);
      setShowOptionPanel(false);
    }
  };

  const divClickHandler = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    event?.stopPropagation();
    setShowOptionPanel(false);
  };

  return {
    deletePostHandler,
    updatePostHandler,
    showOptionPanel,
    setShowOptionPanel,
    savePostHandler,
    savePostDeleteHandler,
    divClickHandler,
  };
};

export default useEditAndDelPostFns;
