import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import { RootState } from "../store";
// import { RootState } from "../store";

// import type { PayloadAction } from "@reduxjs/toolkit"
// // // Above will use in action object , see the docs.

interface ModalInter {
  open: boolean;
  children: React.ReactNode;
}

const initialState: ModalInter = {
  open: false,
  children: "",
};

const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    setOpenMoadl(state, action: PayloadAction<boolean>) {
      state.open = action.payload;
    },

    setInnerHTMLOfModal(state, action: PayloadAction<React.ReactNode>) {
      state.children = action.payload;
    },

    setCloseMoadal(state) {
      state.open = false;
      state.children = "";
    },
  },
});

export const { setOpenMoadl, setInnerHTMLOfModal, setCloseMoadal } =
  modalSlice.actions;

export const useModalState = () =>
  useSelector((state: RootState) => state.modalReducer);

export default modalSlice.reducer;
