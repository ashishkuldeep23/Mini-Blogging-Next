import { useRef, useState } from "react";


export default function useSwipeCustom(rightHandler: Function, leftHandler: Function) {


    // const [swipeDirection, setSwipeDirection] = useState<'right' | 'left' | null>(null);
    const touchStartX = useRef<number | null>(null);
    const touchEndX = useRef<number | null>(null);
    const isTouching = useRef<boolean>(false);


    const minSwipeDistance = 50; // Minimum distance for a swipe


    // // // Custome mouse move events --------------->

    const onTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.touches[0].clientX;
    };

    const onTouchMove = (e: React.TouchEvent) => {
        touchEndX.current = e.touches[0].clientX;
    };

    const onTouchEnd = () => {
        handleSwipe();
    };


    const onMouseDown = (e: React.MouseEvent) => {
        touchStartX.current = e.clientX;
        isTouching.current = true;
    };

    const onMouseMove = (e: React.MouseEvent) => {
        if (isTouching.current) {
            touchEndX.current = e.clientX;
        }
    };

    const onMouseUp = () => {
        if (isTouching.current) {
            handleSwipe();
            isTouching.current = false;
        }
    };


    const handleSwipe = () => {
        if (touchStartX.current !== null && touchEndX.current !== null) {
            const distance = touchEndX.current - touchStartX.current;
            if (Math.abs(distance) > minSwipeDistance) {

                // // // here we can call our fn() to get actions -------->

                if (distance > 0) {

                    rightHandler();
                    // setSwipeDirection('right')
                } else {

                    leftHandler();
                    // setSwipeDirection("left")
                }
            }
            // else {
            //     setSwipeDirection(null);
            // }
        }
        touchStartX.current = null;
        touchEndX.current = null;
    };


    return { onTouchStart, onTouchMove, onTouchEnd, onMouseDown, onMouseMove, onMouseUp }
}

