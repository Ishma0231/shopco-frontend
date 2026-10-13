"use client";
import { ChevronLeft,ChevronRight } from "lucide-react";

export default function Pagination({
    pageSize=12,count,next,previous,handlePageChange,currentPage}){
        const totalPages=Math.ceil(count/pageSize)
        if (totalPages<=1){
            return null
        }
        const pages=Array.from(
            {length:totalPages},
            (_,index)=>index+1
        ).filter((pageNumber)=>{
            if (totalPages<=5){
                return true
            }
            if (pageNumber===1 || pageNumber===totalPages){
                return true
            }
            if (Math.abs(pageNumber-currentPage)<=1){
                return true
            }
            return false
    })
    return (
        <div className="flex w-full items-center justify-center gap-2 text-sm py-6">
            <button
            type="button"
            disabled={!previous}
            onClick={()=>{
                handlePageChange(currentPage-1)
            }}
            className="flex items-center text-gray-700 disabled:pointer-events-none disabled:opacity-40 dark:text-gray-200 dark:hover:bg-gray-700 active:scale-95 rounded-md px-3 h-9 border border-gray-700 dark:border-gray-200">
                <ChevronLeft size={18} />
                <span>Previous</span>
            </button>

            {pages.map((pageNumber,index)=>{
                 const previousPage=pages[index-1]
                 return (
                <div key={index} className="flex items-center">
                {previousPage && pageNumber-previousPage>1 && (
                    <span>...</span>
                )}
                <button
                type="button"
                onClick={()=>{
                    handlePageChange(pageNumber)
                }}
                className={`active:scale-95 border rounded-md px-4 transition items-center justify-center h-9
                     ${currentPage===pageNumber?
                "bg-black text-white shadow-md dark:bg-white dark:text-black":
                " text-gray-700 border-gray-700 hover:bg-gray-100 dark:text-white dark:border-white dark:hover:bg-gray-600"}`}
                >
                    {pageNumber}
                </button>
                </div>
                )
            })}

              <button
            type="button"
            disabled={!next}
            onClick={()=>{
                handlePageChange(currentPage+1)
            }}
            className="flex items-center text-gray-700 disabled:pointer-events-none disabled:opacity-40 dark:text-gray-200 dark:hover:bg-gray-700 active:scale-95 rounded-md px-3 h-9 border border-gray-700 dark:border-gray-200">
                <span>Next</span>
                <ChevronRight size={18}/>
            </button>
        </div>
    )

    }