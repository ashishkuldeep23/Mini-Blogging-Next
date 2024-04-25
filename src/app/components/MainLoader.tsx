'use client'


import React from 'react'

import "@/app/components/styleForComps.css"
import { useThemeData } from '@/redux/slices/ThemeSlice'


const MainLoader = ({ isLoading = false, className }: { isLoading: boolean, className?: string }) => {

    const themeMode = useThemeData().mode

    return (
        <>

            {
                isLoading
                &&

                // <div className=' relative'>

                <span
                    id="main_loader"
                    className={`z-20 scale-150 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-[45deg]  ${!themeMode ? " text-white" : " text-black"}  ${className} `}
                ></span>

                // </div>

            }

        </>
    )
}

export default MainLoader