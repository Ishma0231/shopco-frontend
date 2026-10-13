"use client"
import {useRouter,useSearchParams} from "next/navigation"
import {useDispatch,useSelector} from "react-redux"
import {useState} from "react"
import { TextField } from "@mui/material"
import {setSnackbarMessage} from "@/features/snackbar/snackbarSlice"
import {loginUser} from "@/features/auth/authSlice"
import { LoaderCircle } from "lucide-react"
import GoogleLoginButton from "@/components/auth/googleLoginButton"
import Link from "next/link"
import { Breadcrumbs } from "@mui/material"
import { ChevronRight } from "lucide-react"

export default function Login(){
    const dispatch=useDispatch()
    const [email,setEmail]=useState("")
    const [error,setError]=useState()
    const router=useRouter()
    const {loginLoading}=useSelector((state)=>state.auth)
    const searchParams=useSearchParams()
    const next=searchParams.get("next")

    const params=new URLSearchParams()
    if(next){
        params.set("next",next)
    }
    const signupUrl=`/signup?${params.toString()}`
    
    const handleSubmit=async(e)=>{
        e.preventDefault()
        setError("")
        try{
            const verifyUrl=new URLSearchParams()
            const response=await dispatch(loginUser(
                {
                    email:email
                })).unwrap()
            
            verifyUrl.set("email",email)
            if (next){
                verifyUrl.set("next",next)
            }
            dispatch(setSnackbarMessage(response.message))
            router.push(`/login/verify?${verifyUrl.toString()}`)
            
        }
        catch(error){
            setError(error.message||"Something went wrong")
        }
    }

    const handleGoogleLoginSuccess=()=>{
        if (next){
        router.push(next)
       }
       else{
        router.push("/")
       }
    }

    return (
        <>
         <div className="ml-6 ">
            <Breadcrumbs aria-label="breadcrumb" separator={<ChevronRight size={18} />} sx={{mb:3}}
            >
                <Link href="/" className="text-blue-500 font-semibold dark:text-[#24a0ed]">Home</Link>
                <span className="font-semibold dark:text-gray-300">Login</span>
            </Breadcrumbs>
        </div>

 <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0 w-[300px] h-[300px] dark:bg-[#24a0ed] opacity-50 rounded-full blur-[150px] pointer-events-none"></div>

{/* <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-50"></div> */}

{/* <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[150px] bg-gradient-to-r from-transparent via-[#24a0ed] opacity-30 z-0 to-transparent blur-[40px]"></div> */}

        <div className="w-full flex flex-col items-center justify-center z-10">
        <div className="w-full max-w-md rounded-3xl shadow-xl mx-auto px-5 py-10 border border-white/40 bg-white dark:bg-black/10 dark:text-white">
            <h1 className="text-center text-2xl font-extrabold text-black dark:text-slate-100 p-5">Sign in</h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-8 pb-4">
                <TextField
                type="email"
                label="Email"
                value={email}
                required
                fullWidth
                onChange={(e)=>setEmail(e.target.value)}
                />
                {error && (<p className="text-sm text-red-600">{error}</p>)}

                <button
                type="submit"
                disabled={loginLoading}
                className="active:scale-95 bg-[#24a0ed] text-white p-4 rounded-lg hover:scale-105 transition-transform duration-300 flex items-center justify-center"
                >
                    {loginLoading ? (<LoaderCircle size={18} className="animate-spin"/>):
                    "Sign In"}
                </button>
            </form>
            <div className="flex py-3 gap-2">
                <div className="h-px bg-gray-300 flex-1"/>
                <span className="text-gray-500 text-sm font font-semibold">OR</span>
                <div className="h-px bg-gray-300 flex-1"/>
            </div>
            <GoogleLoginButton onLoginSuccess={handleGoogleLoginSuccess}/>
            <div className="flex justify-end items-center pt-4 gap-2">
                <p className="font-semibold text-black dark:text-white">No account?</p>
                <Link href={signupUrl} className="text-blue-600 font-semibold dark:text-[#24a0ed] active:scale-95 duration-300 transition-all ">Sign Up</Link>
            </div>
        </div>
        </div>
        </>
    )
}