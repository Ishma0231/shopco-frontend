"use client"

import { Heart, LoaderCircle } from "lucide-react"
import Link from "next/link"
import AddToCartButton from "../cart/addToCartButton"
import { useState } from "react"
import { useSelector } from "react-redux"

export default function ProductCard({ product, onWishlistToggle, openAuthModal }) {
    const [wishlistLoading, setWishlistLoading] = useState(false)
    const { isAuthenticated, user } = useSelector((state) => state.auth)

    const handleWishlistToggle = async (product) => {
        if (user === null && !isAuthenticated) {
            openAuthModal()
            return
        }

        setWishlistLoading(true)

        try {
            await onWishlistToggle(product)
        } finally {
            setWishlistLoading(false)
        }
    }

    const hasDiscount =
        product.discount_price !== null &&
        product.discount_price !== undefined

    const price = Number(product.price)
    const discountPrice = Number(product.discount_price)

    const discountPercentage = hasDiscount && price > 0
        ? Math.round(((price - discountPrice) / price) * 100)
        : 0

    const productURL = `/products/${product.slug}?variant=${product.featured_variant_id}`
   const imageURL = product.primary_image
    ? product.primary_image.startsWith("http")
        ? product.primary_image
        : `${process.env.NEXT_PUBLIC_MEDIA_URL}${product.primary_image.startsWith("/") ? "" : "/"}${product.primary_image}`
    : null;
    return (
        <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-slate-600/10 shadow-sm transition-all duration-300 hover:shadow-lg hover:scale-[1.02] dark:bg-zinc-800 dark:text-white hover:border-slate-500/30 dark:hover:border-orange-500">
            <div className="relative h-48 aspect-square w-full overflow-hidden bg-gray-50 dark:bg-zinc-900">
                <Link href={productURL} className="block h-full w-full">
                    {product.primary_image ? (
                        <img
                            src={imageURL}
                            alt={product.name}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center text-sm text-gray-400">
                            No image available
                        </div>
                    )}
                </Link>

                {product.is_new_arrival && (
                    <span className="absolute left-3 top-3 rounded-full bg-white px-3 py-1 text-sm font-medium text-orange-500 shadow-sm">
                        New
                    </span>
                )}

                <button
                    type="button"
                    disabled={wishlistLoading}
                    className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-rose-700/10 shadow-sm transition-transform hover:scale-110 active:scale-95 duration-300"
                    aria-label={
                        product.wishlist_data?.is_wishlisted
                            ? "Remove from wishlist"
                            : "Add to wishlist"
                    }
                    onClick={() => handleWishlistToggle(product)}
                >
                    {wishlistLoading ? (
                        <LoaderCircle size={18} className="animate-spin" />
                    ) : (
                        <Heart
                            className="text-rose-700"
                            size={20}
                            strokeWidth={1.8}
                            fill={
                                product.wishlist_data?.is_wishlisted
                                    ? "currentColor"
                                    : "none"
                            }
                        />
                    )}
                </button>
            </div>

            <div className="flex flex-1 flex-col p-3">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-300">
                    {product.brand_name}
                </p>

                <Link href={productURL}>
                    <h3 className="mt-1 line-clamp-2 min-h-10 text-sm font-medium text-black hover:underline dark:text-white">
                        {product.name}
                    </h3>
                </Link>

                <p className="mt-2 line-clamp-2 min-h-[2.7rem] text-sm leading-5 text-gray-600 dark:text-gray-300">
                    {product.description}
                </p>

                <div className="mt-auto pt-2 dark:text-white">
                    <div className="flex flex-wrap items-center gap-2 py-3">
                        <span className="font-semibold">
                            ₹{hasDiscount ? product.discount_price : product.price}
                        </span>

                        {hasDiscount && (
                            <span className="text-sm text-gray-400 line-through">
                                ₹{product.price}
                            </span>
                        )}

                        {hasDiscount && discountPercentage > 0 && (
                            <span className="rounded-full bg-red-400/40 px-2 py-0.5 text-xs font-medium text-red-600 dark:text-red-400">
                                -{discountPercentage}%
                            </span>
                        )}
                    </div>

                    <AddToCartButton
                        product={product}
                        authModal={openAuthModal}
                    />
                </div>
            </div>
        </article>
    )
}