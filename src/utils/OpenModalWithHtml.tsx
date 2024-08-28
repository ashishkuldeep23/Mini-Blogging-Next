import { setInnerHTMLOfModal, setOpenMoadl, useModalState } from "@/redux/slices/ModalSlice";
import { ReactNode } from "react";
import { useDispatch } from "react-redux";


type TReutrnFnArgs = { innerHtml: ReactNode }


export default function useOpenModalWithHTML(): ({ innerHtml }: TReutrnFnArgs) => void {


    const dispatch = useDispatch()
    const open = useModalState().open

    function showModalMain({ innerHtml }: TReutrnFnArgs) {
        dispatch(setOpenMoadl(!open))
        dispatch(setInnerHTMLOfModal(innerHtml))
    }
    return showModalMain
}