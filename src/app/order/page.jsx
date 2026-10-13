"use client"

import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useRouter } from "next/navigation"
import {
    Loader,
    Package,
    ChevronRight,
    ShoppingBag,
    CalendarDays,
    ArrowRight,
} from "lucide-react"
import { fetchOrders } from "@/features/orders/orderSlice"
import Link from "next/link"
import { Breadcrumbs } from "@mui/material"

export default function Orders() {
    const dispatch = useDispatch()
    const router = useRouter()

    const { authInitialised } = useSelector((state) => state.auth)

    const { orders, ordersLoading } = useSelector(
        (state) => state.order
    )

    useEffect(() => {
        if (!authInitialised) return
        dispatch(fetchOrders())
    }, [dispatch, authInitialised])

    const formatDate = (date) =>
        new Date(date).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "long",
            year: "numeric",
        })

    const breadcrumb = (
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

                <span className="text-sm font-medium text-zinc-900 dark:text-zinc-200">
                    Orders
                </span>
            </Breadcrumbs>
        </div>
    )

    if (ordersLoading || !authInitialised) {
        return (
            <main className="min-h-[70vh] bg-white px-5 py-8 text-zinc-950 transition-colors dark:bg-zinc-950 dark:text-zinc-100 sm:px-8 lg:px-12">
                {breadcrumb}

                <div className="flex min-h-[50vh] items-center justify-center">
                    <Loader
                        size={32}
                        className="animate-spin text-zinc-500 dark:text-zinc-400"
                    />
                </div>
            </main>
        )
    }

    if (orders.length === 0) {
        return (
            <main className="min-h-[75vh] bg-white px-5 py-8 text-zinc-950 transition-colors dark:bg-zinc-950 dark:text-zinc-100 sm:px-8 lg:px-12">
                {breadcrumb}

                <div className="mx-auto flex min-h-[55vh] max-w-xl flex-col items-center justify-center text-center">
                    <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-900">
                        <Package
                            size={34}
                            strokeWidth={1.5}
                            className="text-zinc-500 dark:text-zinc-400"
                        />
                    </div>

                    <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                        No orders yet
                    </h1>

                    <p className="mt-3 max-w-sm text-sm leading-6 text-zinc-500 dark:text-zinc-400">
                        You haven't placed any orders yet. Explore our
                        collection and find something you love.
                    </p>

                    <Link
                        href="/"
                        className="mt-7 inline-flex items-center gap-2 rounded-full bg-zinc-950 px-6 py-3 text-sm font-medium text-white transition hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
                    >
                        Start Shopping
                        <ArrowRight size={16} />
                    </Link>
                </div>
            </main>
        )
    }

    return (
        <main className="min-h-screen bg-white px-5 py-8 text-zinc-950 transition-colors dark:bg-zinc-950 dark:text-zinc-100 sm:px-8 lg:px-12">
            {breadcrumb}

            {/* Page heading */}
            <section className="mb-10 border-b border-zinc-200 pb-7 dark:border-zinc-800">
                <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-zinc-100 dark:bg-zinc-900">
                        <ShoppingBag
                            size={23}
                            strokeWidth={1.6}
                            className="text-zinc-800 dark:text-zinc-200"
                        />
                    </div>

                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                            My Orders
                        </h1>

                        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                            Track and manage your purchases.
                        </p>
                    </div>
                </div>
            </section>

            {/* Orders content */}
            <section className="w-full">
                <div className="mb-5 flex items-center justify-between">
                    <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                        Order History
                    </h2>

                    <span className="rounded-full bg-zinc-300 px-3 py-1 text-sm font-medium text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300">
                        {orders.length}{" "}
                        {orders.length === 1 ? "order" : "orders"}
                    </span>
                </div>

                <div className="space-y-4">
                    {orders.map((order) => (
                        <article
                            key={order.id}
                            className="group rounded-2xl border border-zinc-200 bg-white p-5 transition duration-200 hover:border-zinc-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900/60 dark:hover:border-zinc-700 dark:hover:bg-zinc-900 sm:p-6"
                        >
                            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                                {/* Order information */}
                                <div className="min-w-0 flex-1">
                                    <div className="flex flex-wrap items-center gap-3">
                                        <h3 className="break-all text-base font-semibold tracking-tight text-zinc-950 dark:text-zinc-100 sm:text-lg">
                                            #{order.order_id}
                                        </h3>

                                        <span
                                            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium capitalize ${
                                                order.order_status?.toLowerCase() ===
                                                "delivered"
                                                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400"
                                                    : order.order_status?.toLowerCase() ===
                                                        "cancelled"
                                                      ? "bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-400"
                                                      : "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-400"
                                            }`}
                                        >
                                            {order.order_status}
                                        </span>
                                    </div>

                                    <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-zinc-600 dark:text-zinc-400">
                                        <span className="inline-flex items-center gap-2">
                                            <CalendarDays size={16} />
                                            {formatDate(order.created_at)}
                                        </span>

                                        <span className="inline-flex items-center text-zinc-700 gap-2">
                                            <Package size={16} />
                                            {order.count}{" "}
                                            {order.count === 1
                                                ? "item"
                                                : "items"}
                                        </span>
                                    </div>
                                </div>

                                {/* Price and action */}
                                <div className="flex flex-col gap-4 border-t border-zinc-100 pt-5 dark:border-zinc-800 sm:flex-row sm:items-center sm:justify-between lg:min-w-[300px] lg:justify-end lg:gap-8 lg:border-0 lg:pt-0">
                                    <div>
                                        <p className="mb-1 text-xs text-zinc-500 dark:text-zinc-400">
                                            Order total
                                        </p>

                                        <p className="text-xl font-semibold tracking-tight text-zinc-950 dark:text-white">
                                            ₹
                                            {Number(
                                                order.total_price
                                            ).toLocaleString("en-IN", {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                            })}
                                        </p>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            router.push(
                                                `/order/${order.order_id}`
                                            )
                                        }
                                        className="inline-flex items-center justify-center gap-2 rounded-full border border-zinc-300 px-5 py-3 text-sm font-medium text-zinc-800 transition hover:border-zinc-950 hover:bg-zinc-950 hover:text-white dark:border-zinc-700 dark:text-zinc-200 dark:hover:border-white dark:hover:bg-white dark:hover:text-zinc-950"
                                    >
                                        View Order
                                        <ChevronRight
                                            size={16}
                                            className="transition-transform group-hover:translate-x-0.5"
                                        />
                                    </button>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </section>
        </main>
    )
}