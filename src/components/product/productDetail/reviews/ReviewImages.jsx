"use client";
import { Swiper ,SwiperSlide} from "swiper/react";
import {Navigation,Mousewheel} from "swiper/modules"
import "swiper/css";
import "swiper/css/navigation";

export default function ReviewImages({reviews,onReviewClick}){
  
    const reviewImages=reviews.flatMap((review)=>
        (review.images||[]).map((image)=>(
            {   image,
                review:review
            }
        ))
)
  if (reviewImages?.length===0){
        return null;
    }
    
    return (
        <div className="w-full mt-4">
            <hr className="border-0 h-px bg-gray-500/50 dark:bg-slate-200/30" />


            <p className="font-semibold text-2xl text-zinc-800 dark:text-slate-300 pb-3 mt-4">Customer Photos</p>
            <Swiper 
            modules={[Navigation,Mousewheel]}
            navigation
            direction="horizontal"
            mousewheel={{
                forceToAxis:true
            }}
            slidesPerView="auto"     
            spaceBetween={2}    
         >
            {reviewImages?.map((option)=>(
                <SwiperSlide onClick={()=>onReviewClick(option.review)} key={option.image.id} className="w-32!">
                    <div className="w-full aspect-square">
                        <img
                        src={option.image.image}
                        alt={option.image.alt_text||""}
                        className="w-full h-full object-contain"
                        />
                    </div>
                </SwiperSlide>
            ))}

            </Swiper>
        </div>
    )
}