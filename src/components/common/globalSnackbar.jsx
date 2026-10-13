"use client"

import { Snackbar, SnackbarContent } from "@mui/material"
import { useDispatch, useSelector } from "react-redux"
import { clearSnackbarMessage } from "@/features/snackbar/snackbarSlice"

export default function GlobalSnackbar() {
    const dispatch = useDispatch()
    const { message } = useSelector((state) => state.snackbar)

    return (
        <Snackbar
            open={Boolean(message)}
            autoHideDuration={3000}
            onClose={() => dispatch(clearSnackbarMessage())}
            anchorOrigin={{
                vertical: "top",
                horizontal: "center",
            }}
        >
            <SnackbarContent
                message={message}
                sx={{
                    backgroundColor: "white",
                    color: "black",
                    borderRadius: "12px",
                    padding: "6px 14px",
                    boxShadow: "0 8px 30px rgba(0,0,0,0.15)",
                    fontSize: "14px",
                    fontWeight: 500,
                }}
            />
        </Snackbar>
    )
}