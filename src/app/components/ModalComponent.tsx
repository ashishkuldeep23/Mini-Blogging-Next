"use client";

import { Fragment, useRef } from "react";
import { Dialog, DialogPanel, Transition } from "@headlessui/react";
// import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'
// import { modalStore, setOpenMoadl } from '../../Slices/ModalSlice'
import { useDispatch, useSelector } from "react-redux";
import { useThemeData } from "@/redux/slices/ThemeSlice";
import { setOpenMoadl, useModalState } from "@/redux/slices/ModalSlice";
// import { RootState } from '../../store'

export default function Modal() {
  // const [open, setOpen] = useState(true)

  const dispatch = useDispatch();
  const themeMode = useThemeData();

  const open = useModalState().open;
  const children = useModalState().children;

  const setOpen = (data: boolean) => {
    dispatch(setOpenMoadl(data));
  };

  const cancelButtonRef = useRef(null);

  return (
    <Dialog
      as="div"
      // open={open}
      open={open}
      onClose={setOpen}
      className="relative z-50  "
      initialFocus={cancelButtonRef}
      role="alertdialog"
      transition={true}
    >
      <div
        className={` translate-y-12 bg-opacity-20 bg-sky-100 fixed inset-0 transition-all duration-300 `}
      />

      <div
        className={` duration-300
            ${open ? " translate-y-0 " : "  translate-y-60 "}
            ${themeMode ? " bg-black " : "bg-white"} 
        transition-all duration-500 rounded-tr-2xl rounded-tl-2xl min-h-[20%] max-h-[90%] fixed bottom-0 z-10 w-screen overflow-y-auto`}
      >
        <div className="flex min-h-full items-end justify-center py-4 px-2 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-lg  text-left transition-all sm:my-8 delay-150 lg:max-w-3/5 z-10    "
          >
            {/* Widt of Modal is controled by above div ----> */}

            <div
              className={`bg-transparent z-10 `}
              onClick={() => setOpen(false)}
            >
              {/* Below div will hold children ---> main content */}
              <div
                className={` ${
                  !themeMode ? "bg-white border-white" : "bg-black border-black"
                } rounded px-4 pb-4 pt-5 sm:p-6 sm:pb-4 border flex flex-col items-center z-10 overflow-hidden`}
              >
                {children}
              </div>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
