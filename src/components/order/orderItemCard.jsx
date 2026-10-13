"use client"

import { useDispatch } from "react-redux"
import { useState } from "react"
import { X, Package, CalendarDays } from "lucide-react"
import { cancelOrderItemThunk } from "@/features/orders/orderSlice"
import { setSnackbarMessage } from "@/features/snackbar/snackbarSlice"

export default function OrderItemCard({ item, onSuccess, canCancel }) {
    const [cancelItemLoading, setCancelItemLoading] = useState(false)
    const dispatch = useDispatch()

     const imageURL = item.product_image
    ? item.product_image.startsWith("http")
        ? item.product_image
        : `${process.env.NEXT_PUBLIC_MEDIA_URL}${item.product_image.startsWith("/") ? "" : "/"}${item.product_image}`
    : null;

    const handleCancelItem = async (itemId) => {
        try {
            setCancelItemLoading(true)

            const response = await dispatch(
                cancelOrderItemThunk(itemId)
            ).unwrap()

            dispatch(
                setSnackbarMessage(
                    response.message || "Order item cancelled successfully"
                )
            )

            await onSuccess?.()
        } catch (error) {
            dispatch(
                setSnackbarMessage(
                    error?.message || "Couldn't cancel item. Please try again."
                )
            )
        } finally {
            setCancelItemLoading(false)
        }
    }

    const statusStyles =
        item.item_status?.toLowerCase() === "delivered"
            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400"
            : item.item_status?.toLowerCase() === "cancelled"
              ? "bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-400"
              : "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-400"

    return (
        <article className="flex flex-col gap-5 border rounded-xl p-2 border-zinc-500/50 pb-6 last:border-b-0 last:pb-0 dark:border-zinc-800 sm:flex-row sm:gap-6">
            {/* Product image */}
            <div className="h-36 w-32 shrink-0 overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-800 sm:h-40 sm:w-32">
                <img
                    src={imageURL}
                    alt={item.product_name}
                    className="h-full w-full object-cover transition duration-300 hover:scale-105"
                    onError={(e) => {
                        e.currentTarget.onerror = null
                        e.currentTarget.src = "/placeholder.png"
                    }}
                />
            </div>

            {/* Product information */}
            <div className="min-w-0 flex-1">
                {/* Name and status */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <h3 className="text-base font-semibold text-zinc-950 dark:text-zinc-100 sm:text-lg">
                            {item.product_name}
                        </h3>

                        {/* Color */}
                        <div className="mt-3 flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-400">
                            <span
                                className="h-4 w-4 shrink-0 rounded-full border border-zinc-300 dark:border-zinc-600"
                                style={{
                                    backgroundColor: item.color_name,
                                }}
                            />

                            <span>{item.color_name}</span>

                            <span className="text-zinc-300 dark:text-zinc-700">
                                |
                            </span>

                            <span>Size: {item.size_name}</span>
                        </div>
                    </div>

                    <span
                        className={`inline-flex w-fit shrink-0 rounded-full px-3 py-1 text-xs font-medium capitalize ${statusStyles}`}
                    >
                        {item.item_status}
                    </span>
                </div>

                {/* Price and quantity */}
                <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-zinc-700 dark:text-zinc-400">
                    <span>
                        ₹
                        {Number(item.price).toLocaleString("en-IN", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                        })}
                    </span>

                    <X size={14} />

                    <span>Qty: {item.quantity}</span>

                    <span className="text-zinc-300 dark:text-zinc-700">
                        |
                    </span>

                    <span className="font-semibold text-zinc-950 dark:text-zinc-100">
                        Subtotal: ₹
                        {Number(item.subtotal).toLocaleString("en-IN", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                        })}
                    </span>
                </div>

                {/* Estimated delivery */}
                {item.estimated_delivery_date && (
                    <p className="mt-3 flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-400">
                        <CalendarDays size={15} />

                        <span>
                            Estimated delivery:{" "}
                            {new Date(
                                item.estimated_delivery_date
                            ).toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                            })}
                        </span>
                    </p>
                )}

                {/* Cancel item */}
                {item.item_status?.toLowerCase() !== "cancelled" && (
                    <button
                        type="button"
                        disabled={!canCancel || cancelItemLoading}
                        onClick={() => handleCancelItem(item.id)}
                        className="mt-5 rounded-full border border-red-300 px-5 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950/40"
                    >
                        {cancelItemLoading
                            ? "Cancelling..."
                            : canCancel
                              ? "Cancel Item"
                              : "Cancellation Unavailable"}
                    </button>
                )}
            </div>
        </article>
    )
}