export default function ProductCardSkeleton(){
    return(
    <div className="overflow-hidden shadow-sm rounded-xl bg-white dark:bg-gray-800">
        <div 
        className="h-48 aspect-square w-full bg-gray-200 dark:bg-gray-600 rounded-md animate-pulse"
        />
        <div className="space-y-2 p-3">
            <div className="h-4 w-1/3 bg-gray-200 dark:bg-gray-600 animate-pulse rounded "/>
            <div className="h-5 w-3/4 bg-gray-200 dark:bg-gray-600 animate-pulse rounded "/>
            <div className="h-4 w-full bg-gray-200 dark:bg-gray-600 animate-pulse rounded"/>
            <div className="h-4 w-2/3 bg-gray-200 dark:bg-gray-600 animate-pulse rounded"/>

            <div className="mt-3 h-4 w-1/3 bg-gray-200 dark:bg-gray-600 animate-pulse rounded"/>
            <div className="h-7 w-full bg-gray-200 dark:bg-gray-600 animate-pulse rounded"/>
        </div>
    </div>
    )
}