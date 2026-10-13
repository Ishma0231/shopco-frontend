import ReviewCard from "./ReviewCard";
import ReviewSort from "./reviewSort";

export default function ReviewGrid({ reviews, onReviewClick }) {
    return (
        <div className="flex w-full flex-col mt-3 gap-2">
            <hr className="border-0 h-px bg-gray-500/50 dark:bg-slate-200/30" />
            <p className="pb-2 mt-4 text-2xl font-semibold text-zinc-800 dark:text-white">
                All Reviews
            </p>

            <ReviewSort />

            <div className="flex w-full flex-col gap-2 mt-2 overflow-x-hidden">
                {reviews.map((review) => (
                    <ReviewCard
                        key={review.id}
                        review={review}
                        onClick={onReviewClick}
                    />
                ))}
            </div>
        </div>
    );
}