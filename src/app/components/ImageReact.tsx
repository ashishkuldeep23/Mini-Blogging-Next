
import React from 'react'

const ImageReact = ({
    src,
    className,
    alt,
    width,
    onMouseMove,
    style
}: {
    src: string,
    className?: string,
    alt?: string,
    width?: number,
    height?: number
    onMouseMove?: React.MouseEventHandler<HTMLImageElement> | undefined,
    style?: object
}) => {
    return (
        <img
            width={width}
            src={src}
            alt={alt}
            className={className}
            style={style}
            onError={({ currentTarget }) => {
                currentTarget.onerror = null; // prevents looping
                currentTarget.src = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRwV9k8Uxfa2bIUN1C5bybUsLeU2Ik2YDkAZlp3QYoedLj3QyJfkGs6r51MCrtpCEAlR2Y&usqp=CAU";
            }}
            onMouseMove={onMouseMove}
        />
    )
}

export default ImageReact
