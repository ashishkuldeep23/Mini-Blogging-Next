import {
  setInnerHTMLOfModal,
  setOpenMoadl,
  useModalState,
} from "@/redux/slices/ModalSlice";
import { ReactNode } from "react";
import { useDispatch } from "react-redux";

type TReutrnFnArgs = { innerHtml: ReactNode };

type TReturnFn = (args: TReutrnFnArgs) => void;

export default function useOpenModalWithHTML(): TReturnFn {
  const dispatch = useDispatch();
  const open = useModalState().open;

  function showModalMain({ innerHtml }: TReutrnFnArgs) {
    dispatch(setOpenMoadl(!open));
    dispatch(setInnerHTMLOfModal(innerHtml));
  }
  return showModalMain;
}
