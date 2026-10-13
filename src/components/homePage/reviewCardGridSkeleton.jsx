export default function ReviewGridSkeleton() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {Array.from({ length: 3 }).map((_, index) => (
                <div
                    key={index}
                    className=" rounded-xl shadow-lg p-6 border border-black/40 space-y-4"
                >
                    <div className="h-5 w-24 rounded animate-pulse bg-gray-300 dark:bg-zinc-700" />

                    <div className="h-4 w-32 rounded animate-pulse bg-gray-300 dark:bg-zinc-700" />

                    <div className="space-y-2 animate-pulse">
                        <div className="h-4 w-full  rounded bg-gray-300 dark:bg-zinc-700" />
                        <div className="h-4 w-5/6  rounded bg-gray-300 dark:bg-zinc-700" />
                        <div className="h-4 w-2/3  rounded bg-gray-300 dark:bg-zinc-700" />
                    </div>
                </div>
            ))}
        </div>
    )
}