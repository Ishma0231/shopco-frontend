"use client"
import ProductTabs from "@/components/product/productDetail/productTabs"
import ProductDetailCard from "@/components/product/productDetail/productDetailCard"
import {useState,useEffect} from "react"
import { clearProductDetail ,fetchProductDetail} from "@/features/products/productSlice"
import { Snackbar,Breadcrumbs } from "@mui/material"
import { useDispatch,useSelector } from "react-redux"
import { useParams } from "next/navigation"
import ProductDetailSkeleton from "@/components/product/productDetail/productDetailSkeleton"
import AuthModal from "@/components/auth/authModal"
import Link from "next/link"
import { ChevronRight } from "lucide-react"


export default function ProductDetail(){
    const {productDetailLoading}=useSelector((state)=>state.products)
    const {slug}=useParams()
    const [snackbarMessage,setSnackbarMessage]=useState("")
    const { authInitialised } = useSelector((state) => state.auth)
    const [isOpenAuthModal,setIsOpenAuthModal]=useState(false)
    const dispatch=useDispatch()

    useEffect(()=>{
         if (!authInitialised || !slug) return
        dispatch(fetchProductDetail(slug))

        return ()=>{
            dispatch(clearProductDetail())
        }
    },[dispatch,slug,authInitialised])

     const handleResponse=(message)=>{
        setSnackbarMessage(message)
     }

    return (
        <>
        <div className="ml-4">
            <Breadcrumbs aria-label="breadcrumb" separator={<ChevronRight size={18}/>} sx={{mb:3}}
            >
                <Link href="/" className="text-blue-500 font-semibold dark:text-[#24a0ed]">Home</Link>
                <span className="font-semibold dark:text-gray-300">Product-detail</span>
            </Breadcrumbs>
       
        </div>
        {productDetailLoading || !authInitialised ? (
            <ProductDetailSkeleton/>
        ):(
        <div className="flex flex-col gap-2">
            <ProductDetailCard handleResponse={handleResponse} openAuthModal={()=>setIsOpenAuthModal(true)}/>
                
            <ProductTabs slug={slug} handleResponse={handleResponse} openAuthModal={()=>setIsOpenAuthModal(true)}/>

          
            {isOpenAuthModal && (
                <AuthModal onClose={()=>setIsOpenAuthModal(false)}/>
            )}
        </div>
        )}
          <Snackbar
            open={Boolean(snackbarMessage)}
            onClose={()=>setSnackbarMessage("")}
            anchorOrigin={{
                vertical:"top",
                horizontal:"center"
            }}
            autoHideDuration={3000}
            message={snackbarMessage}

            />
        </>

    )
}