import Rating from "@mui/material/Rating";
import { Swiper, SwiperSlide } from "swiper/react";
import { Mousewheel, Scrollbar } from "swiper/modules";

import "swiper/css";
import "swiper/css/scrollbar";

export default function MyReviewGrid({ myReviews = [], onClick }) {
    if (myReviews.length === 0) {
        return null;
    }

    return (
        <div className="w-full pt-3">
            <p className="font-semibold text-2xl text-zinc-800 dark:text-white pb-2">
                My Reviews
            </p>

            <Swiper
                modules={[Mousewheel, Scrollbar]}
                slidesPerView="auto"
                mousewheel={{
                    forceToAxis: true,
                }}
                scrollbar={{
                    draggable: true,
                }}
                spaceBetween={12}
            >
                {myReviews.map((review) => (
                    <SwiperSlide
                        key={review.id}
                        onClick={() => onClick(review)}
                        className="w-72! h-44! active:scale-95 relative rounded-md"
                    >
                        <div className="h-full w-full border border-zinc-600/30 rounded-md p-3 overflow-hidden flex flex-col">
                            <Rating
                                value={review.rating}
                                readOnly
                            />

                            <p className="font-semibold mt-1 line-clamp-1">
                                {review.title}
                            </p>

                            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-3 overflow-hidden">
                                {review.comment}
                            </p>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}