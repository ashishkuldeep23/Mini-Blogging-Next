import { usePreventSwipe } from '@/Hooks/useSwipeCustom';
import { setIsMuted, setMetaDataInfo, usePostData } from '@/redux/slices/PostSlice';
import { AppDispatch } from '@/redux/store';
import { PostInterFace } from '@/Types';
import React, { useRef, useState, useEffect } from 'react';
import { FaPlay, FaPause, FaVolumeUp } from 'react-icons/fa';
import { HiOutlineSpeakerWave, HiOutlineSpeakerXMark } from 'react-icons/hi2';
import { MdZoomOutMap } from 'react-icons/md';
import { useDispatch } from 'react-redux';
import { usePathname, useRouter } from "next/navigation"

interface VideoPlayerProps {
    videoUrl: string; // The URL of the video to play
    objectFit?: "fill" | "contain" | 'cover' | 'none' | "scale-down"; // The URL of the video to play
    height?: "43vh" | "70vh",
    postData?: PostInterFace,
    playPauseToggleBtn?: boolean,
    videoClickHandler?: Function,
    observerOn?: boolean
};

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoUrl, objectFit, height, postData, playPauseToggleBtn = false, videoClickHandler, observerOn = false }) => {

    const videoRef = useRef<HTMLVideoElement>(null); // Reference to the video element
    const [isPlaying, setIsPlaying] = useState<boolean>(false); // State to track if video is playing
    const [progress, setProgress] = useState<number>(0); // State to track video progress (0-100)
    // const [isMuted, setIsMuted] = useState<boolean>(true);
    const [allBtnVisiable, setAllBtnVisiable] = useState<boolean>(false);
    const isLoading = usePostData().isLoading;
    const isMuted = usePostData().isMuted;
    const metaDataInfo = usePostData().metaDataInfo;
    const dispatch = useDispatch<AppDispatch>();
    const setMute = (data: boolean) => dispatch(setIsMuted(data));
    // const router = useRouter();
    const pathName = usePathname();
    const preventSwipe = usePreventSwipe();
    const [newHeight, setNewHeight] = useState<"auto" | "43vh" | "70vh">(height || "43vh")


    // // // Not working now.
    let ignoreObserver = false;


    const playTheVideo = () => {
        videoRef.current && videoRef.current?.play();
        setIsPlaying(true);

        if (postData) {
            dispatch(setMetaDataInfo({ id: videoUrl, sec: progress.toString() }));
        };
    };

    const pauseTheVideo = () => {
        videoRef.current && videoRef.current?.pause();
        setIsPlaying(false);
        dispatch(setMetaDataInfo({ id: "", sec: "" }));
    };

    // // // A useEffect that matches postData with globally stored post id.
    // useEffect(() => {
    //     if (metaDataInfo?.id && metaDataInfo?.id !== postData?._id) {
    //         pauseTheVideo();
    //     }
    // }, [metaDataInfo])



    // Play/Pause video based on view visibility
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {

                if (ignoreObserver) return; // Skip if ignoring observer

                entries.forEach((entry) => {

                    // console.log({ entry })

                    if (videoRef.current) {
                        if (entry.isIntersecting && !isPlaying) {
                            // if (entry.isIntersecting) {
                            // videoRef.current.play();
                            playTheVideo();
                            setIsPlaying(true);
                        } else {
                            // videoRef.current.pause();
                            pauseTheVideo();
                            setIsPlaying(false);
                        }
                    }
                });
            },
            {
                root: null,
                rootMargin: '0px',
                // threshold: 0.5, // Trigger when 50% of the video is visible
                threshold: 1,
            }
        );

        if (observerOn) {
            if (videoRef.current) {
                observer.observe(videoRef.current);
            }
        }
        // // // Not Using now
        // else {

        // // // This code will play video for single page video comp. -------->> (Becuse observer will pause there and if it is off then play song initially.)
        // playTheVideo();
        // }

        return () => {
            if (videoRef.current) {
                observer.unobserve(videoRef.current);
            }
        };
    }, []);

    // // // I'm responsable for play the video that is clicked ------->>
    useEffect(() => {
        if (metaDataInfo?.id && metaDataInfo?.id !== videoUrl) pauseTheVideo();
    }, [metaDataInfo])

    // // // I'll hide control btns ------>> 
    useEffect(() => {

        if (isPlaying && !allBtnVisiable) {
            setTimeout(() => {
                setAllBtnVisiable(true)
            }, 2 * 1000)
        }

    }, [allBtnVisiable, isPlaying])

    // Play/Pause video manually
    const togglePlayPause = (e: React.MouseEvent<HTMLButtonElement>) => {

        e.stopPropagation();

        // ignoreObserver = true; // Temporarily ignore observer

        if (videoRef.current) {
            if (isPlaying) {
                // videoRef.current.pause();
                pauseTheVideo();
            } else {
                // videoRef.current.play();
                playTheVideo();
                setMute(false)

            }
            // setIsPlaying(!isPlaying);
        }

        // Reset ignoreObserver after a short delay (e.g., 500ms)

        // setTimeout(() => {
        //     ignoreObserver = false;
        // }, 500);

    };

    // Update progress as video plays
    const handleProgress = () => {
        if (videoRef.current) {
            const progress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
            setProgress(progress);
        }
    };

    // Seek to a different part of the video
    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (videoRef.current) {
            const time = (parseFloat(e.target.value) / 100) * videoRef.current.duration;
            videoRef.current.currentTime = time;
            setProgress(parseFloat(e.target.value));
        }
    };

    const videoClickOutsideHandler = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        setMute(false)
        setAllBtnVisiable(pre => !pre)

        // // // Video Click Handler is given (This can be used for Going to this post) ------------>>
        // // STOP redirecting for now --------->>
        // videoClickHandler && videoClickHandler();

    }

    const zoomClickHandler = (e: React.MouseEvent<HTMLSpanElement>) => {
        e.stopPropagation()
        // // // Not rouing user now 
        // if (postData && postData._id) router.push(`/post/${postData._id}`)

        // // Now inc the height of post.
        // setNewHeight('auto')
        setNewHeight(p => p === "43vh" ? '70vh' : '43vh')
    }

    return (
        <div
            className="relative w-full max-w-4xl mx-auto min-h-[43vh] "
            onClick={(e) => videoClickOutsideHandler(e)}
        >

            {
                !isLoading
                &&
                <video
                    style={{
                        objectFit: objectFit || "contain",
                        height: newHeight || "auto"
                    }}
                    ref={videoRef}
                    className="w-full h-auto rounded-lg cursor-pointer transition-all duration-300"
                    onTimeUpdate={handleProgress}
                    // onClick={togglePlayPause}
                    src={videoUrl} // Video URL passed as a prop
                    muted={isMuted} // Default muted to prevent autoplay issues in browsers
                />
            }


            {

                !allBtnVisiable
                &&

                <>

                    {/* Play/Pause Button */}
                    {
                        playPauseToggleBtn
                        &&
                        <div className="absolute inset-0 flex items-center justify-center ">
                            <button
                                className="bg-black bg-opacity-50 text-white rounded-full p-4 hover:bg-opacity-75 transition relative z-[10] "
                                onClick={togglePlayPause}
                            >
                                {isPlaying ? <FaPause size={32} /> : <FaPlay size={32} />}
                            </button>
                        </div>
                    }

                    {/* Bottom Controls */}
                    <div
                        className="absolute bottom-4 left-0 right-0 flex items-center justify-between gap-1 px-4 z-[5] py-3"
                        onClick={(e) => e.stopPropagation()}
                    >

                        {/* Play pause btn */}
                        <button
                            className=" text-white rounded-full px-1 hover:bg-opacity-75 transition relative z-[10] "
                            onClick={togglePlayPause}
                        >
                            {isPlaying ? <FaPause /> : <FaPlay />}
                        </button>

                        {/* Progress Bar */}
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={progress}
                            className="w-full cursor-pointer h-[4px]"
                            onChange={handleSeek}
                            {...preventSwipe}
                        />

                        {/* Volume Button and Slider */}
                        <span
                            className=' text-xl active:scale-75 transition-all'
                            onClick={(e) => {
                                e.stopPropagation(); setMute(!isMuted);
                            }}
                        >

                            {
                                isMuted
                                    ?
                                    <HiOutlineSpeakerXMark />
                                    :
                                    <HiOutlineSpeakerWave />
                            }
                        </span>


                        {
                            pathName === "/home"
                            &&
                            <span
                                onClick={(e) => zoomClickHandler(e)}
                                className='active:scale-75 transition-all'
                            >
                                <MdZoomOutMap className=" text-xl " />
                            </span>
                        }

                    </div>

                </>
            }


        </div>
    );
};

export default VideoPlayer;
