import React, { useState } from "react";
import { FiLoader } from "react-icons/fi";

const ImageReact = ({
  src,
  className,
  alt,
  width,
  onMouseMove,
  style,
  onClick,
}: {
  src: string;
  className?: string;
  alt?: string;
  width?: number;
  height?: number;
  onMouseMove?: React.MouseEventHandler<HTMLImageElement> | undefined;
  style?: object;
  onClick?: Function;
}) => {
  const [isLoaded, setIsLoaded] = useState<Boolean>(false);

  // console.log(style)
  // console.log(className)

  return (
    <>
      <span
        onContextMenu={(e) => e?.preventDefault()}
        className={className}
        style={{ display: isLoaded ? "none" : "inline", margin: "0.25rem" }}
      >
        <FiLoader />
      </span>

      <img
        onContextMenu={(e) => e?.preventDefault()}
        onClick={(e: any | React.MouseEvent<HTMLImageElement, MouseEvent>) => {
          onClick && onClick(e);
        }}
        width={width}
        src={src?.replace(/^http:\/\//i, "https://")}
        alt={alt || ""}
        className={`${className} `}
        style={{
          ...style,
          display: isLoaded ? "inline" : "none",
        }}
        onLoad={() => setIsLoaded(true)}
        onError={({ currentTarget }) => {
          currentTarget.onerror = null; // prevents looping
          currentTarget.src =
            "https://res.cloudinary.com/dlvq8n2ca/image/upload/v1717510373/yqrqev3nq8yrbdkct3no.jpg";
        }}
        onMouseMove={onMouseMove}
      />
    </>
  );
};

export default ImageReact;
