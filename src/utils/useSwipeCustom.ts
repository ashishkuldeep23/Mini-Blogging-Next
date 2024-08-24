import { useRef } from "react";


export default function useSwipeCustom(rightHandler: Function, leftHandler: Function, upHandler?: Function, downHandler?: Function) {


    // const [swipeDirection, setSwipeDirection] = useState<'right' | 'left' | null>(null);
    const touchStartX = useRef<number | null>(null);
    const touchEndX = useRef<number | null>(null);
    const touchStartY = useRef<number | null>(null);
    const touchEndY = useRef<number | null>(null);
    const isTouching = useRef<boolean>(false);


    const minSwipeDistance = 80; // Minimum distance for a swipe, this value will checked in pixels;


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


                let span = null;

                // console.log({ touchStartY })

                if (distanceX > 0) {

                    span = document.createElement('span')

                    span.innerHTML = "<span>&#8592;</span>"

                    span.style.width = `${Math.abs(touchEndX.current - touchStartX.current)}px`


                    span.classList.add("back_arrow_code")

                    // span.style.textAlign = "start"
                    // span.style.display = "flex"
                    // span.style.height = '4px'
                    // span.style.borderRadius = "50px"
                    // span.style.alignItems = "center"
                    // span.style.backgroundColor = "red"



                    span.style.position = "absolute"
                    // span.style.top = `${touchStartY}px`
                    // span.style.left =`${touchStartX}px`
                    span.style.top = `${touchStartY.current}px`
                    span.style.left = `${touchStartX.current}px`

                    rightHandler();


                    // setSwipeDirection('right')
                } else {
                    // setSwipeDirection("left")

                    span = document.createElement('span')

                    span.innerHTML = "<span>&#8594;</span>"

                    span.style.width = `${Math.abs(touchEndX.current - touchStartX.current)}px`

                    span.classList.add("forword_arrow_code")

                    // span.style.textAlign = "end"
                    // span.style.height = '4px'
                    // span.style.borderRadius = "50px"
                    // span.style.backgroundColor = "blue"
                    // span.style.display = "flex"
                    // span.style.alignItems = "center"



                    span.style.position = "absolute"
                    // span.style.top = `${touchStartY}px`
                    // span.style.left = `${touchStartX}px`

                    span.style.top = `${touchStartY.current}px`
                    span.style.left = `${touchStartX.current - Math.abs(touchEndX.current - touchStartX.current)}px`

                    leftHandler();

                }


                // // // Adding span into body element;
                document.querySelector("body")?.appendChild(span)


                setTimeout(() => {
                    span?.remove()
                }, 700)


            }


            else if (
                (Math.abs(distanceY) > Math.abs(distanceX))
                &&
                (Math.abs(distanceY) > minSwipeDistance)
            ) {


                if (distanceY > 0) {
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

