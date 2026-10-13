"use client";
import { useDispatch ,useSelector} from "react-redux";
import { addCartItem } from "@/features/cart/cartSlice";
import { useState } from "react";
import { LoaderCircle } from "lucide-react";
import { setSnackbarMessage } from "@/features/snackbar/snackbarSlice";

export default function AddToCartButton({product,authModal}){
    const dispatch=useDispatch()
    const [loading,setLoading]=useState(false)
    const {user,isAuthenticated}=useSelector((state)=>state.auth)

    const handleAddToCart=async()=>{
        if (user===null && !isAuthenticated){
            authModal()
            return
        }
        setLoading(true)
        try{
            const response=await dispatch(addCartItem({
                "variant_id":product.featured_variant_id,
                "quantity":product.min_order_quantity
            })).unwrap()
            dispatch(setSnackbarMessage(response.message||"Added to cart successfully."))

        }
        catch(error){
            dispatch(setSnackbarMessage(error.message||"Failed to add to cart"))
        }
        finally{
            setLoading(false)
        }
    }

    if (product.stock===0){
        return (
            <button
            type="button"
            disabled
            className="w-full flex items-center justify-center  active:scale-95 transition-transform
            bg-red-100 text-red-600 font-medium text-sm shadow-sm rounded-lg 
            py-2 dark:bg-transparent dark:border dark:border-red-100 cursor-not-allowed"
            >Out of Stock!</button>
        )

    }
    return(
        <button
        type="button"
        disabled={loading}
        onClick={handleAddToCart}
        className="w-full flex items-center justify-center py-3 bg-orange-500 text-white text-sm font-medium shadow-md 
        rounded-lg active:scale-95 transition-transform hover:scale-[1.02] hover:bg-orange-600 hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed">
            {loading?(
                <LoaderCircle
                size={18}
                className="animate-spin"
                />
            ):(
                "Add to cart"
            )}
        </button>
    );
}