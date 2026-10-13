export default function CartSkeleton() {
    return (
        <div className="flex p-14 flex-col gap-4 animate-pulse">

            {Array.from({ length: 3 }).map((_, index) => (
                <div
                    key={index}
                    className="flex flex-col sm:flex-row gap-4 rounded-md bg-white dark:bg-gray-800 p-3 shadow-sm"
                >
                    {/* Product image */}
                    <div className="w-full sm:w-40 aspect-square shrink-0 rounded-md bg-gray-200 dark:bg-gray-700" />

                    {/* Product information */}
                    <div className="flex-1 flex flex-col gap-3">

                        {/* Product name */}
                        <div className="h-6 w-3/4 rounded bg-gray-200 dark:bg-gray-700" />

                        {/* Price */}
                        <div className="h-5 w-24 rounded bg-gray-200 dark:bg-gray-700" />

                        {/* Color / size */}
                        <div className="h-4 w-40 rounded bg-gray-200 dark:bg-gray-700" />

                        {/* Quantity + remove */}
                        <div className="flex gap-2 mt-auto">
                            <div className="h-10 w-28 rounded-md bg-gray-200 dark:bg-gray-700" />

                            <div className="h-10 w-12 rounded-md bg-gray-200 dark:bg-gray-700" />
                        </div>
                    </div>
                </div>
            ))}

           
            <div className="rounded-md bg-white dark:bg-gray-800 p-4 shadow-sm">
                <div className="h-6 w-32 rounded bg-gray-200 dark:bg-gray-700" />

                <div className="h-5 w-24 rounded bg-gray-200 dark:bg-gray-700 mt-4" />

                <div className="h-10 w-full rounded-md bg-gray-200 dark:bg-gray-700 mt-4" />
            </div>

        </div>
    );
}