'use client'



export default function MessagePage() {


  return (
    <>


      <div className=" my-1 border-2 border-green-500 text-green-500 h-10 rounded w-full flex justify-center items-center">
        <p>Search Input here</p>
      </div>

      <div className=" my-1 border-2 border-yellow-500 text-yellow-500 h-24 rounded w-full flex justify-center items-center">
        <p>All Online friends here </p>
      </div>

      <div className=" my-5 border-2 border-teal-500 text-yellow-500 min-h-[80vh] rounded w-full flex flex-col justify-center items-center overflow-hidden px-1 ">

        {
          [null, null, null, null, null, null, null, null, null, null].map((_, i) => {
            return (
              <div key={i} className=" my-1 bg-teal-900 text-white h-16 rounded w-full flex  justify-center items-center ">
                <p>All Online friends here {i + 1}</p>
              </div>

            )
          })
        }

      </div>


    </>
  )
}


