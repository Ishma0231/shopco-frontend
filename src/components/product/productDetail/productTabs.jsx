"use client"
import {Tabs,Tab} from "@mui/material"
import ReviewsSection from "./reviews/ReviewsSection"
import { useSelector } from "react-redux"
import { useState} from "react"

export default function ProductTabs({slug,handleResponse,openAuthModal}){
    const [tab,setTab]=useState(1)
    const {productDetail}=useSelector((state)=>state.products)
    const handleTabChange=(event,newValue)=>{
        setTab(newValue)
    }

    return (
<>
       <Tabs
    value={tab}
    onChange={handleTabChange}
   sx={{
        width: "100%",

        "& .MuiTabs-scroller": {
            display: "flex",
            justifyContent: "center",
        },

       
    }}
>
    <Tab label="Product Details" />
    <Tab label="Reviews & Ratings" />
    <Tab label="FAQs" />
</Tabs>

        <div className="mt-3 text-gray-600 dark:text-gray-400 p-4">
            {tab === 0 && (
           <section className="py-6">

        <h2 className="text-2xl font-bold mb-6">
            Product Details
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                <div>
                    <p className="text-sm text-gray-500">
                        Brand
                    </p>
                    <p className="font-medium">
                        {productDetail?.brand?.name || "-"}
                    </p>
                </div>

                <div>
                    <p className="text-sm text-gray-500">
                        Category
                    </p>
                    <p className="font-medium">
                        {productDetail?.category?.name || "-"}
                    </p>
                </div>

                <div>
                    <p className="text-sm text-gray-500">
                        Product Type
                    </p>
                    <p className="font-medium">
                        {productDetail?.product_type?.name || "-"}
                    </p>
                </div>

                <div>
                    <p className="text-sm text-gray-500">
                        Style
                    </p>
                    <p className="font-medium">
                        {productDetail?.style?.name || "-"}
                    </p>
                </div>

                <div>
                    <p className="text-sm text-gray-500">
                        Gender
                    </p>
                    <p className="font-medium">
                        {productDetail?.gender?.name || "-"}
                    </p>
                </div>

            </div>

            <div className="mt-8">

                <h3 className="text-lg font-semibold mb-3">
                    Description
                </h3>

                <p className="text-gray-600 dark:text-gray-300 leading-7">
                    {productDetail?.description || "No description available."}
                </p>

            </div>

        </section>
    )}
            
            {tab===1 &&(
                <ReviewsSection slug={slug} handleResponse={handleResponse} openAuthModal={openAuthModal}/>
            )}

            {tab===2 &&(
                 <p >No FAQs available for this product.</p>
            )}
        </div>

        </>

    )
}