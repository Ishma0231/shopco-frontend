"use client"

import { useEffect } from "react"
import { useParams } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
import {
    Loader,
    MapPin,
    CreditCard,
    ChevronRight,
    Package,
    CalendarDays,
} from "lucide-react"
import { fetchOrderDetail, cancelOrderThunk } from "@/features/orders/orderSlice"
import { setSnackbarMessage } from "@/features/snackbar/snackbarSlice"
import OrderItemCard from "@/components/order/orderItemCard"
import { Breadcrumbs } from "@mui/material"
import Link from "next/link"

export default function OrderDetail() {
    const { orderId } = useParams()
    const dispatch = useDispatch()

    const { authInitialised } = useSelector((state) => state.auth)

    const {
        orderDetail,
        orderDetailLoading,
        cancelOrderLoading,
    } = useSelector((state) => state.order)

    useEffect(() => {
        if (!authInitialised || !orderId) return
        dispatch(fetchOrderDetail(orderId))
    }, [dispatch, orderId, authInitialised])

    const formatDate = (date) =>
        new Date(date).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "long",
            year: "numeric",
        })

    const handleCancelOrder = async () => {
        if (orderDetail?.order_status === "cancelled") return

        try {
            const response = await dispatch(
                cancelOrderThunk(orderId)
            ).unwrap()

            dispatch(setSnackbarMessage(response.message))
            await dispatch(fetchOrderDetail(orderId))
        } catch (error) {
            dispatch(
                setSnackbarMessage(
                    error?.message || "Failed to cancel order."
                )
            )
        }
    }

    const handleItemCancelSuccess = async () => {
        try {
            await dispatch(fetchOrderDetail(orderId)).unwrap()
        } catch (error) {
            dispatch(
                setSnackbarMessage(
                    error?.message || "Failed to fetch order details."
                )
            )
        }
    }

    if (!authInitialised || orderDetailLoading) {
        return (
            <main className="min-h-[70vh] bg-white px-5 py-8 text-zinc-950 dark:bg-zinc-950 dark:text-zinc-100 sm:px-8 lg:px-12">
                <div className="mb-8">
                    <Breadcrumbs
                        aria-label="breadcrumb"
                        separator={<ChevronRight size={16} />}
                    >
                        <Link
                            href="/"
                            className="text-sm text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white"
                        >
                            Home
                        </Link>
                        <Link
                            href="/order"
                            className="text-sm text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white"
                        >
                            Orders
                        </Link>
                        <span className="text-sm font-medium text-zinc-900 dark:text-zinc-200">
                            Details
                        </span>
                    </Breadcrumbs>
                </div>

                <div className="flex min-h-[50vh] items-center justify-center">
                    <Loader
                        size={32}
                        className="animate-spin text-zinc-500 dark:text-zinc-400"
                    />
                </div>
            </main>
        )
    }

    if (!orderDetail) {
        return (
            <main className="flex min-h-[70vh] w-full items-center justify-center bg-white px-5 py-8 text-zinc-950 dark:bg-zinc-950 dark:text-zinc-100">
                <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-8 text-center dark:border-zinc-800 dark:bg-zinc-900">
                    <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                        <Package size={28} />
                    </div>

                    <h2 className="text-2xl font-semibold">
                        Order not found
                    </h2>

                    <p className="mt-3 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
                        We couldn't find the order you're looking for.
                        It may not exist or may no longer be available.
                    </p>

                    <Link
                        href="/order"
                        className="mt-6 inline-flex rounded-full bg-zinc-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
                    >
                        Back to Orders
                    </Link>
                </div>
            </main>
        )
    }

    const {
        order_id,
        address,
        payment_method,
        payment_status,
        order_status,
        total_price,
        items,
        created_at,
    } = orderDetail

    const statusStyles =
        order_status?.toLowerCase() === "delivered"
            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400"
            : order_status?.toLowerCase() === "cancelled"
              ? "bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-400"
              : "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-400"

    return (
        <main className="min-h-screen w-full bg-white px-5 py-8 text-zinc-950 transition-colors dark:bg-zinc-950 dark:text-zinc-100 sm:px-8 lg:px-12">
            {/* Breadcrumbs */}
            <div className="mb-8">
                <Breadcrumbs
                    aria-label="breadcrumb"
                    separator={
                        <ChevronRight
                            size={16}
                            className="text-zinc-400 dark:text-zinc-600"
                        />
                    }
                >
                    <Link
                        href="/"
                        className="text-sm text-zinc-500 transition hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white"
                    >
                        Home
                    </Link>

                    <Link
                        href="/order"
                        className="text-sm text-zinc-500 transition hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white"
                    >
                        Orders
                    </Link>

                    <span className="text-sm font-medium text-zinc-900 dark:text-zinc-200">
                        Details
                    </span>
                </Breadcrumbs>
            </div>

            {/* Page heading */}
            <header className="mb-8 border-b border-zinc-200 pb-7 dark:border-zinc-800">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="mb-2 flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
                            <Package size={16} />
                            Order Details
                        </div>

                        <h1 className="break-all text-2xl font-semibold tracking-tight sm:text-3xl">
                            Order #{order_id}
                        </h1>

                        <p className="mt-2 flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
                            <CalendarDays size={16} />
                            Placed on {formatDate(created_at)}
                        </p>
                    </div>

                    <span
                        className={`inline-flex w-fit items-center rounded-full px-4 py-2 text-sm font-medium capitalize ${statusStyles}`}
                    >
                        {order_status}
                    </span>
                </div>
            </header>

            {/* Address and payment */}
            <div className="mb-6 grid grid-cols-1 gap-5 lg:grid-cols-2">
                {/* Delivery address */}
                <section className="rounded-2xl border border-zinc-200 bg-white p-6 transition-colors dark:border-zinc-800 dark:bg-zinc-900">
                    <div className="mb-5 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100 dark:bg-zinc-800">
                            <MapPin
                                size={20}
                                className="text-zinc-700 dark:text-zinc-300"
                            />
                        </div>

                        <h2 className="text-lg font-semibold">
                            Delivery Address
                        </h2>
                    </div>

                    <div className="space-y-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                        <p className="font-semibold text-zinc-950 dark:text-zinc-100">
                            {address.full_name}
                        </p>

                        <p>{address.phone_number}</p>
                        <p>{address.street_address}</p>

                        {address.landmark && <p>{address.landmark}</p>}

                        <p>
                            {address.city}, {address.state}
                        </p>

                        <p>
                            {address.country} - {address.postal_code}
                        </p>
                    </div>
                </section>

                {/* Payment */}
                <section className="rounded-2xl border border-zinc-200 bg-white p-6 transition-colors dark:border-zinc-800 dark:bg-zinc-900">
                    <div className="mb-5 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100 dark:bg-zinc-800">
                            <CreditCard
                                size={20}
                                className="text-zinc-700 dark:text-zinc-300"
                            />
                        </div>

                        <h2 className="text-lg font-semibold">
                            Payment Information
                        </h2>
                    </div>

                    <div className="space-y-5">
                        <div>
                            <p className="text-sm text-zinc-500 dark:text-zinc-400">
                                Payment Method
                            </p>

                            <p className="mt-1 font-medium capitalize">
                                {payment_method === "cod"
                                    ? "Cash on Delivery"
                                    : payment_method}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-zinc-500 dark:text-zinc-400">
                                Payment Status
                            </p>

                            <span
                                className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-medium capitalize ${
                                    payment_status?.toLowerCase() === "paid"
                                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400"
                                        : "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                                }`}
                            >
                                {payment_status}
                            </span>
                        </div>
                    </div>
                </section>
            </div>

            {/* Order items */}
            <section className="rounded-2xl border border-zinc-200 bg-white p-5 transition-colors dark:border-zinc-800 dark:bg-zinc-900 sm:p-6">
                <div className="mb-6 flex items-center justify-between border-b border-zinc-200 pb-5 dark:border-zinc-800">
                    <div>
                        <h2 className="text-lg font-semibold sm:text-xl">
                            Order Items
                        </h2>

                        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                            {items.length}{" "}
                            {items.length === 1 ? "product" : "products"} in
                            this order
                        </p>
                    </div>
                </div>

                <div className="space-y-5">
                    {items.map((item) => {
                        const canCancel =
                            item.item_status === "pending" ||
                            item.item_status === "processing"

                        return (
                            <OrderItemCard
                                key={item.id}
                                item={item}
                                onSuccess={handleItemCancelSuccess}
                                canCancel={canCancel}
                            />
                        )
                    })}
                </div>

                {/* Total */}
                <div className="mt-7 flex justify-end border-t border-zinc-200 pt-6 dark:border-zinc-800">
                    <div className="w-full sm:w-auto sm:min-w-[240px]">
                        <div className="flex items-center justify-between gap-8">
                            <p className="text-xl font-semibold pt-2 text-zinc-700 dark:text-zinc-400">
                                Order Total
                            </p>

                            <p className="text-2xl font-semibold tracking-tight">
                                ₹
                                {Number(total_price).toLocaleString("en-IN", {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                })}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Cancel order */}
            {order_status?.toLowerCase() !== "cancelled" && (
                <div className="mt-6 flex justify-end">
                    <button
                        type="button"
                        onClick={handleCancelOrder}
                        disabled={cancelOrderLoading}
                        className="rounded-full border border-red-300 px-6 py-3 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950/40"
                    >
                        {cancelOrderLoading
                            ? "Cancelling..."
                            : "Cancel Order"}
                    </button>
                </div>
            )}
        </main>
    )
}