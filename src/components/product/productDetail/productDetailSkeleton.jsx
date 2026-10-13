import ReviewSectionSkeleton from "./reviews/ReviewSectionSkeleton"

export default function ProductDetailSkeleton() {
    return (
        <div className="flex flex-col gap-8 px-5 animate-pulse">
            {/* Product Detail */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex items-start gap-4">
                    <div className="w-24 space-y-3">
                        <div className="w-20 aspect-square rounded-md bg-gray-300 dark:bg-gray-700" />
                        <div className="w-20 aspect-square rounded-md bg-gray-300 dark:bg-gray-700" />
                        <div className="w-20 aspect-square rounded-md bg-gray-300 dark:bg-gray-700" />
                    </div>

                    <div className="flex-1 aspect-square rounded-md bg-gray-300 dark:bg-gray-700" />
                </div>

                {/* Product info */}
                <div className="flex flex-col gap-4">
                  
                    <div className="h-9 w-3/4 rounded bg-gray-300 dark:bg-gray-700" />

                    <div className="h-5 w-32 rounded bg-gray-300 dark:bg-gray-700" />

                    <div className="h-6 w-40 rounded bg-gray-300 dark:bg-gray-700" />
                    
                    <div className="space-y-2">
                        <div className="h-4 w-full rounded bg-gray-300 dark:bg-gray-700" />
                        <div className="h-4 w-5/6 rounded bg-gray-300 dark:bg-gray-700" />
                        <div className="h-4 w-2/3 rounded bg-gray-300 dark:bg-gray-700" />
                    </div>

                  
                    <div className="space-y-3">
                        <div className="h-4 w-24 rounded bg-gray-300 dark:bg-gray-700" />

                        <div className="flex gap-3">
                            <div className="w-7 h-7 rounded-full bg-gray-300 dark:bg-gray-700" />
                            <div className="w-7 h-7 rounded-full bg-gray-300 dark:bg-gray-700" />
                            <div className="w-7 h-7 rounded-full bg-gray-300 dark:bg-gray-700" />
                        </div>
                    </div>

                   
                    <div className="space-y-3">
                 <div className="h-4 w-24 rounded bg-gray-300 dark:bg-gray-700" />
                        <div className="flex gap-3">
                            <div className="h-10 w-16 rounded-md bg-gray-300 dark:bg-gray-700" />
                            <div className="h-10 w-16 rounded-md bg-gray-300 dark:bg-gray-700" />
                            <div className="h-10 w-16 rounded-md bg-gray-300 dark:bg-gray-700" />
                        </div>
                    </div>

                    
                    <div className="flex gap-2">
                        <div className="h-10 w-32 rounded-full bg-gray-300 dark:bg-gray-700" />

                        <div className="h-10 flex-1 rounded-md bg-gray-300 dark:bg-gray-700" />
                    </div>

                </div>
            </div>

            <ReviewSectionSkeleton />

        </div>
    )
}