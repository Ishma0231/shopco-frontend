import Rating from "@mui/material/Rating"
export default function ReviewCard({review,onClick}){
    const review_date=new Date(review.created_at).toLocaleDateString("en-US",{
        year:"numeric",
        month:"long",
        day:"numeric"

    })
    return (
    <div onClick={()=>onClick(review)} className="w-full flex flex-col rounded-lg border border-zinc-600/40 shadow-md gap-1 p-4 active:scale-95">
        <p className="font-semibold">{review.first_name} {review.last_name}</p>
        <Rating value={review.rating}
        readOnly
        />
        <p className="font-medium text-gray-500">{review_date}</p>
        <p className="font-medium">{review.title}</p>
        <p className="text-sm">{review.comment}</p>
    </div>)
}