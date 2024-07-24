'use client'

import { setModeOnLoad, toggleModeValue, useThemeData } from "@/redux/slices/ThemeSlice"
import Link from "next/link"
import { useParams, usePathname, useRouter } from "next/navigation"
// import { useRouter } from "next/router"
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
import bodyTranstion from "@/utils/routerPushWithTransition"

import { AiTwotoneMessage } from "react-icons/ai";
import { AiFillMessage } from "react-icons/ai";

/*
    Navbar should consist of these things =============>>

    Types how navbar will look like ----->
    i) For Auth (singUp, logIn, forgot pass and verify mail etc) || Logo (left) , dark btn (Right)
    ii) For User (Home , Notification , Create etc) || Logo (left), drak btn. Message (On Right)
    iii) For Profile page || Include singOut btn (on Right)
    iv) In Search page || hidden according to ui.

*/


// // // Don't remove coode from here. I Finds only way is working from here ------------>
let firstTimeRedirect = false;


const Navbar = ({ className }: { className?: string }) => {

    const params = usePathname()

    const router = useRouter()

    // const themeValue = useThemeData().value

    const themeMode = useThemeData().mode

    const dispatch = useDispatch<AppDispatch>()

    const { data: session } = useSession()

    const { userData } = useUserState()

    const [isUserLogined, setIsUserLogined] = useState(false)

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

        bodyTranstion()
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



    // console.log(firstTimeRedirect)

    // // // Redirect user to home ----------->
    useEffect(() => {
        if (!firstTimeRedirect && userData?._id && userData?.email && params === "/") {
            firstTimeRedirect = true
            router.push("/home")
        }
    }, [userData])


    return (
        <section
            style={{
                backdropFilter: "blur(5px) saturate(1.7)",
                background: "#efe6f300"
            }}
            className={`sticky -top-5 z-[12] flex justify-between items-start gap-1.5 w-full lg:w-[98%] px-2 sm:px-0 lg:px-28 py-4
                ${!themeMode ? " bg-black text-white border-zinc-700 " : " bg-white text-black border-zinc-300"}
                ${params === "/" && "!w-[100%]"}
                ${className}
            `}


        >

            <div
                className=" flex gap-1 p-[-10px] text-2xl capitalize font-[cursive] hover:cursor-pointer"
                onClick={() => goToHome()}
            >
                {/* Give logo here -----------> */}

                {
                    session?.user?.image
                    &&
                    <ImageReact
                        className=" w-8 h-8 object-cover border rounded-full aspect-square"
                        src={userData?.profilePic}
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

                <button
                    onClick={() => dispatch(toggleModeValue())}

                    className={`rounded-full text-xl h-6 hover:text-yellow-500 transition-all hover:scale-125`}
                >
                    {

                        themeMode
                            ? <span> <PiMoonStarsDuotone /> </span>
                            : <span> <PiSunDimDuotone /> </span>
                    }
                </button>


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

                            // // // If user is Logged In.
                            <div className=" flex flex-wrap  items-center justify-end gap-1.5">


                                <button
                                    onClick={() => {
                                        router.push("/message")
                                    }}

                                    className={`rounded-full -mt-1.5 text-3xl h-6 text-sky-600 transition-all hover:scale-125`}
                                >
                                    {

                                        themeMode
                                            ?
                                            <span>
                                                <AiTwotoneMessage />
                                            </span>
                                            :
                                            <span>
                                                <AiFillMessage />
                                            </span>
                                    }
                                </button>

                                {
                                    params === '/profile'
                                    &&

                                    <button
                                        onClick={() => { signOut() }}
                                        className={`border rounded-full px-2 py-0.5 text-sm font-bold transition-all hover:scale-125 ${themeMode ? " text-red-700 border-red-700 " : " border-red-300 text-red-300 "}`}
                                    >SignOut</button>
                                }
                            </div>

                    }


                </div>


            </div>

        </section >
    )
}

export default Navbar

