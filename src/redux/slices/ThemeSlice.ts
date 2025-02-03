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


        toggleModeValue(state) {



            // state.darkMode = action.payload;
            // const newTheme = action.payload ? 'dark' : 'light';
            // state.darkMode = action.payload
            // localStorage.setItem('stock_theme', JSON.stringify(action.payload));
            // // Apply the new theme to the document body
            // if (newTheme === 'dark') {
            //     document.documentElement.classList.add('dark');
            // } else {
            //     document.documentElement.classList.remove('dark');
            // }



            if (!state.mode) {
                state.value = "white"  // // we can avoid value.
                state.mode = true
                localStorage.setItem("authNextDark", JSON.stringify(true))

                const body = document.querySelector("body")
                if (body) {
                    body.style.backgroundColor = "white"
                }

                document.documentElement.classList.remove('dark');

            } else {
                state.value = 'black'
                state.mode = false  // // we can avoid value.
                localStorage.setItem("authNextDark", JSON.stringify(false))

                const body = document.querySelector("body")
                if (body) {
                    body.style.backgroundColor = "black"
                }

                document.documentElement.classList.add('dark');

            }

        },

        setModeOnLoad(state, action) {

            let { mode } = action.payload
            // console.log(mode)

            state.mode = mode
        },


    }
})



export const { toggleModeValue, setModeOnLoad } = themeSlice.actions

export const useThemeData = () => useSelector((state: RootState) => state.themeReducer)

export default themeSlice.reducer





