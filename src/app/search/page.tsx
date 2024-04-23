'use client'
import { useThemeData } from '@/redux/slices/ThemeSlice'
import { useRouter } from 'next/navigation'
import React, { useEffect, useRef, useState } from 'react'
import { MdOutlineArrowBackIosNew } from "react-icons/md";



const SearchPage = () => {

    const themeMode = useThemeData().mode

    const router = useRouter()

    const searchInputRef = useRef<HTMLInputElement>(null)


    const [searchText, setSearchText] = useState<string>("")



    function onChangeHandler(e: React.ChangeEvent<HTMLInputElement>) {
        setSearchText(e.target.value)

    }


    function hardSearchHandler(e: React.KeyboardEvent<HTMLInputElement> | React.MouseEvent<HTMLButtonElement, MouseEvent>) {

    }



    useEffect(() => {

        if (searchInputRef) {
            searchInputRef.current?.focus()
        }

    }, [])


    return (
        <>

            <div
                className={`
                     px-2 py-2 w-full min-h-[100vh] 
                    ${!themeMode ? "bg-black text-white" : "text-black bg-white"}    
                `}
            >


                <div className=' flex flex-col justify-center items-center gap-1  mt-2 relative'>

                    <div className=' w-full flex justify-center items-center gap-1 ' >

                        <button
                            className={`border rounded-full  py-1 p-0.5 font-bold shadow-lg capitalize
                            ${!themeMode ? "text-white/50 bg-black shadow-slate-700 border-slate-700 " : "text-black/50 bg-white shadow-slate-300 border-slate-300 "}
                        `}
                            onClick={() => router.back()}
                        >
                            <MdOutlineArrowBackIosNew />

                        </button>

                        <input
                            name="Search Input"
                            type="text"
                            className={`p-0.5 px-2 font-bold w-11/12 sm:w-4/6 rounded-full shadow-lg  border 
                                  ${!themeMode ? "text-white bg-black shadow-slate-700 border-slate-700 " : "text-black bg-white shadow-slate-300 border-slate-300 "}
                            `}
                            placeholder="Search here."
                            ref={searchInputRef}
                            value={searchText}
                            onChange={(e) => (onChangeHandler(e))}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    hardSearchHandler(e)
                                }
                            }}
                        />

                    </div>

                    <div className=' w-11/12 sm:w-4/6 mt-1'>
                        <p
                            className={`text-xs text-opacity-50 text-start ml-5
                            ${!themeMode ? "text-white/50 " : "text-black/50 "}
                        `}
                        >
                            <span>Search for </span>
                            <span className={`font-semibold ${!themeMode ? "text-white/70 " : "text-black/70 "}`}>Accounts</span>
                            <span> (by name or email) or </span>
                            <span className={`font-semibold ${!themeMode ? "text-white/70 " : "text-black/70 "}`} >Posts</span>
                            <span> (by category , hashtags or title) above ☝️</span>
                        </p>
                    </div>



                    <div
                        className={`
                            min-h-[40vh] px-2 py-1 rounded w-[99.8%] sm:w-[70%] absolute top-[9vh] 
                            ${!themeMode ? "bg-black text-white" : "text-black bg-white"}   
                        `}

                    >
                        <p className=' border-b my-0.5 '>Seggetion Div</p>
                        <p>Seggetion Div</p>
                        <p>Seggetion Div</p>
                        <p>Seggetion Div</p>
                        <p>Seggetion Div</p>
                        <p>Seggetion Div</p>
                        <p>Seggetion Div</p>
                        <p>Seggetion Div</p>



                        <button
                            className='w-full mt-5 text-sm text-blue-500 text-center sm:text-start ml-0 sm:ml-40'
                        >See all results</button>

                    </div>



                </div>






            </div>

        </>
    )
}

export default SearchPage

