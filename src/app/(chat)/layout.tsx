import React from 'react'

const LayoutPage = (
    {
        children,
    }: Readonly<{
        children: React.ReactNode;
    }>
) => {
    return (
        <div>
            <div>LayoutPage</div>
            <div>{children}</div>

        </div>
    )
}

export default LayoutPage