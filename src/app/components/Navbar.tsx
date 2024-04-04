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
import { setUserDataBySession } from "@/redux/slices/UserSlice"
import ImageReact from "./ImageReact"




const Navbar = () => {

    // const themeValue = useThemeData().value

    const themeMode = useThemeData().mode

    const dispatch = useDispatch()

    const { data: session } = useSession()

    const [isUserLogined, setIsUserLogined] = useState(true)

    const params = usePathname()

    const router = useRouter()


    // console.log(session)


    function goToHome() {
        // alert("dfsdfsdagsd")

        // console.log(params)

        if (params === '/') {
            router.push(`/profile/${session?.user?.id}`)
        } else {
            router.push("/")
        }

    }


    // console.log(status)

    useEffect(() => {
        setIsUserLogined(!!session)
        // console.log(session)

        // console.log({ session })

        if (session) {

            let user = session.user

            dispatch(setUserDataBySession({ ...user }))
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




    return (
        <section className={` border-b sticky -top-4 z-[2] flex justify-between items-center w-full px-2 sm:px-10 py-4 ${!themeMode ? " bg-black text-white border-zinc-700 " : " bg-white text-black border-zinc-300"}`}>

            <div
                className=" flex gap-1 p-[-10px] text-2xl capitalize font-[cursive] hover:cursor-pointer"
                onClick={() => goToHome()}
            >
                {
                    session?.user?.image
                    &&
                    <ImageReact
                        className=" w-8 border rounded-full"
                        src={session?.user?.image?.toString()}
                        alt=""
                        width={"10px"}
                    />
                }

                <p>Home</p>

            </div>

            <div className=" flex items-center flex-wrap gap-2 ">


                <div>
                    {


                        !isUserLogined
                            ?

                            <div className=" flex flex-wrap gap-1">
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

                            <div className=" flex flex-wrap gap-1">
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

                    className={`border rounded-full text-xs h-6 ${themeMode ? " border-black" : " border-white"}`}
                >
                    {

                        themeMode ? "🌛" : "🌞"
                    }
                </button>

            </div>

        </section>
    )
}

export default Navbar

