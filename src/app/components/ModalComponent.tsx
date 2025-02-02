'use client'

import { Fragment, useRef } from 'react'
import { Dialog, Transition, DialogPanel, } from '@headlessui/react';
// import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'
// import { modalStore, setOpenMoadl } from '../../Slices/ModalSlice'
import { useDispatch, useSelector } from 'react-redux'
import { useThemeData } from '@/redux/slices/ThemeSlice'
import { setOpenMoadl, useModalState } from '@/redux/slices/ModalSlice'
// import { RootState } from '../../store'


export default function Modal() {
    // const [open, setOpen] = useState(true)

    const dispatch = useDispatch()
    const themeMode = useThemeData()


    const open = useModalState().open;
    const children = useModalState().children;

    function setOpen(data: boolean) {

        dispatch(setOpenMoadl(data))

    }


    const cancelButtonRef = useRef(null)

    return (

        <Dialog
            as="div"
            // open={open}
            open={open}
            onClose={setOpen}
            className="relative z-50 "
            initialFocus={cancelButtonRef}
        >
            <Transition
                show={open}
                as={Fragment}
                enter="ease-out duration-300 "
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
            >
                <div
                    className={`  fixed inset-0  bg-opacity-75 transition-opacity
                            ${!themeMode ? " bg-sky-950 " : "bg-sky-200"}
                        `}
                />
            </Transition>

            <div className={`${themeMode ? " bg-black " : "bg-white"} rounded-tr-2xl rounded-tl-2xl min-h-[20%] max-h-[90%] fixed bottom-0 z-10 w-screen overflow-y-auto`}>
                <div className="flex min-h-full items-end justify-center py-4 px-2 text-center sm:items-center sm:p-0">
                    <Transition
                        show={open}
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        enterTo="opacity-100 translate-y-0 sm:scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                        leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                    >
                        <DialogPanel className="relative transform overflow-hidden rounded-lg  text-left transition-all sm:my-8 delay-150 lg:max-w-3/5 z-10 ">
                            {/* Widt of Modal is controled by above div ----> */}

                            <div
                                className='bg-transparent z-10'
                                onClick={() => setOpen(false)}
                            >
                                {/* Below div will hold children ---> main content */}
                                <div
                                    className={` ${!themeMode ? "bg-white border-white" : "bg-black border-black"} rounded px-4 pb-4 pt-5 sm:p-6 sm:pb-4 border flex flex-col items-center z-10 overflow-hidden`}
                                >

                                    {
                                        children
                                    }

                                </div>

                            </div>

                        </DialogPanel>
                    </Transition>
                </div>
            </div>


        </Dialog>

    )
}
