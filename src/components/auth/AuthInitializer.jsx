"use client"
import { restoreSession } from "@/features/auth/authSlice";
import { useEffect} from "react";
import { useDispatch } from "react-redux";

export default function AuthInitializer({children}){
    const dispatch=useDispatch()
    useEffect(()=>{
        dispatch(restoreSession())
    },[dispatch])

    return children
}