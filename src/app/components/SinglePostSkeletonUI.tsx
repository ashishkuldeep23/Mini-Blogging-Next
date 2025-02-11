
const SinglePostSkeletonUI: React.FC = () => {
    return <div className=' w-[95vw] sm:w-[23rem] md:w-[25rem] lg:w-[27rem] !max-w-[30rem] min-h-60 my-5 rounded-lg animate-pulse border-4 border-gray-400 dark:border-gray-800 '>

        <div className=' flex gap-1 justify-start w-full pl-7 pt-2 items-center'>

            <div
                className=' w-14 h-14 rounded-full bg-gray-400 dark:bg-gray-800'
            ></div>

            <div className=' w-[60%] h-10 rounded-md bg-gray-400 dark:bg-gray-800'>

            </div>

        </div>

        <div className=' flex gap-1 h-48 justify-start w-full pl-7 py-2 items-center'>

            <div
                className=' w-[90%] h-full rounded-md bg-gray-400 dark:bg-gray-800'
            ></div>

        </div>

        <div className=' flex gap-1 h-14 justify-end w-full pr-10 py-2 items-center'>

            <div
                className=' w-[10%] h-full  rounded-md bg-gray-400 dark:bg-gray-800'
            ></div>

            <div
                className=' w-[10%] h-full rounded-md bg-gray-400 dark:bg-gray-800'
            ></div>

            <div
                className=' w-[10%] h-full rounded-md bg-gray-400 dark:bg-gray-800'
            ></div>

        </div>
        
    </div>
}

export default SinglePostSkeletonUI;