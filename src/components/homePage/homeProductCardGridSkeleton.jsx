import ProductCardSkeleton from "../product/productCardSkeleton"

export default function ProductGridSkeleton() {
    return (
        <div className="grid grid-cols-1 min-[500px]:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-3 px-10 min-[500px]:px-3">
            {Array.from({ length: 4 }).map((_, index) => (
                <ProductCardSkeleton key={index} />
            ))}
        </div>
    )
}