"use client";
import {useEffect,useState} from "react"
import {useDispatch,useSelector} from "react-redux"
import {useSearchParams,useRouter} from "next/navigation"
import { fetchReviews ,fetchMyReviewsThunk} from "@/features/reviews/reviewSlice";
import AddReviewModal from "./AddReviewModal"; 
import ReviewImages from "./ReviewImages";
import MyReviewGrid from "./MyReviewGrid";
import ReviewDetailModal from "./ReviewDetailModal";
import ReviewGrid from "./ReviewGrid";
import Pagination from "@/components/common/pagination";

export default function ReviewsSection({ slug ,handleResponse ,openAuthModal}) {
    const router=useRouter()
    const [isAddReviewOpen,setIsAddReviewOpen]=useState(false)
    const [selectedReview,setSelectedReview]=useState(null)
    const dispatch=useDispatch()
    const searchParams=useSearchParams()
    const {reviews, count,next,previous,myReviews}=useSelector((state)=>state.reviews)
    const {user,isAuthenticated}=useSelector((state)=>state.auth)
    const page=searchParams.get("page")||1
    const ordering=searchParams.get("ordering")||"-created_at";
    const [reviewRefresh,setReviewRefresh]=useState(false)
   


    useEffect(()=>{
        dispatch(fetchReviews({
            slug,
            params:{
                ordering,
                page
            }
        }))
    },[dispatch,slug,ordering,page,])
    
    useEffect(()=>{
        dispatch(fetchMyReviewsThunk(slug))
    },[dispatch,slug])


   //refreshreview
    useEffect(()=>{
        if (!reviewRefresh){
            return
        }
        dispatch(fetchMyReviewsThunk(slug))

        dispatch(fetchReviews({
            slug,
            params:{
                ordering,
                page:1
            }
        }))

        setReviewRefresh(false)
    
    },[reviewRefresh,dispatch,slug,ordering])


    const handlePageChange=(page)=>{
        const params=new URLSearchParams(searchParams.toString())
        params.set("page",page)
        router.push(`?${params.toString()}`)
    }
     const handleWriteReview=()=>{
        if (!user && !isAuthenticated){
            openAuthModal()
            return
        }
        setIsAddReviewOpen(true)
     }
    return (
        <section className="flex flex-col gap-2 p-4">
            <div className="flex justify-between">
            <h2 className="text-lg md:text-2xl text-zinc-800 font-bold dark:text-slate-200">
                Customer Reviews
            </h2>

            <button
                onClick={handleWriteReview}
                type="button"
                className="mr-4 rounded-m text-sm  hover:-translate-y-0.5 active:transition-y-0 active:scale-95 transition-all duration-300  bg-black px-2 md:px-4 py-2 text-white rounded-md font-semibold dark:bg-white dark:text-black"
            >
                Write a Review
            </button>
            </div>
            {isAddReviewOpen && (
                <AddReviewModal slug={slug} onReviewCreated={()=>setReviewRefresh(true)} onReviewResponse={handleResponse} onClose={()=>setIsAddReviewOpen(false)}/>
            )}
            {myReviews && (
                <MyReviewGrid myReviews={myReviews} onClick={setSelectedReview}  />
            )}
           {reviews?.length > 0 ? (
    <>
        <ReviewImages
            reviews={reviews}
            onReviewClick={setSelectedReview}
        />

        <ReviewGrid
            reviews={reviews}
            onReviewClick={setSelectedReview}
        />
    </>
) : (
    <div className="mt-4 flex flex-col items-center justify-center rounded-2xl border border-gray-200 bg-gray-50 px-6 py-10 text-center shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            No reviews yet
        </h3>

        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Be the first to share your experience with this product.
        </p>
    </div>
)}
            <Pagination count={count} next={next} previous={previous} handlePageChange={handlePageChange} currentPage={page} />

            {selectedReview && (
                <ReviewDetailModal 
                review={selectedReview} 
                onResponse={handleResponse}
                onReviewEditSuccess={()=>setReviewRefresh(true)} 
                handleDeleteSuccess={()=>setReviewRefresh(true)} 
                 onClose={()=>setSelectedReview(null)}  />
            )}
         

        </section>
    );
}