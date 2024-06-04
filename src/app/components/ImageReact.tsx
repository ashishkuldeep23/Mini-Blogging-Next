
import React from 'react'

const ImageReact = ({
    src,
    className,
    alt,
    width,
    onMouseMove,
    style,
    onClick
}: {
    src: string,
    className?: string,
    alt?: string,
    width?: number,
    height?: number
    onMouseMove?: React.MouseEventHandler<HTMLImageElement> | undefined,
    style?: object
    onClick?: Function
}) => {


    // console.log(style)
    // console.log(className)



    return (
        <img
            onClick={() => { onClick && onClick() }}
            width={width}
            src={src}
            alt={alt || "img"}
            className={className}
            style={style}
            onError={({ currentTarget }) => {
                currentTarget.onerror = null; // prevents looping
                currentTarget.src = "https://res.cloudinary.com/dlvq8n2ca/image/upload/v1717510373/yqrqev3nq8yrbdkct3no.jpg";
            }}
            onMouseMove={onMouseMove}
        />
    )
}

export default ImageReact
