"use client"
import { useSelector ,useDispatch} from "react-redux";
import ProductGridLoading from "./productGridLoading";
import { useState,useEffect } from "react";
import ProductCard from "./productCard";
import { fetchProducts } from "@/features/products/productSlice";
import SortDropdown from "./productSort";
import { Snackbar } from "@mui/material";
import { addWishlistItem,removeWishlistItemThunk } from "@/features/wishlist/wishlistSlice";
import { updateProductWishlist } from "@/features/products/productSlice";
import Pagination from "@/components/common/pagination"
import { useSearchParams,useRouter } from "next/navigation";
import AuthModal from "../auth/authModal";
import { SearchX } from "lucide-react";


export default function ProductGrid(){
    const {products,productsLoading,
        count,previous,next 
    }=useSelector((state)=>state.products)
    const searchParams=useSearchParams()
    const [snackbarMessage,setSnackbarMessage]=useState("")
    const { authInitialised,isAuthenticated } = useSelector((state) => state.auth)
    const dispatch=useDispatch()
    const router=useRouter()
    const [openAuthModal,setOpenAuthModal]=useState(false)

    const currentPage=Number(searchParams.get("page")) || 1
   
    const queryString = searchParams.toString()

    useEffect(() => {
        if (!authInitialised) return;

        const params=Object.fromEntries(
            new URLSearchParams(queryString).entries()
        )

         dispatch(fetchProducts(params)
        );

    }, [dispatch, queryString, authInitialised]);

    const handlePageChange=(pageNumber)=>{
        const newParams=new URLSearchParams(searchParams.toString())
        newParams.set("page",pageNumber)
        router.push(`?${newParams.toString()}`)
    }

  
    if (productsLoading || !authInitialised){
        return <ProductGridLoading/>
    }


    if (products.length === 0) {
        return (
            <div className="flex min-h-[400px] flex-col items-center justify-center text-center text-black dark:text-white">
                <SearchX size={56} strokeWidth={1.5} />
                <h2 className="mt-4 text-xl font-semibold">
                    No products found
                </h2>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    Try changing your filters or search for something else.
                </p>
            </div>
        )
    }


     
     const handleWishlistToggle=async(product)=>{
        if (!isAuthenticated){
            setOpenAuthModal(true)
            return
        }
        try{
            if(product.wishlist_data?.is_wishlisted){
                const response=await dispatch(removeWishlistItemThunk(
                    product.wishlist_data.wishlist_id
                )).unwrap();
                dispatch(
                    updateProductWishlist({
                        productId:product.id,
                        isWishlisted:false,
                        wishlistId:null
                    })
                )
                setSnackbarMessage(response.message)
                
            }
            else{
                const response=await dispatch(addWishlistItem(
                    {variant:product.featured_variant_id}
                )).unwrap();
                dispatch(
                    updateProductWishlist({
                        productId:product.id,
                        isWishlisted:true,
                        wishlistId:response.wishlist_id
                    })
                )
                setSnackbarMessage(response.message)
            }
        }
        catch(error){
            console.error(error)
        }
     }
     const pageSize=12
     const category=searchParams.get("category")
     const style=searchParams.get("style")
     const pageHeading=category||style||"Products"
     const startItem=(currentPage-1)*pageSize + 1
     const endItem=Math.min(currentPage*pageSize,count)

    return (
        <div className="flex flex-col">
            <div className="flex justify-between items-center text-black dark:text-white">
                <div className="ml-3"><h1 className="capitalize text-lg font-semibold pb-3 text-slate-800 dark:text-gray-300 ">{pageHeading}</h1></div>
                <div className="flex items-center gap-2 text-sm font-semibold px-2">
                    <span className="text-gray-700 text-[8px] md:text-sm dark:text-gray-400 flex items-center">Showing {startItem}-{endItem} of {count} products</span>
                    <SortDropdown/>
                </div>
               
            </div>
            <div className="grid grid-cols-1 min-[500px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 px-10 min-[500px]:px-3">
                {products.map((product)=>(
                    <ProductCard key={product.id} product={product} 
                    onWishlistToggle={handleWishlistToggle}
                     openAuthModal={()=>setOpenAuthModal(true)} />
                ))}
            </div>
           
                <Pagination pageSize={pageSize} 
                count={count} 
                previous={previous} 
                next={next}
                currentPage={currentPage}
                handlePageChange={handlePageChange}/>
           
            <Snackbar
            open={Boolean(snackbarMessage)}
            anchorOrigin={{
                vertical:"top",
                horizontal:"center"
            }}
            autoHideDuration={3000}
            onClose={()=>setSnackbarMessage("")}
            message={snackbarMessage}

            />
            {openAuthModal && (
                <AuthModal onClose={()=>setOpenAuthModal(false)} />
            )}
        </div>
    )

}
