"use client";
import { useRouter,useSearchParams} from "next/navigation";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function SortDropdown(){
    const searchParams=useSearchParams()
    const router=useRouter()
    const [isOpen,setIsOpen]=useState(false)

    const sortOptions=[
        {
            label:"Newest",
            value:"-created_at"
        },
        {
            label:"Oldest",
            value:"created_at"
        },
        {
            label:"Price: Low to High",
            value:"price"
        },
        {
            label:"Price: High to Low",
            value:"-price"
        }
    ]

    const currentOrdering=  searchParams.get("ordering")||"-created_at"
    const currentOption= sortOptions.find(
        (option)=>option.value===currentOrdering  
    )

    const handleSortChange=(value)=>{
        const params=new URLSearchParams(
            searchParams.toString()
        )
        params.set("ordering",value)
        params.delete("page")
        router.push(`?${params.toString()}`)
        setIsOpen(false)
    }
    
    return (
        <div className="relative z-40">
            <button 
            onClick={()=>{setIsOpen(!isOpen)}}
            className="flex items-center gap-2 text-gray-800 font-semibold overflow-hidden shadow-md transition-all hover:scale-[1.02] duration-300  dark:text-white py-2 ">
                <span className="flex items-center whitespace-nowrap">
                Sort by:{currentOption?.label}
                </span>
                <ChevronDown
                size={17}
                className={`transition-transform 
                    duration-300 font-medium 
                    ${isOpen?"rotate-180":""}`}
                />

            </button>
            {isOpen && (
                <div className="absolute right-0 bg-white top-full mt-2 w-52 overflow-hidden shadow-lg rounded-lg dark:text-white dark:bg-gray-800">
                    {sortOptions.map((option)=>(
                        <button 
                        key={option.value}
                        type="button"
                        onClick={()=>{handleSortChange(option.value)}}
                        className="block w-full text-left text-sm whitespace-nowrap px-4 py-2.5 hover:bg-gray-400/20 dark:hover:bg-zinc-700">
                            {option.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    )

}