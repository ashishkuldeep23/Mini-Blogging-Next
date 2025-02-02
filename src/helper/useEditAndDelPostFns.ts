import { setDeleteSinglePost, setSinglePostdata, setUpdatingPost } from "@/redux/slices/PostSlice";
import { setIsLoading } from "@/redux/slices/UserSlice";
import { AppDispatch } from "@/redux/store"
import { PostInterFace, SinglePostType } from "@/Types";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux"



const useEditAndDelPostFns = (ele: SinglePostType | PostInterFace) => {
    const [showOptionPanel, setShowOptionPanel] = useState<boolean>(false);
    const { data: session } = useSession()
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const params = usePathname()
    const setLoading = (data: boolean) => dispatch(setIsLoading(data))

    const updatePostHandler = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.stopPropagation()

        // // // All dispatches here -------->
        dispatch(setSinglePostdata(ele))
        dispatch(setUpdatingPost(true))

        // // // Page navigation here  -------->
        router.push('/create')
        // // // Use with "/" (forword slash) to go somewhere --->
        // router.replace('new-post')

        setShowOptionPanel(false)

    }

    const deletePostHandler = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.stopPropagation()

        try {

            setLoading(true)

            const option: RequestInit = {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    postId: ele._id,
                    userId: session?.user?.id
                })
            }
            const response = await fetch('/api/post/delete', option)
            let json = await response.json();

            // console.log(json)

            if (json.success) {
                // dispatch(updateOnePost(json.data))
                // dispatch(setSinglePostdata(json.data))

                dispatch(setDeleteSinglePost(json.data))

                if (params.includes("post")) {
                    // router.push("/home")
                    router.back();
                }
            }

            else {
                toast.error(json.message)
            }

        } catch (e: any) {
            console.log(e)
        } finally {
            setLoading(false)
            setShowOptionPanel(false)
        }


    }


    return { deletePostHandler, updatePostHandler, showOptionPanel, setShowOptionPanel }

}

export default useEditAndDelPostFns
