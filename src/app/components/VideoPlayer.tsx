import { usePreventSwipe } from '@/Hooks/useSwipeCustom';
import { setIsMuted, usePostData } from '@/redux/slices/PostSlice';
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
    height?: "35vh" | "70vh",
    postData?: PostInterFace
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoUrl, objectFit, height, postData }) => {
    const videoRef = useRef<HTMLVideoElement>(null); // Reference to the video element
    const [isPlaying, setIsPlaying] = useState<boolean>(false); // State to track if video is playing
    const [progress, setProgress] = useState<number>(0); // State to track video progress (0-100)
    // const [isMuted, setIsMuted] = useState<boolean>(true);
    const [allBtnVisiable, setAllBtnVisiable] = useState<boolean>(false);
    const isLoading = usePostData().isLoading
    const isMuted = usePostData().isMuted
    const dispatch = useDispatch<AppDispatch>()
    const setMute = (data: boolean) => dispatch(setIsMuted(data))
    const router = useRouter();
    const pathName = usePathname()
    const preventSwipe = usePreventSwipe()

    // Play/Pause video based on view visibility
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (videoRef.current) {
                        if (entry.isIntersecting && !isPlaying) {
                            videoRef.current.play();
                            setIsPlaying(true);
                        } else {
                            videoRef.current.pause();
                            setIsPlaying(false);
                        }
                    }
                });
            },
            {
                // threshold: 0.5, // Trigger when 50% of the video is visible
                threshold: 1,
            }
        );

        if (videoRef.current) {
            observer.observe(videoRef.current);
        }

        return () => {
            if (videoRef.current) {
                observer.unobserve(videoRef.current);
            }
        };
    }, []);

    // Play/Pause video manually
    const togglePlayPause = (e: React.MouseEvent<HTMLButtonElement>) => {

        // e.stopPropagation();

        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
                setIsPlaying(false);
            } else {
                videoRef.current.play();
                setIsPlaying(true);
            }
            // setIsPlaying(!isPlaying);
        }
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
        setAllBtnVisiable(pre => !pre)
    }


    const zoomClickHandler = (e: React.MouseEvent<HTMLSpanElement>) => {
        e.stopPropagation()
        if (postData && postData._id) router.push(`/post/${postData._id}`)
    }


    return (
        <div
            className="relative w-full max-w-4xl mx-auto min-h-[35vh]"
            onClick={(e) => videoClickOutsideHandler(e)}
        >

            {
                !isLoading
                &&

                < video
                    style={{
                        objectFit: objectFit || "contain",
                        height: height || "auto"
                    }}
                    ref={videoRef}
                    className="w-full h-auto rounded-lg cursor-pointer"
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
                    <div className="absolute inset-0 flex items-center justify-center z-[1] ">

                        <button
                            className="bg-black bg-opacity-50 text-white rounded-full p-4 hover:bg-opacity-75 transition"
                            onClick={togglePlayPause}
                        >
                            {isPlaying ? <FaPause size={32} /> : <FaPlay size={32} />}
                        </button>


                    </div>

                    {/* Bottom Controls */}
                    <div
                        className="absolute bottom-4 left-0 right-0 flex items-center justify-between gap-1 px-4 z-[1]"
                        onClick={(e) => e.stopPropagation()}
                    >
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
                            onClick={() => setMute(!isMuted)}
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


        </div >
    );
};

export default VideoPlayer;
