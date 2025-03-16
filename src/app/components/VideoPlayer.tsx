import { usePreventSwipe } from "@/Hooks/useSwipeCustom";
import {
  setIsMuted,
  setMetaDataInfo,
  usePostData,
} from "@/redux/slices/PostSlice";
import { AppDispatch } from "@/redux/store";
import { PostInterFace, VideoPlayerProps } from "@/Types";
import React, { useRef, useState, useEffect } from "react";
import { FaPlay, FaPause, FaVolumeUp } from "react-icons/fa";
import { HiOutlineSpeakerWave, HiOutlineSpeakerXMark } from "react-icons/hi2";
import { MdZoomOutMap } from "react-icons/md";
import { useDispatch } from "react-redux";
import { usePathname, useRouter } from "next/navigation";
import { MdTimer3 } from "react-icons/md";
// import { useInView } from "react-intersection-observer";

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  videoUrl,
  objectFit,
  height,
  postData,
  observerOn = false,
  playPauseToggleBtn = false,
  videoClickHandler,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null); // Reference to the video element
  const [isPlaying, setIsPlaying] = useState<boolean>(false); // State to track if video is playing
  const [progress, setProgress] = useState<number>(0); // State to track video progress (0-100)
  const [allBtnVisiable, setAllBtnVisiable] = useState<boolean>(false);
  const isLoading = usePostData().isLoading;
  const isMuted = usePostData().isMuted;
  const metaDataInfo = usePostData().metaDataInfo;
  const dispatch = useDispatch<AppDispatch>();
  const setMute = (data: boolean) => dispatch(setIsMuted(data));
  const pathName = usePathname();
  const preventSwipe = usePreventSwipe();
  const [newHeight, setNewHeight] = useState<"auto" | "43vh" | "70vh">(
    height || "43vh"
  );

  //   console.log(progress);

  // // // Not working now.
  let ignoreObserver = false;

  const playTheVideo = () => {
    videoRef.current && videoRef.current?.play();
    setIsPlaying(true);

    if (postData) {
      dispatch(setMetaDataInfo({ id: videoUrl, sec: progress.toString() }));
    }
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
  //   useEffect(() => {
  //     const observer = new IntersectionObserver(
  //       (entries) => {
  //         if (ignoreObserver) return; // Skip if ignoring observer

  //         entries.forEach((entry) => {
  //           // console.log({ entry })

  //           if (videoRef.current) {
  //             if (entry.isIntersecting && !isPlaying) {
  //               // if (entry.isIntersecting) {
  //               // videoRef.current.play();
  //               playTheVideo();
  //               setIsPlaying(true);
  //             } else {
  //               // videoRef.current.pause();
  //               pauseTheVideo();
  //               setIsPlaying(false);
  //             }
  //           }
  //         });
  //       },
  //       {
  //         root: null,
  //         rootMargin: "0px",
  //         threshold: 0.5, // Trigger when 50% of the video is visible
  //         // threshold: 1,
  //       }
  //     );

  //     if (observerOn) {
  //       if (videoRef.current) {
  //         observer.observe(videoRef.current);
  //       }
  //     }
  //     // // // Not Using now
  //     // else {

  //     // // // This code will play video for single page video comp. -------->> (Becuse observer will pause there and if it is off then play song initially.)
  //     // playTheVideo();
  //     // }

  //     return () => {
  //       if (videoRef.current) {
  //         observer.unobserve(videoRef.current);
  //       }
  //     };
  //   }, []);

  //   const { ref, inView } = useInView({
  //     /* Optional options */
  //     threshold: 0,
  //   });

  // Play/Pause video manually
  const togglePlayPause = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    if (videoRef.current) {
      if (isPlaying) {
        // videoRef.current.pause();
        pauseTheVideo();
      } else {
        // videoRef.current.play();
        playTheVideo();
        setMute(false);
      }
    }
  };

  // Update progress as video plays
  const handleProgress = () => {
    if (videoRef.current) {
      const progress =
        (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(progress);
    }
  };

  // Seek to a different part of the video/
  // // // Adding some time by progress
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (videoRef.current) {
      const time =
        (parseFloat(e.target.value) / 100) * videoRef.current.duration;
      videoRef.current.currentTime = time;
      setProgress(parseFloat(e.target.value));
    }
  };

  const handle3sBack = (e: React.MouseEvent<HTMLButtonElement> | null) => {
    e && e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.currentTime = videoRef.current.currentTime - 3;
    }
  };

  const handle3sForward = (e: React.MouseEvent<HTMLButtonElement> | null) => {
    e && e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.currentTime = videoRef.current.currentTime + 3;
    }
  };

  const videoClickOutsideHandler = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setMute(false);

    // setMute(!isMuted)

    setAllBtnVisiable((pre) => !pre);

    // // // Video Click Handler is given (This can be used for Going to this post) ------------>>
    // // STOP redirecting for now --------->>
    // videoClickHandler && videoClickHandler();
  };

  const zoomClickHandler = (e: React.MouseEvent<HTMLSpanElement>) => {
    e.stopPropagation();
    // // // Not rouing user now
    // if (postData && postData._id) router.push(`/post/${postData._id}`)

    // // Now inc the height of post.
    // setNewHeight('auto')
    setNewHeight((p) => (p === "43vh" ? "70vh" : "43vh"));
  };

  const onDoubleClickHandler = (
    e: React.MouseEvent<HTMLVideoElement | HTMLDivElement>
  ) => {
    e.stopPropagation();

    // handle3sBack(null);
    // alert("httrhdfhd")

    let widthOfInnerWindow = window.innerWidth;

    let halfWidthNum = Math.floor(widthOfInnerWindow / 2);

    if (e.clientX < halfWidthNum) {
      handle3sBack(null);
    } else {
      handle3sForward(null);
    }
  };

  //   Play/Pause video based on view visibility
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
              setTimeout(() => {
                playTheVideo();
                setIsPlaying(true);
              }, 50);
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
        rootMargin: "0px",
        threshold: 0.5, // Trigger when 50% of the video is visible
        // threshold: 1,
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

  //   console.log({ inView, entry });
  //   useEffect(() => {
  //     if (inView) {
  //       playTheVideo();
  //     } else {
  //       pauseTheVideo();
  //     }
  //   }, [inView]);

  // // I'm responsable for play the video that is clicked ------->>
  useEffect(() => {
    if (metaDataInfo?.id && metaDataInfo?.id !== videoUrl) pauseTheVideo();
  }, [metaDataInfo]);

  // // // I'll hide control btns ------>>
  useEffect(() => {
    let sec: number = 2.5;
    if (isPlaying && !allBtnVisiable) {
      setTimeout(() => {
        setAllBtnVisiable(true);
      }, sec * 1000);
    }
  }, [allBtnVisiable, isPlaying]);

  // // // Move window little bit below when progress is 100 (Move to next post if video is over.)
  useEffect(() => {
    if (isPlaying && progress === 100) {
      window.scrollBy(0, 600);
    }
  }, [progress]);

  return (
    <div
      className="relative w-full max-w-4xl mx-auto min-h-[43vh] "
      onClick={videoClickOutsideHandler}
      onDoubleClick={onDoubleClickHandler}
      //   ref={ref}
    >
      {!isLoading && (
        <video
          style={{
            objectFit: objectFit || "contain",
            height: newHeight || "auto",
          }}
          ref={videoRef}
          className="w-full h-auto rounded-lg cursor-pointer transition-all duration-300"
          onTimeUpdate={handleProgress}
          src={videoUrl} // Video URL passed as a prop
          muted={isMuted} // Default muted to prevent autoplay issues in browsers
          onDoubleClick={onDoubleClickHandler}
        />
      )}

      {!allBtnVisiable && (
        <>
          {
            // playPauseToggleBtn
            // &&
            <div className="absolute inset-0 flex items-center justify-center ">
              <button
                className=" w-14 h-14 bg-opacity-50 text-inherit rounded-full px-3 py-1.5 hover:bg-opacity-75 z-[10] mx-5 relative active:scale-75 transition-all "
                onClick={handle3sBack}
              >
                <span className=" absolute top-1/2 left-1/2 -translate-x-[70%] -translate-y-1/2  text-4xl opacity-50">
                  {"◁"}
                </span>
                <MdTimer3 className=" absolute top-[40%] left-1/2 -translate-x-[65%]  text-xs " />
              </button>

              <button
                className="bg-black bg-opacity-50 text-inherit rounded-full p-4 hover:bg-opacity-75 transition relative z-[10] "
                onClick={togglePlayPause}
              >
                {isPlaying ? <FaPause size={40} /> : <FaPlay size={40} />}
              </button>

              <button
                className=" w-14 h-14 bg-opacity-50 text-inherit rounded-full px-3 py-1.5 hover:bg-opacity-75 z-[10] mx-5 relative active:scale-75 transition-all "
                onClick={handle3sForward}
              >
                <span className=" absolute top-1/2 left-[50%] -translate-x-1/2 -translate-y-1/2  text-4xl opacity-50">
                  {"▷"}
                </span>
                <MdTimer3 className=" absolute top-[40%] left-[45%] -translate-x-[65%]  text-xs  " />
              </button>
            </div>
          }

          {/* Bottom Controls */}
          <div
            className="absolute bottom-2 left-0 right-0 flex items-center justify-between gap-1 px-4 z-[5] py-3"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Play pause btn */}
            <button
              className=" rounded-full px-1 hover:bg-opacity-75 transition relative z-[10] "
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
              className=" text-xl active:scale-75 transition-all"
              onClick={(e) => {
                e.stopPropagation();
                setMute(!isMuted);
              }}
            >
              {isMuted ? <HiOutlineSpeakerXMark /> : <HiOutlineSpeakerWave />}
            </span>

            {pathName === "/home" && (
              <span
                onClick={(e) => zoomClickHandler(e)}
                className="active:scale-75 transition-all"
              >
                <MdZoomOutMap className=" text-xl " />
              </span>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default VideoPlayer;
