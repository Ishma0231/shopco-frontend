"use client"

import { useState } from "react"
import ProductSidebar from "@/components/product/productSidebar"
import ProductGrid from "@/components/product/productGrid"
import { SlidersHorizontal } from "lucide-react"
import { Breadcrumbs,Typography } from "@mui/material"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { ChevronRight } from "lucide-react"

export default function ProductsPage() {
    const [isFilterOpen, setIsFilterOpen] = useState(false)
    const searchParams=useSearchParams()
    const style=searchParams.get("style")
    const category=searchParams.get("category")
    const label=style||category||"Products"

    return (
        <>
        <div className="ml-2">
            <Breadcrumbs aria-label="breadcrumb" separator={<ChevronRight size={18}/>} sx={{mb:3}}
            >
                <Link href="/" className="text-blue-500 font-semibold dark:text-[#24a0ed]">Home</Link>
                <span className="font-semibold  dark:text-gray-300">{label}</span>
            </Breadcrumbs>
        </div>
        <div className="flex items-start gap-6">

           <aside className="hidden md:block w-64 lg:w-72 shrink-0 sticky top-32 h-[calc(100dvh-8rem)] overflow-y-auto overflow-x-hidden overscroll-contain">
            <ProductSidebar />
        </aside>

          
            <section className="flex-1 min-w-0">
                <ProductGrid />
            </section>

            <button
                type="button"
                onClick={() => setIsFilterOpen(true)}
                className="fixed bottom-4 left-1/2 z-40 -translate-x-1/2 flex items-center gap-2 rounded-full  bg-black px-5 py-3 text-sm font-medium text-white shadow-lg active:scale-95 md:hidden"
            >
                <SlidersHorizontal size={18} />
                Filters
            </button>

            {isFilterOpen && (
                <div className="fixed inset-0 z-50 bg-white dark:bg-gray-800 md:hidden">
                  <ProductSidebar
                    isMobileOpen={isFilterOpen}
                    onClose={() => setIsFilterOpen(false)}
                />
            </div>
            )}

        </div>
        </>
    )
}