import {createSlice} from "@reduxjs/toolkit"

const initialState={
    message:""
}

const snackbarSlice=createSlice({
    name:"snackbar",
    initialState,
    reducers:{
        setSnackbarMessage:(state,action)=>{
            state.message=action.payload
        },
        clearSnackbarMessage:(state)=>{
            state.message=""
        }
    }
})

export const {setSnackbarMessage,clearSnackbarMessage}=snackbarSlice.actions
export default snackbarSlice.reducer