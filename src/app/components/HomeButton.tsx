'use client'
import Link from 'next/link'
import React from 'react'

const HomeButton = () => {
    return (
        <Link className=' fixed top-2 left-2 border rounded p-2 ' href={"/"}>🏠</Link>
    )
}

export default HomeButton

