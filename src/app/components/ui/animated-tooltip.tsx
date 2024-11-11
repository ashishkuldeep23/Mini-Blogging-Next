"use client";
import React, { useState } from "react";


import {
    motion,
    useTransform,
    useMotionValue,
    useSpring,
} from "framer-motion";
import { useThemeData } from "@/redux/slices/ThemeSlice";
import ImageReact from "../ImageReact";



export default function AnimatedTooltip({
    items
}: {
    items: {
        id: number;
        name: string;
        designation: string;
        image: string;
        onClickFunction?: Function;
    }[];

}) {

    const themeMode = useThemeData().mode

    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const springConfig = { stiffness: 100, damping: 5 };
    const x = useMotionValue(0); // going to set this value on mouse move
    // rotate the tooltip
    const rotate = useSpring(
        useTransform(x, [-100, 100], [-45, 45]),
        springConfig
    );
    // translate the tooltip
    const translateX = useSpring(
        useTransform(x, [-100, 100], [-50, 50]),
        springConfig
    );
    const handleMouseMove = (event: any) => {
        const halfWidth = event.target.offsetWidth / 2;
        x.set(event.nativeEvent.offsetX - halfWidth); // set the x value, which is then used in transform and rotate
    };

    return (
        <>
            {items.map((item, idx) => (
                <div
                    className={`-mr-4 relative group hover:cursor-pointer focus:scale-75 `}
                    key={item.name}
                    onMouseEnter={() => setHoveredIndex(item.id)}
                    onMouseLeave={() => setHoveredIndex(null)}


                    onClick={() => {
                        if (item?.onClickFunction) {
                            item.onClickFunction()
                        }
                    }}

                >
                    {hoveredIndex === item.id && (
                        <motion.div
                            initial={{ opacity: 0, y: 20, scale: 0 }}
                            animate={{
                                opacity: 1,
                                y: 0,
                                scale: 1,
                                transition: {
                                    type: "spring",
                                    stiffness: 260,
                                    damping: 10,
                                },
                            }}
                            exit={{ opacity: 0, y: 20, scale: 0 }}
                            style={{
                                translateX: translateX,
                                rotate: rotate,
                                whiteSpace: "nowrap",
                                backdropFilter: "blur(5px) saturate(1.7)",
                                background: "#efe6f321"
                            }}
                            className={`absolute -top-16 -left-1/2 translate-x-1/2 flex text-xs  flex-col items-center justify-center rounded-md bg-black z-50 shadow-xl px-4 py-2 border border-cyan-500 ${!themeMode ? "text-white" : "text-black"} `}
                        >
                            <div className="absolute inset-x-10 z-30 w-[20%] -bottom-px bg-gradient-to-r from-transparent via-emerald-500 to-transparent h-px " />
                            <div className="absolute left-10 w-[40%] z-30 -bottom-px bg-gradient-to-r from-transparent via-sky-500 to-transparent h-px " />
                            <div className=" capitalize font-bold relative z-30 text-base">
                                {item.name}
                            </div>
                            <div className=" text-xs font-semibold">{item.designation}</div>
                        </motion.div>
                    )}

                    <motion.div
                        className=" inline-flex "
                        initial={{ opacity: 0, y: 20, scale: 0 }}
                        animate={{
                            opacity: 1,
                            y: 0,
                            scale: 1,
                            transition: {
                                type: "spring",
                                stiffness: 260,
                                damping: 10,
                            },
                        }}
                        exit={{ opacity: 0, y: 20, scale: 0 }}

                    >


                        <ImageReact
                            src={item.image}
                            className="object-cover !m-0 !p-0 rounded-full h-12 w-12 border-2 group-hover:scale-105 group-hover:!z-30 border-white relative transition duration-500"
                            alt={item.name}
                            onMouseMove={handleMouseMove}
                            height={100}
                            width={100}
                        />

                    </motion.div>

                </div>
            ))}
        </>
    );
};
