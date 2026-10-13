"use client"
import { TextField } from "@mui/material";
import {useDispatch,useSelector} from "react-redux"
import { useRouter ,useSearchParams} from "next/navigation";
import GoogleLoginButton from "@/components/auth/googleLoginButton";
import Link from "next/link"
import {useState} from "react"
import { setSnackbarMessage } from "@/features/snackbar/snackbarSlice";
import { signupUser } from "@/features/auth/authSlice";
import { LoaderCircle,ChevronRight } from "lucide-react";
import { Breadcrumbs } from "@mui/material"

export default function Signup(){
    const router=useRouter()
    const dispatch=useDispatch()
    const [error,setError]=useState({})
    const searchParams=useSearchParams()
    const {signupLoading}=useSelector((state)=>state.auth)
    const next=searchParams.get("next")
    const [firstName,setFirstName]=useState("")
    const [lastName,setLastName]=useState("")
    const [email,setEmail]=useState("")
    const params=new URLSearchParams()
    if (next){
        params.set("next",next)
    }
    const loginUrl=`/login?${params.toString()}`

    const handleGoogleLoginSuccess=()=>{
        if (next){
            router.push(next)
        }
        else{
            router.push("/")
        }
    }

    const handleSubmit=async(e)=>{
        e.preventDefault()
        const newError={}
        setError("")
        if (!firstName.trim()){
            newError.firstName="Please fill this field."
        }
        if (!lastName.trim()){
            newError.lastName="Please fill this field."
        }
        setError(newError)
        if (Object.keys(newError).length>0){
            return
        }
        try{
            const response=await dispatch(signupUser({
                email,
                first_name:firstName.trim(),
                last_name:lastName.trim()
            })).unwrap()
            const params=new URLSearchParams()
            if (next){
                params.set("next",next)
            }
            params.set("email",email)
            dispatch(setSnackbarMessage(response.message||"OTP sent successfully"))
            router.push(`/signup/verify?${params.toString()}`)
            
        }
        catch(error){
            dispatch(setSnackbarMessage(error.message||"Something went wrong"))
        }

    }

  return (
    <>
     <div className="ml-4">
            <Breadcrumbs aria-label="breadcrumb" separator={<ChevronRight size={18}/>} sx={{mb:3}}
            >
                <Link href="/" className="text-blue-500 font-semibold dark:text-[#24a0ed]">Home</Link>
                <span className="font-semibold dark:text-gray-300">Signup</span>
            </Breadcrumbs>
        </div>
     <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0 w-[300px] h-[300px] dark:bg-[#24a0ed] opacity-40 rounded-full blur-[150px] pointer-events-none"></div>
<div className="w-full flex flex-col items-center justify-center z-10 ">

    <div className="w-full my-11  max-w-md mx-auto px-9 py-8 rounded-2xl border border-white/40 shadow-lg dark:bg-black/20 dark:text-white bg-white dark:text-white">

        <h1 className="text-center text-2xl font-extrabold text-black dark:text-white mb-6">
            Create Account
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 dark:text-white">

            <TextField
                label="First Name"
                type="text"
                value={firstName}
                required
                fullWidth
                onChange={(e) => setFirstName(e.target.value)}
                
            />
             {error.firstName && (
                <p className="text-sm text-red-600">
                    {error.firstName}
                </p>
            )}

            <TextField
                label="Last Name"
                type="text"
                value={lastName}
                required
                fullWidth
                onChange={(e) => setLastName(e.target.value)}
            />

             {error.lastName && (
                <p className="text-sm text-red-600">
                    {error.lastName}
                </p>
            )}


            <TextField
                label="Email"
                type="email"
                value={email}
                required
                fullWidth
                onChange={(e) => setEmail(e.target.value)}
            />


            <button
                type="submit"
                disabled={signupLoading}
                className="w-full py-2 flex justify-center items-center rounded-md bg-[#24a0ed] text-white font-semibold transition-transform duration-300 active:scale-95 hover:scale-105 disabled:opacity-60"
            >
                {signupLoading ? (
                    <LoaderCircle
                        size={18}
                        className="animate-spin mx-auto"
                    />
                ) : (
                    "Sign Up"
                )}
            </button>
        </form>

        <div className="flex items-center gap-2 my-5">
            <div className="h-px bg-gray-300 dark:bg-gray-500 flex-1" />
            <span className="text-sm text-gray-500 dark:text-gray-300 font-semibold">
                OR
            </span>
            <div className="h-px bg-gray-300 dark:bg-gray-500 flex-1" />
        </div>

        <GoogleLoginButton onLoginSuccess={handleGoogleLoginSuccess} />

        <div className="w-full flex justify-end items-center gap-2 mt-5">
            <p className="font-semibold text-black dark:text-white">
                Already have an account?
            </p>

            <Link
                href={loginUrl}
                className="text-blue-600 dark:text-[#24a0ed] active:scale-95 duration-300 transition-all font-semibold"
            >
                Log in
            </Link>
        </div>
    </div>
    </div>
    </>
)

}

