'use client'

import React from 'react'
import MaskerText from "@/app/components/MaskerText"

const page = () => {
    return (
        <div className=' h-screen w-full flex flex-col flex-wrap items-center mt-[30vh] text-center'>
            <p>Post not Found.</p>
            <p>Post id is not given or invalid.</p>
            <p className=' text-2xl'>404</p>
        </div>
    )
}

export default page