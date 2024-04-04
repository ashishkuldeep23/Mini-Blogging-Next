'use client'

import { createSlice } from "@reduxjs/toolkit"
import { useSelector } from "react-redux"
import { RootState } from "../store"



interface ThemeInter {
    mode: boolean,
    value: "black" | "white"
}

const initialState: ThemeInter = {
    mode: false,
    value: "black"
}

const themeSlice = createSlice({
    name: "theme",
    initialState,
    reducers: {

        // makeDark(state){
        //     state.mode = true;
        // },
        // makeLight(state){
        //     state.mode = false;
        // }


        toggleModeValue(state ) {


            // if(!state.mode){
            // }

            if (!state.mode) {
                state.value = "white"
                state.mode = true
                localStorage.setItem("authNextDark", JSON.stringify(true))
            } else {
                state.value = 'black'
                state.mode = false
                localStorage.setItem("authNextDark", JSON.stringify(false))
            }

        },

        setModeOnLoad(state, action) {
            
            let { mode } = action.payload
            // console.log(mode)

            state.mode = mode
        } ,


    }
})



export const { toggleModeValue, setModeOnLoad } = themeSlice.actions

export const useThemeData = () => useSelector((state: RootState) => state.themeReducer)

export default themeSlice.reducer





