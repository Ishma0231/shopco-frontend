export default function WishlistSkeleton() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-4">
            {Array.from({ length: 3 }).map((_, index) => (
                <div
                    key={index}
                    className="flex flex-col md:flex-row gap-3 rounded-md shadow-sm bg-white dark:bg-gray-800 animate-pulse"
                >
                    
                    <div className="w-full md:w-52 shrink-0 aspect-square rounded-md bg-gray-200 dark:bg-gray-700" />

                   {/*info**/}
                    <div className="flex-1 flex flex-col gap-3 p-2">
                        <div className="h-6 w-3/4 rounded bg-gray-200 dark:bg-gray-700" />

                        <div className="h-5 w-24 rounded bg-gray-200 dark:bg-gray-700" />

                        <div className="h-4 w-40 rounded bg-gray-200 dark:bg-gray-700" />

                        <div className="flex gap-2">
                            <div className="h-10 w-28 rounded-md bg-gray-200 dark:bg-gray-700" />

                            <div className="h-10 flex-1 rounded-lg bg-gray-200 dark:bg-gray-700" />

                            <div className="h-10 w-12 rounded-md bg-gray-200 dark:bg-gray-700" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}