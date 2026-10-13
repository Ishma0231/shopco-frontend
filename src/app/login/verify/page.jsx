"use client"
import {verifyLoginUser,resendLoginOTPThunk} from "@/features/auth/authSlice"
import { useSearchParams,useRouter } from "next/navigation"
import {useDispatch,useSelector} from "react-redux"
import {useState,useRef,useEffect} from "react"
import { setSnackbarMessage } from "@/features/snackbar/snackbarSlice"
import { LoaderCircle } from "lucide-react"
import { Button } from "@mui/material"

export default function LoginVerify(){
    const dispatch=useDispatch()
    const inputRefs=useRef([])
    const {verifyLoginLoading,resendLoginOTPLoading}=useSelector((state)=>state.auth)
    const searchParams=useSearchParams()
    const next=searchParams.get("next")
    const email=searchParams.get("email")
    const [error,setError]=useState("")
    const [otp, setOtp] = useState(["", "", "", "", "", ""])  
    const [timeLeft, setTimeLeft] = useState(300)
    const [resendAvailable, setResendAvailable] = useState(false)
    
    const router=useRouter()
    

    useEffect(()=>{

        const timer=setInterval(()=>{
            setTimeLeft((previous)=>{
                if (previous<=1){
                    clearInterval(timer)
                    return 0
                }
                return previous-1
            })
        },1000)
        return ()=>clearInterval(timer)
    },[])

    useEffect(()=>{
        if(timeLeft<=240 && timeLeft>0){
            setResendAvailable(true)
        }

        if(timeLeft===0){
            setResendAvailable(false)
        }
    },[timeLeft])

    const handleOtpChange=(index,value)=>{
        if (!/^\d?$/.test(value)){ 
            return
        }
        const newOtp=[...otp]
        newOtp[index]=value
        setOtp(newOtp)

        if(value && index<5){
            inputRefs.current[index+1]?.focus()
        }    
    }

    const handleOtpKeyDown=(index,e)=>{
        if (index>0 && e.key==="Backspace" && !otp[index]){
            inputRefs.current[index-1]?.focus()
        }
    }

    const handleSubmit=async(e)=>{
        e.preventDefault()
        setError("")
        const enteredOtp=otp.join("")
        if (enteredOtp.length!==6){
            setError("Please enter a valid 6-digit OTP.")
            return
        }
        try{
            const response=await dispatch(verifyLoginUser({
                otp:enteredOtp,
                email:email
            })).unwrap()
            dispatch(setSnackbarMessage(response.message))
            if (next){
            router.push(next)
            }
            else{
                router.push("/")
            }
        }
        catch(error){
            setError(error.message||"Invalid OTP")
        }

    }

    const handleResendOTP=async()=>{
        try{
            const response=await dispatch(resendLoginOTPThunk({
                email:email
            })).unwrap()
            dispatch(setSnackbarMessage(response.message))
            setTimeLeft(300)
            setResendAvailable(false)
            setOtp(["","","","","",""])
            inputRefs.current[0]?.focus()
        }
        catch(error){
            dispatch(setSnackbarMessage(error.message||"Failed to resend OTP"))
        }
    }

    const minute=Math.floor(timeLeft/60)
    const seconds=timeLeft % 60
    const formattedTime=`${minute.toString().padStart(2,"0")}:${seconds.toString().padStart(2,"0")}`

   return (
    <div className="flex flex-1 items-center justify-center px-4 py-10">

        <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-xl
                        dark:border-zinc-700 dark:bg-zinc-900">

           
            <div className="mb-8 text-center">
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                    Verify Email
                </h1>

                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    Enter the 6-digit OTP sent to your email
                </p>

                {email && (
                    <p className="mt-1 text-sm font-medium text-blue-500">
                        {email}
                    </p>
                )}
            </div>

            <form
                className="flex flex-col items-center"
                onSubmit={handleSubmit}
            >

               
                <div className="flex justify-center gap-2 sm:gap-3">
                    {otp?.map((value, index) => (
                        <input
                            key={index}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={value}
                            ref={(element) => {
                                inputRefs.current[index] = element
                            }}
                            onChange={(e) => {
                                handleOtpChange(index, e.target.value)
                            }}
                            onKeyDown={(e) => handleOtpKeyDown(index, e)}
                            className="
                                h-12 w-11 rounded-lg border border-gray-500
                                bg-white text-center text-lg font-semibold
                                text-gray-900 outline-none transition
                                focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20
                                dark:border-zinc-600 dark:bg-zinc-800
                                dark:text-white dark:focus:border-blue-400
                                dark:focus:ring-blue-400/20
                            "
                        />
                    ))}
                </div>

              
                {error && (
                    <p className="mt-4 text-center text-sm font-medium text-red-500">
                        {error}
                    </p>
                )}

              
                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        OTP expires in
                    </p>

                    <div className="mt-2 inline-flex rounded-lg bg-gray-100 px-5 py-3
                                    text-lg font-semibold text-blue-500
                                    dark:bg-zinc-800">
                        {formattedTime}
                    </div>
                </div>

              
                <Button
                    type="submit"
                    variant="contained"
                    disabled={verifyLoginLoading || timeLeft <= 0}
                    fullWidth
                    sx={{
                        marginTop: "24px",
                        padding: "11px 0",
                        borderRadius: "10px",
                        textTransform: "none",
                        fontSize: "15px",
                        fontWeight: 600,
                        boxShadow: "none",
                        backgroundColor: "#2563eb",

                        "&:hover": {
                            backgroundColor: "#1d4ed8",
                            boxShadow: "none",
                        },

                        "&.Mui-disabled": {
                            backgroundColor: "#93c5fd",
                            color: "#ffffff",
                        },
                    }}
                >
                    {verifyLoginLoading ? (
                        <LoaderCircle size={18} className="animate-spin" />
                    ) : (
                        "Verify OTP"
                    )}
                </Button>

            </form>

            
            <div className="mt-5 text-center">
                <button
                    type="button"
                    onClick={handleResendOTP}
                    disabled={
                        resendLoginOTPLoading ||
                        timeLeft <= 0 ||
                        !resendAvailable
                    }
                    className="
                        rounded-lg px-5 py-2.5 text-sm font-semibold
                        text-blue-600 transition
                        hover:bg-blue-50
                        disabled:cursor-not-allowed
                        disabled:text-gray-400
                        dark:text-blue-400
                        dark:hover:bg-blue-500/10
                        dark:disabled:text-zinc-600
                    "
                >
                    {resendLoginOTPLoading ? (
                        <LoaderCircle size={18} className="mx-auto animate-spin" />
                    ) : resendAvailable ? (
                        "Resend OTP"
                    ) : timeLeft === 0 && !resendAvailable ? (
                        "OTP expired"
                    ) : (
                        "Resend available in 1 minute"
                    )}
                </button>
            </div>

        </div>
    </div>
)
}