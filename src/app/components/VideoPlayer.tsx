import { usePostData } from '@/redux/slices/PostSlice';
import React, { useRef, useState, useEffect } from 'react';
import { FaPlay, FaPause, FaVolumeUp } from 'react-icons/fa';

interface VideoPlayerProps {
    videoUrl: string; // The URL of the video to play
    objectFit?: "fill" | "contain" | 'cover' | 'none' | "scale-down"; // The URL of the video to play
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoUrl, objectFit }) => {
    const videoRef = useRef<HTMLVideoElement>(null); // Reference to the video element
    const [isPlaying, setIsPlaying] = useState<boolean>(false); // State to track if video is playing
    const [progress, setProgress] = useState<number>(0); // State to track video progress (0-100)
    const isLoading = usePostData().isLoading

    // Play/Pause video based on view visibility
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (videoRef.current) {
                        if (entry.isIntersecting) {
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
                threshold: 0.5, // Trigger when 50% of the video is visible
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
    const togglePlayPause = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setIsPlaying(!isPlaying);
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


    return (
        <div
            className="relative w-full max-w-4xl mx-auto"
            onClick={(e) => e.stopPropagation()}
        >

            {
                !isLoading
                &&

                < video
                    style={{
                        objectFit: objectFit || "contain"
                    }}
                    ref={videoRef}
                    className="w-full h-auto rounded-lg cursor-pointer"
                    onTimeUpdate={handleProgress}
                    onClick={togglePlayPause}
                    src={videoUrl} // Video URL passed as a prop
                    muted // Default muted to prevent autoplay issues in browsers
                />

            }

            {/* Play/Pause Button */}
            <div className="absolute inset-0 flex items-center justify-center">
                <button
                    className="bg-black bg-opacity-50 text-white rounded-full p-4 hover:bg-opacity-75 transition"
                    onClick={togglePlayPause}
                >
                    {isPlaying ? <FaPause size={32} /> : <FaPlay size={32} />}
                </button>
            </div>

            {/* Bottom Controls */}
            <div className="absolute bottom-4 left-0 right-0 flex items-center justify-between px-4">
                {/* Progress Bar */}
                <input
                    type="range"
                    min="0"
                    max="100"
                    value={progress}
                    className="w-full cursor-pointer"
                    onChange={handleSeek}
                />

                {/* Volume Button and Slider */}

            </div>
        </div>
    );
};

export default VideoPlayer;
