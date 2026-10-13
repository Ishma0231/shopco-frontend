"use client"
import WishlistCard from "@/components/wishlist/wishlistCard"
import { useDispatch,useSelector } from "react-redux"
import { fetchWishlist } from "@/features/wishlist/wishlistSlice"
import {useEffect,useState} from "react"
import { useSearchParams ,useRouter} from "next/navigation"
import { Snackbar } from "@mui/material"
import Pagination from "@/components/common/pagination"
import WishlistSkeleton from "@/components/wishlist/wishlistSkeleton"
import { Breadcrumbs } from "@mui/material"
import Link from "next/link"
import {ChevronRight} from "lucide-react"


export default function Wishlist(){
    const dispatch=useDispatch()
    const router=useRouter()
    const [snackbarMessage,setSnackbarMessage]=useState("")
    const {wishlist,count,next,previous,wishlistLoading}=useSelector((state)=>state.wishlist)
    const searchParams=useSearchParams()
    const page=searchParams.get("page")
    const { authInitialised } = useSelector((state) => state.auth)

    useEffect(()=>{
        if (!authInitialised) return 
        dispatch(fetchWishlist({
            page
        }))
    },[dispatch,page,authInitialised])

  
    const handlePageChange=(page)=>{
        const params=new URLSearchParams(searchParams.toString())
        params.set("page",page)
        router.push(`?${params.toString()}`)
    }
    return( 
        <>
         <div className="ml-4">
            <Breadcrumbs aria-label="breadcrumb" separator={<ChevronRight size={18}/>} sx={{mb:3}}
            >
                <Link href="/" className="text-blue-500 font-semibold dark:text-[#24a0ed]">Home</Link>
                <span className="font-semibold">Wishlist</span>
            </Breadcrumbs>
        </div>
        {wishlistLoading || !authInitialised?(
            <WishlistSkeleton/>
        ):wishlist.length===0 ? (
        <div className="w-full flex items-center justify-center">
            <div className="w-full max-w-lg mx-auto aspect-square">
                <img
                src="/images/emptyWishlist.jpg"
                alt="empty-wishlist"
                className="w-full h-full object-contain"
                />
            </div>
        </div>   
        
        ):(
        <>
        <div className="grid grid-cols-1 min-[500px]:grid-cols-2 gap-3 px-10 min-[500px]:px-3">
            {wishlist?.map((item)=>(
                <WishlistCard key={item.id} item={item} handleResponse={setSnackbarMessage}
                />
            ))}
        </div>
         <Pagination currentPage={page} previous={previous} count={count} next={next}  handlePageChange={handlePageChange}/>
         <Snackbar
         open={Boolean(snackbarMessage)}
         onClose={()=>setSnackbarMessage("")}
         message={snackbarMessage}
         autoHideDuration={3000}
         anchorOrigin={{
            vertical:"top",
            horizontal:"center"
         }}
         />
        </>
        )}
        </>
    )
    

}