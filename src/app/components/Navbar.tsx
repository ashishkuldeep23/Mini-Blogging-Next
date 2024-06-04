'use client'

import { setModeOnLoad, toggleModeValue, useThemeData } from "@/redux/slices/ThemeSlice"
import Link from "next/link"
import { useParams, usePathname } from "next/navigation"
// import { useRouter } from "next/router"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"

import { useSession, signOut } from "next-auth/react"
import Image from "next/image"
import { getUserData, setUserDataBySession, useUserState } from "@/redux/slices/UserSlice"
import ImageReact from "./ImageReact"
import { getCatAndHash } from "@/redux/slices/PostSlice"
import { AppDispatch } from "@/redux/store"
import { PiSunDimDuotone } from "react-icons/pi";
import { PiMoonStarsDuotone } from "react-icons/pi";



const Navbar = () => {

    const params = usePathname()

    const router = useRouter()

    // const themeValue = useThemeData().value

    const themeMode = useThemeData().mode

    const dispatch = useDispatch<AppDispatch>()

    const { data: session } = useSession()

    const { userData } = useUserState()

    const [isUserLogined, setIsUserLogined] = useState(true)

    const [isUserOnHaome, setIsUserOnHome] = useState<boolean>(false)



    // console.log(session)


    function goToHome() {
        // alert("dfsdfsdagsd")

        // console.log(params)

        if (isUserOnHaome) {
            router.push(`/profile/${session?.user?.id}`)
        } else {
            router.push("/")
        }

    }



    useEffect(() => {

        if (params === "/") setIsUserOnHome(true);
        else setIsUserOnHome(false);


    }, [params])


    // console.log(status)

    // // // Get and set user data from server -------->
    useEffect(() => {
        setIsUserLogined(!!session)
        // console.log(session)

        // console.log({ session })

        if (session) {

            let user = session.user

            dispatch(setUserDataBySession({ ...user }))
        }

        // // // get user data by api (All Data) ----------->
        if (session && (!userData.friendsAllFriend || !userData.sendRequest || !userData.reciveRequest)) {
            dispatch(getUserData(session?.user._id))
        }

    }, [session])



    useEffect(() => {
        let getPrivousThemeValue = localStorage.getItem("authNextDark")
        if (getPrivousThemeValue) {
            getPrivousThemeValue = JSON.parse(getPrivousThemeValue)

            // console.log(getPrivousThemeValue)
            dispatch(setModeOnLoad({ mode: getPrivousThemeValue }))
        }
    }, [])



    // // // Get category and hashtags ------->
    useEffect(() => {

        dispatch(getCatAndHash())

    }, [])



    return (
        <section
            style={{
                backdropFilter: "blur(5px) saturate(1.7)",
                background: "#efe6f300"
            }}
            className={`sticky -top-4 z-[2] flex justify-between items-start gap-1.5 w-full px-2 sm:px-10 py-4 ${!themeMode ? " bg-black text-white border-zinc-700 " : " bg-white text-black border-zinc-300"}`}

        >

            <div
                className=" flex gap-1 p-[-10px] text-2xl capitalize font-[cursive] hover:cursor-pointer"
                onClick={() => goToHome()}
            >
                {
                    session?.user?.image
                    &&
                    <ImageReact
                        className=" w-8 h-8 object-cover border rounded-full aspect-square"
                        src={userData.profilePic}
                        alt=""
                    />
                }

                <p className=" ml-0.5 mt-[-2px] font-bold">
                    {
                        !isUserOnHaome
                            ? "Home"
                            // : `Profile(${session?.user?.name?.toString() || "Name"})`
                            : `Profile`
                    }
                </p>

            </div>

            <div className=" flex items-center justify-end flex-wrap gap-2 pt-1 ">


                <div>
                    {


                        !isUserLogined
                            ?

                            <div className=" flex flex-wrap  justify-end gap-1">
                                <Link
                                    href={"/signup"}
                                    className={` border rounded-full px-2 py-0.5 text-sm font-bold ${themeMode ? " bg-black border-black text-white " : " border-white bg-white text-black"}`}
                                >SignUp</Link>
                                <Link
                                    href={"/login"}
                                    className={`border rounded-full px-2 py-0.5 text-sm font-bold ${themeMode ? "border-black " : " border-white "}`}
                                >LogIn</Link>
                            </div>

                            :

                            <div className=" flex flex-wrap  justify-end gap-1">
                                <button
                                    onClick={() => { router.push("/new-post") }}

                                    className={` border rounded-full px-2 py-0.5 text-sm font-bold ${themeMode ? " bg-black border-black text-white " : " border-white bg-white text-black"}`}
                                >Create Post</button>
                                <button
                                    onClick={() => { signOut() }}
                                    className={`border rounded-full px-2 py-0.5 text-sm font-bold ${themeMode ? "border-red-900 " : " border-red-100 "}`}
                                >SignOut</button>
                            </div>

                    }


                </div>

                <button
                    onClick={() => {

                        // console.log("dasdff")

                        // let newValue = (themeValue === "black") ? true : false

                        dispatch(toggleModeValue())

                        // setIsUserLogined(!isUserLogined)

                    }}

                    className={`rounded-full text-xl h-6 hover:text-yellow-500`}
                >
                    {

                        themeMode
                            ? <span> <PiMoonStarsDuotone /> </span>
                            : <span> <PiSunDimDuotone /> </span>
                    }
                </button>

            </div>

        </section >
    )
}

export default Navbar

