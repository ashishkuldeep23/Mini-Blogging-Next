import { PostInterFace } from "@/Types";
import React from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import SinglePostCardNew from "./SinglePostCardNew";
import SinglePostSkeletonUI from "./SinglePostSkeletonUI";

type TypeInfinityScrollWithLogic = {
  allPostData: PostInterFace[];
  next: () => any;
  isLoading?: boolean;
};

const InfinityScrollWithLogic: React.FC<TypeInfinityScrollWithLogic> = ({
  allPostData,
  next,
  isLoading = false,
}) => {
  return (
    <>
      <InfiniteScroll
        dataLength={allPostData.length} //This is important field to render the next data
        next={next}
        // next={() => {
        //   if (allPostData.length < allPostsLength && !searchHashAndCate.category && !searchHashAndCate.hash) {
        //     fetchMorePostData()
        //   }
        // }}

        hasMore={true}
        loader={
          // (allPostData.length < allPostsLength && !searchHashAndCate.category && !searchHashAndCate.hash)
          // &&
          isLoading && (
            <div
              className={`lg:-translate-x-[50%] mt-10 flex gap-2 items-center text-white  dark:text-black `}
            >
              <span>Getting...</span>
              <span className=" w-4 h-4   rounded-full animate-spin "></span>
            </div>
          )
        }
        className=" !w-[98vw] min-h-[50vh] pt-[1vh] pb-[7vh] px-0.5 !overflow-auto flex flex-col items-center justify-center  lg:!w-[40vw] "
      >
        <div className="card_container p-0.5 relative sm:px-[8vh] sm:gap-10 flex gap-x-64 flex-wrap justify-center lg:justify-start items-center md:flex-col">
          {allPostData.length > 0 ? (
            allPostData.map((ele, i) => {
              return (
                <SinglePostCardNew
                  key={ele._id}
                  index={i}
                  ele={ele}
                  className=" hover:z-10"
                />
              );
            })
          ) : (
            <>
              {[null, null, null, null, null].map((_, i) => {
                return <SinglePostSkeletonUI key={i} />;
              })}
            </>
          )}
        </div>
      </InfiniteScroll>
    </>
  );
};

export default InfinityScrollWithLogic;
