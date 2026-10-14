"use client"

import { GoogleLogin } from "@react-oauth/google"
import { useDispatch } from "react-redux"
import { googleLoginUser } from "@/features/auth/authSlice"
import { setSnackbarMessage } from "@/features/snackbar/snackbarSlice"

export default function GoogleLoginButton({onLoginSuccess}) {
    const dispatch = useDispatch()

    const handleSuccess = async (credentialResponse) => {
        try {
            const response=await dispatch(
                googleLoginUser({
                    id_token: credentialResponse.credential
                })
            ).unwrap()

            dispatch(setSnackbarMessage(response.message||"Google login successful."))
            onLoginSuccess?.()
        } catch (error) {
            dispatch(setSnackbarMessage(error.message||"Google login failed."))
        }
    }

    const handleError = () => {
        dispatch(setSnackbarMessage("Google login failed. Please try again."))
    }

    return (
       <div className="w-full flex justify-center">
    <GoogleLogin
        onSuccess={handleSuccess}
        onError={handleError}
    />
</div>
    )
}