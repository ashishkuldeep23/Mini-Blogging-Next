// import React from 'react'

"use client";

import { MdZoomOutMap } from "react-icons/md";
import ImageReact from "./ImageReact";
import { PostInterFace, TypeHeight } from "../../../types/Types";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const ImageForPostCard: React.FC<{
  height: TypeHeight;
  ele: PostInterFace;
  zoomImageHandler: (e: React.MouseEvent<SVGElement, MouseEvent>) => void;
}> = ({ height, ele, zoomImageHandler }) => {
  return (
    <div className="relative">
      <ImageReact
        className={`w-full my-2 rounded !object-top !object-cover transition-all duration-300 ${height} `}
        src={ele.metaDataUrl || ""}
        onClick={(e: any) => {
          e?.stopPropagation();
        }}
      />
      <MdZoomOutMap
        onClick={zoomImageHandler}
        className=" absolute bottom-4 right-2 text-xl active:scale-75 transition-all "
      />
    </div>
  );
};

export default ImageForPostCard;
