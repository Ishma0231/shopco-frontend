"use client"
import { useState,useEffect } from "react";
import { useDispatch,useSelector } from "react-redux";
import {LoaderCircle,Trash2,ChevronRight,ArrowRight} from "lucide-react"
import CartSkeleton from "@/components/cart/cartSkeleton"
import { Snackbar } from "@mui/material";
import {fetchCart,clearCartThunk} from "@/features/cart/cartSlice"
import { useRouter } from "next/navigation";
import CartItemCard from "@/components/cart/cartItemCard"
import { Breadcrumbs } from "@mui/material"
import Link from "next/link";

export default function Cart(){
     const [snackbarMessage,setSnackbarMessage]=useState("")
     const dispatch=useDispatch()
     const [cartLoading,setCartLoading]=useState(false)
     const {cart,clearCartLoading}=useSelector((state)=>state.cart)
     const {authInitialised}=useSelector((state)=>state.auth)
     const router=useRouter()
    console.log("cart",cart||"nothing")
     useEffect(()=>{
         if (!authInitialised) return
        const loadCart=async()=>{
        try{
        setCartLoading(true)
        await dispatch(fetchCart()).unwrap()
        }
        catch(error){
            console.log(error)
        }
        finally{
            setCartLoading(false)
        }
    }
     loadCart()
     },[dispatch,authInitialised])
     
    const handleCartRefetch=async()=>{
        try{
           await dispatch(fetchCart()).unwrap()
        }
        catch(error){
            console.log(error)
        }
    }

     const handleClearCart=async()=>{
        try{
        const response=await dispatch(clearCartThunk()).unwrap()
        setSnackbarMessage(response.message)
        }
        catch(error){
            setSnackbarMessage(error.message)
        }
     }
     const handleResponse=(message)=>{
        setSnackbarMessage(message)
     }
     console.log(authInitialised)
     return (
        <>
         <div className="ml-6">
            <Breadcrumbs aria-label="breadcrumb" separator={<ChevronRight size={18}/>} sx={{mb:3}}
            >
                <Link href="/" className="text-blue-500 font-semibold dark:text-[#24a0ed]">Home</Link>
                <span className="font-semibold dark:text-gray-300">Cart</span>
            </Breadcrumbs>
        </div>
        {cartLoading|| !authInitialised ?(
            <CartSkeleton/>
        
        ):
        cart && cart.items.length===0?(
            <div className="w-full flex flex-col ">
                <p className="font-semibold pl-4 text-5xl self-start text-[#24a0ed] dark:text-white">Cart</p>
                <div className="w-full max-w-lg aspect-square mx-auto">
                    <img
                    src="/images/emptyCart.avif"
                    alt="empty-cart"
                    className="w-full h-full object-contain"
                    />
                </div>
                 <button
                 type="button"
                 onClick={()=>router.push("/")}
                 className="text-white self-center py-3 px-3 rounded-lg bg-[#24a0ed] font-semibold active:scale-95 duration-300 transition-transform">
                        Go Shopping
                </button>
            </div>
        ): cart && cart.items.length>0 ?(
            <>
            <div className="flex justify-end">
                <button
                type="button"
                onClick={handleClearCart}
                disabled={clearCartLoading}
                className="text-red-700 mr-3 pb-2 rounded-lg active:scale-95 bg-white hover:bg-black/10 flex items-center justify-center shadow-md"
                >{clearCartLoading?(<LoaderCircle size={18} className="animate-spin"/>)
                :(<Trash2 size={24}/>)}</button>
            </div>
            <div className="grid grid-cols-1 gap-2">
                {cart.items.map((item)=>(
                    <CartItemCard key={item.id} item={item} handleResponse={handleResponse} refetchCart={handleCartRefetch} />
                ))}
            </div>
         
            <div className="mt-8 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-8">
          
            <div className="space-y-5">
                <div className="flex items-center justify-between gap-4">
                <span className="text-md text-zinc-600 dark:text-zinc-400">
                    Total Items
                </span>

                <span className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                    x {cart?.count ?? 0}
                </span>
                </div>

                <div className="flex items-center justify-between gap-4">
                <span className="text-md text-zinc-600 dark:text-zinc-400">
                    Total Price
                </span>

                <span className="text-xl font-bold tracking-tight text-zinc-950 dark:text-white">
                    ₹{Number(cart?.total ?? 0).toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                    })}
                </span>
                </div>
            </div>

           
            <div className="my-6 border-t border-zinc-200 dark:border-zinc-800" />

          
            <div className="flex justify-end">
                <button
                onClick={() => router.push("/checkout")}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-black px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-zinc-800 active:scale-[0.98] dark:bg-black dark:text-white dark:hover:bg-zinc-800"
                >
                Proceed to Checkout

                <ArrowRight size={18} />
                </button>
            </div>
            </div>
              
        </>
        ):(
           <div className="w-full flex flex-col items-center ">
                <p className="font-semibold pl-4 self-start text-slate-700 dark:text-white">Cart</p>
                <div className="w-full max-w-lg aspect-square mx-auto">
                    <img
                    src="/images/emptyCart.avif"
                    alt="empty-cart"
                    className="w-full h-full object-contain"
                    />
                </div>
                 <button
                 type="button"
                 onClick={()=>router.push("/")}
                 className="text-white py-3 px-3 rounded-md shadow-lg active:scale-95 duration-300 transition-transform bg-[#24a0ed] font-semibold">
                        Go Shopping
                </button>
            </div>
        )}
      <Snackbar
         open={Boolean(snackbarMessage)}
         onClose={()=>setSnackbarMessage("")}
         anchorOrigin={{
            vertical:"top",
            horizontal:"center"
         }}
         message={snackbarMessage}
         autoHideDuration={3000}
        
        />
</>
     )

}