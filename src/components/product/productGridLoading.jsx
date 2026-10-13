import ProductCardSkeleton from "./productCardSkeleton";

export default function ProductGridLoading(){
        return (
            <div className="w-full grid  grid-cols-1 min-[500px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 px-10 min-[500px]:px-3">
                {Array.from({length:8}).map((_,index)=>(
                    <ProductCardSkeleton key={index}/>
                ))}
            </div>
        )
}