
import React from 'react'

const ImageReact = ({ src, className, alt, width }: { className?: string, src: string, alt?: string, width?: string }) => {
    return (
        <img
            width={width}
            src={src}
            alt={alt}
            className={className}
            onError={({ currentTarget }) => {
                currentTarget.onerror = null; // prevents looping
                currentTarget.src = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRwV9k8Uxfa2bIUN1C5bybUsLeU2Ik2YDkAZlp3QYoedLj3QyJfkGs6r51MCrtpCEAlR2Y&usqp=CAU";
            }}
        />
    )
}

export default ImageReact
