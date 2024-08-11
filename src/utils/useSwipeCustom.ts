import { useRef } from "react";


export default function useSwipeCustom(rightHandler: Function, leftHandler: Function, upHandler?: Function, downHandler?: Function) {


    // const [swipeDirection, setSwipeDirection] = useState<'right' | 'left' | null>(null);
    const touchStartX = useRef<number | null>(null);
    const touchEndX = useRef<number | null>(null);
    const touchStartY = useRef<number | null>(null);
    const touchEndY = useRef<number | null>(null);
    const isTouching = useRef<boolean>(false);


    const minSwipeDistance = 50; // Minimum distance for a swipe


    // // // Custome mouse move events --------------->

    const onTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.touches[0].clientX;
        touchStartY.current = e.touches[0].clientY;
    };

    const onTouchMove = (e: React.TouchEvent) => {
        touchEndX.current = e.touches[0].clientX;
        touchEndY.current = e.touches[0].clientY;
    };

    const onTouchEnd = () => {
        handleSwipe();
    };

    const onMouseDown = (e: React.MouseEvent) => {
        touchStartX.current = e.clientX;
        touchStartY.current = e.clientY;
        isTouching.current = true;
    };

    const onMouseMove = (e: React.MouseEvent) => {
        if (isTouching.current) {
            touchEndX.current = e.clientX;
            touchEndY.current = e.clientY;
        }
    };

    const onMouseUp = () => {
        if (isTouching.current) {
            handleSwipe();
            isTouching.current = false;
        }
    };

    const handleSwipe = () => {
        if (
            touchStartX.current !== null
            &&
            touchEndX.current !== null
            &&
            touchStartY.current !== null
            &&
            touchEndY.current !== null
        ) {
            const distanceX = touchEndX.current - touchStartX.current;
            const distanceY = touchEndY.current - touchStartY.current;
            if (
                (Math.abs(distanceX) > Math.abs(distanceY))
                &&
                (Math.abs(distanceX) > minSwipeDistance)
            ) {

                // // // here we can call our fn() to get actions -------->

                if (distanceX > 0) {
                    rightHandler();
                    // setSwipeDirection('right')
                } else {
                    leftHandler();
                    // setSwipeDirection("left")
                }
            }


            else if (
                (Math.abs(distanceY) > Math.abs(distanceX))
                &&
                (Math.abs(distanceY) > minSwipeDistance)
            ) {


                if (distanceX > 0) {
                    downHandler && downHandler();
                    // setSwipeDirection('right')
                } else {
                    upHandler && upHandler();
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

