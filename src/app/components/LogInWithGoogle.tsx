'use client'

import { useThemeData } from "@/redux/slices/ThemeSlice"


import { signIn, useSession, getProviders } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Fragment, useEffect, useState } from "react"


const LogInWithGoogle = () => {

    const themeMode = useThemeData().mode

    const { data: session } = useSession()

    const router = useRouter()

    const [provider, setProvider] = useState<any>(null)


    useEffect(() => {

        const setProviders = async () => {

            const allAuthProviders = await getProviders()

            console.log(allAuthProviders)

            setProvider(allAuthProviders)
        }

        setProviders();

    }, [])



    useEffect(() => {

        if (session) {
            router.push("/")
        }

    }, [session])



    return (
        <div className=" flex flex-col items-center justify-center w-60">

            {/* <div className=" w-full flex justify-center border-b-2 relative bg-red-500">
            <p className=" absolute -top-1/2 left-5 -top-8 bg-green-500">OR</p>
        </div> */}

            <div className=" w-full flex justify-center">
                <p className=" border-b-2 w-full text-center relative">
                    <span className={` ${!themeMode ? " bg-black" : " bg-white"} relative top-1/2 px-1`}>OR</span>
                </p>
            </div>

            {/* <div className=" mt-2.5">
                <p className=" px-2 rounded bg-red-500 text-white font-bold">Google</p>
            </div> */}



            {
                provider && Object.values(provider).map((prov: any, i) => {

                    if (prov?.name === "Password") return <Fragment key={i}></Fragment>

                    return (
                        <button
                            type='button'
                            key={i}
                            onClick={() => {
                                // console.log(prov)
                                signIn(prov.id)
                            }}
                        >
                            <p
                                className={` mt-2.5 px-2 rounded text-white font-bold ${prov.id === "google" ? "bg-red-500" : "bg-blue-500"}`}
                            >{prov?.name}</p>
                        </button>
                    )
                })
            }


        </div >
    )
}

export default LogInWithGoogle