

// import React from 'react'
"use client"

import { SessionProvider } from "next-auth/react"


const LogInProvider = ({ children, session }: any) => {
    return (
        <SessionProvider session={session}>
            {
                children
            }
        </SessionProvider>
    )
}

export default LogInProvider
