import React from 'react'
import Navbar from '../components/Navbar';

const LayoutPage = (
    {
        children,
    }: Readonly<{
        children: React.ReactNode;
    }>
) => {
    return (
        <div>

            <Navbar />

            <div>LayoutPage</div>
            <div>{children}</div>

        </div>
    )
}

export default LayoutPage