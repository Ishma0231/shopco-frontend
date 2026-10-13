"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
    LoaderCircle,
    ChevronRight,
    ShoppingBag,
    MapPin,
    Phone,
    Package,
    CheckCircle2,
    ArrowLeft,
    ShieldCheck,
} from "lucide-react";
import { fetchAddresses } from "@/features/address/addressSlice";
import { fetchCart } from "@/features/cart/cartSlice";
import { createOrderThunk } from "@/features/orders/orderSlice";
import { setSnackbarMessage } from "@/features/snackbar/snackbarSlice";
import { Breadcrumbs } from "@mui/material";
import Link from "next/link";

export default function CheckoutConfirm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const dispatch = useDispatch();

    const addressId = searchParams.get("addressId");
    const paymentMode = searchParams.get("paymentMode");

    const { addresses, addressLoading } = useSelector(
        (state) => state.address
    );

    const { cart, cartLoading } = useSelector(
        (state) => state.cart
    );

    const { createOrderLoading } = useSelector(
        (state) => state.order
    );

    const [selectedAddress, setSelectedAddress] = useState(null);

    useEffect(() => {
        dispatch(fetchAddresses());
        dispatch(fetchCart());
    }, [dispatch]);

    useEffect(() => {
        if (addresses.length > 0 && addressId) {
            const address = addresses.find(
                (address) => address.id === Number(addressId)
            );

            setSelectedAddress(address || null);
        } else {
            setSelectedAddress(null);
        }
    }, [addresses, addressId]);

    const handlePlaceOrder = async () => {
        if (!addressId || !paymentMode) {
            dispatch(setSnackbarMessage("Invalid checkout details"));
            return;
        }

        try {
            const response = await dispatch(
                createOrderThunk({
                    address: Number(addressId),
                    payment_method: paymentMode,
                })
            ).unwrap();

            router.replace(
                `/order/success?orderId=${response.order_id}`
            );
        } catch (error) {
            dispatch(
                setSnackbarMessage(
                    error?.message || "Failed to place order"
                )
            );
        }
    };

    const getProductImageUrl = (image) => {
        if (!image) return null;

        if (
            image.startsWith("http://") ||
            image.startsWith("https://")
        ) {
            return image;
        }

        const apiUrl =
            process.env.NEXT_PUBLIC_API_URL ||
            "http://localhost:8080/api";

        const backendUrl = apiUrl.replace(/\/api\/?$/, "");

        return `${backendUrl}${image.startsWith("/") ? image : `/${image}`}`;
    };

    const formatPrice = (price) =>
        Number(price ?? 0).toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });

    if (addressLoading || cartLoading) {
        return (
            <div className="flex min-h-[70vh] items-center justify-center bg-white dark:bg-zinc-950">
                <LoaderCircle
                    size={36}
                    className="animate-spin text-zinc-700 dark:text-zinc-300"
                />
            </div>
        );
    }

    if (
        !selectedAddress ||
        !cart ||
        !cart.items ||
        cart.items.length === 0
    ) {
        return (
            <div className="flex min-h-[70vh] items-center justify-center bg-white px-4 py-12 dark:bg-zinc-950">
                <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-8 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                    <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                        <ShoppingBag size={28} />
                    </div>

                    <h2 className="text-2xl font-semibold text-zinc-950 dark:text-white">
                        Nothing to review
                    </h2>

                    <p className="mt-3 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
                        Your checkout details are incomplete, or your cart
                        has no items available to order.
                    </p>

                    <Link
                        href="/cart"
                        className="mt-6 inline-flex items-center justify-center gap-2 rounded-lg bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800 active:scale-[0.98] dark:bg-white dark:text-black dark:hover:bg-zinc-200"
                    >
                        <ArrowLeft size={16} />
                        Return to Cart
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
            <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
                {/* Breadcrumbs */}
                <div className="mb-6 overflow-x-auto">
                    <Breadcrumbs
                        aria-label="breadcrumb"
                        separator={
                            <ChevronRight
                                size={16}
                                className="text-zinc-400"
                            />
                        }
                        sx={{
                            "& .MuiBreadcrumbs-ol": {
                                flexWrap: "nowrap",
                            },
                        }}
                    >
                        <Link
                            href="/"
                            className="whitespace-nowrap text-sm font-medium text-zinc-500 transition hover:text-black dark:text-zinc-400 dark:hover:text-white"
                        >
                            Home
                        </Link>

                        <Link
                            href="/cart"
                            className="whitespace-nowrap text-sm font-medium text-zinc-500 transition hover:text-black dark:text-zinc-400 dark:hover:text-white"
                        >
                            Cart
                        </Link>

                        <Link
                            href="/checkout"
                            className="whitespace-nowrap text-sm font-medium text-zinc-500 transition hover:text-black dark:text-zinc-400 dark:hover:text-white"
                        >
                            Checkout
                        </Link>

                        <span className="whitespace-nowrap text-sm font-semibold text-zinc-900 dark:text-white">
                            Review Order
                        </span>
                    </Breadcrumbs>
                </div>

                {/* Page Heading */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold tracking-tight text-zinc-950 dark:text-white sm:text-3xl">
                        Review Your Order
                    </h1>

                    <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                        Review your delivery details and items before placing
                        your order.
                    </p>
                </div>

                {/* Main Layout */}
                <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px] xl:gap-8">
                    {/* Left Column */}
                    <div className="min-w-0 space-y-6">
                        {/* Delivery Address */}
                        <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 sm:p-6">
                            <div className="mb-5 flex items-center gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">
                                    <MapPin size={20} />
                                </div>

                                <div>
                                    <h2 className="text-lg font-semibold text-zinc-950 dark:text-white sm:text-xl">
                                        Delivery Address
                                    </h2>

                                    <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                                        Your order will be delivered here
                                    </p>
                                </div>
                            </div>

                            <div className="rounded-xl border border-zinc-100 bg-zinc-50/70 p-4 dark:border-zinc-800 dark:bg-zinc-950/60">
                                <p className="font-semibold text-zinc-950 dark:text-white">
                                    {selectedAddress.full_name}
                                </p>

                                <p className="mt-2 flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-300">
                                    <Phone
                                        size={15}
                                        className="shrink-0 text-zinc-400"
                                    />
                                    {selectedAddress.phone_number}
                                </p>

                                <div className="mt-3 space-y-1 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
                                    <p>{selectedAddress.street_address}</p>

                                    {selectedAddress.landmark && (
                                        <p>{selectedAddress.landmark}</p>
                                    )}

                                    <p>
                                        {selectedAddress.city},{" "}
                                        {selectedAddress.state}
                                    </p>

                                    <p>
                                        {selectedAddress.country} -{" "}
                                        {selectedAddress.postal_code}
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Payment Method */}
                        <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 sm:p-6">
                            <div className="mb-5 flex items-center gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">
                                    <ShieldCheck size={20} />
                                </div>

                                <div>
                                    <h2 className="text-lg font-semibold text-zinc-950 dark:text-white sm:text-xl">
                                        Payment Method
                                    </h2>

                                    <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                                        Your selected payment option
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-900/80 dark:bg-emerald-950/30">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300">
                                    <ShoppingBag size={23} />
                                </div>

                                <div className="min-w-0 flex-1">
                                    <p className="font-semibold text-emerald-950 dark:text-emerald-200">
                                        {paymentMode === "cod"
                                            ? "Cash on Delivery"
                                            : paymentMode}
                                    </p>

                                    <p className="mt-1 text-sm leading-5 text-emerald-800/80 dark:text-emerald-300/80">
                                        Pay when your order arrives at your
                                        doorstep.
                                    </p>
                                </div>

                                <CheckCircle2
                                    size={21}
                                    className="shrink-0 text-emerald-600 dark:text-emerald-400"
                                />
                            </div>
                        </section>

                        {/* Cart Items */}
                        <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 sm:p-6">
                            <div className="mb-6 flex items-center justify-between gap-3">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">
                                        <Package size={20} />
                                    </div>

                                    <div>
                                        <h2 className="text-lg font-semibold text-zinc-950 dark:text-white sm:text-xl">
                                            Your Items
                                        </h2>

                                        <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                                            {cart.count ?? cart.items.length}{" "}
                                            items in your cart
                                        </p>
                                    </div>
                                </div>

                                <Link
                                    href="/cart"
                                    className="shrink-0 text-sm font-medium text-zinc-600 underline underline-offset-4 transition hover:text-black dark:text-zinc-300 dark:hover:text-white"
                                >
                                    Edit Cart
                                </Link>
                            </div>

                            <div className="space-y-5">
                                {cart.items.map((item) => {
                                    const imageUrl = getProductImageUrl(
                                        item.primary_image
                                    );

                                    return (
                                        <div
                                            key={item.id}
                                            className="flex min-w-0 gap-4 border-b border-zinc-200 pb-5 last:border-b-0 last:pb-0 dark:border-zinc-800"
                                        >
                                            {/* Product Image */}
                                            <div className="relative h-28 w-24 shrink-0 overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-800 sm:h-36 sm:w-32">
                                                {imageUrl ? (
                                                    <img
                                                        src={imageUrl}
                                                        alt={item.product_name}
                                                        className="h-full w-full object-cover"
                                                        onError={(event) => {
                                                            event.currentTarget.style.display =
                                                                "none";
                                                        }}
                                                    />
                                                ) : (
                                                    <div className="flex h-full w-full items-center justify-center text-zinc-400 dark:text-zinc-500">
                                                        <ShoppingBag
                                                            size={28}
                                                        />
                                                    </div>
                                                )}
                                            </div>

                                            {/* Product Details */}
                                            <div className="flex min-w-0 flex-1 flex-col">
                                                <h3 className="font-semibold leading-6 text-zinc-950 dark:text-white">
                                                    {item.product_name}
                                                </h3>

                                                <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
                                                    <span
                                                        className="h-4 w-4 shrink-0 rounded-full border border-zinc-300 dark:border-zinc-600"
                                                        style={{
                                                            backgroundColor:
                                                                item.color,
                                                        }}
                                                    />

                                                    <span>
                                                        {item.color}
                                                    </span>

                                                    <span className="text-zinc-300 dark:text-zinc-700">
                                                        |
                                                    </span>

                                                    <span>
                                                        Size: {item.size}
                                                    </span>
                                                </div>

                                                <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
                                                    <span>
                                                        ₹
                                                        {formatPrice(
                                                            item.price
                                                        )}
                                                    </span>

                                                    <span>×</span>

                                                    <span>
                                                        {item.quantity}
                                                    </span>
                                                </div>

                                                <p className="mt-auto pt-3 text-sm font-semibold text-zinc-950 dark:text-white">
                                                    Subtotal: ₹
                                                    {formatPrice(
                                                        item.subtotal
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </section>
                    </div>

                  
                    <aside className="h-fit rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 sm:p-6 lg:sticky lg:top-24">
                        <h2 className="text-xl font-bold text-zinc-950 dark:text-white">
                            Order Summary
                        </h2>

                        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                            A final look at your order
                        </p>

                        <div className="mt-6 space-y-4">
                            <div className="flex items-center justify-between gap-4 text-sm">
                                <span className="text-zinc-500 dark:text-zinc-400">
                                    Items
                                </span>

                                <span className="font-medium text-zinc-900 dark:text-zinc-100">
                                    {cart.count ?? cart.items.length}
                                </span>
                            </div>

                            <div className="flex items-center justify-between gap-4 text-sm">
                                <span className="text-zinc-500 dark:text-zinc-400">
                                    Payment
                                </span>

                                <span className="font-medium text-zinc-900 dark:text-zinc-100">
                                    {paymentMode === "cod"
                                        ? "Cash on Delivery"
                                        : paymentMode}
                                </span>
                            </div>
                        </div>

                        <div className="my-5 border-t border-zinc-200 dark:border-zinc-800" />

                        <div className="flex items-center justify-between gap-4">
                            <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                                Total
                            </span>

                            <span className="text-xl font-bold tracking-tight text-zinc-950 dark:text-white">
                                ₹{formatPrice(cart.total)}
                            </span>
                        </div>

                        <button
                            type="button"
                            onClick={handlePlaceOrder}
                            disabled={createOrderLoading}
                            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-black px-5 py-3.5 text-sm font-semibold text-white transition duration-200 hover:bg-zinc-800 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
                        >
                            {createOrderLoading ? (
                                <>
                                    <LoaderCircle
                                        size={19}
                                        className="animate-spin"
                                    />
                                    Placing Order...
                                </>
                            ) : (
                                <>
                                    Place Order
                                    <ChevronRight size={18} />
                                </>
                            )}
                        </button>

                        <p className="mt-4 text-center text-xs leading-5 text-zinc-500 dark:text-zinc-400">
                            Please verify your delivery details before
                            placing your order.
                        </p>

                        <div className="mt-5 flex items-center justify-center gap-2 border-t border-zinc-200 pt-4 text-xs text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
                            <ShieldCheck size={15} />
                            Secure checkout
                        </div>
                    </aside>
                </div>
            </div>
        </main>
    );
}
// "use client"

// import { useEffect, useState } from "react"
// import { useRouter, useSearchParams } from "next/navigation"
// import { useDispatch, useSelector } from "react-redux"
// import { LoaderCircle, ChevronRight, ShoppingBag } from "lucide-react"
// import { fetchAddresses } from "@/features/address/addressSlice"
// import { fetchCart } from "@/features/cart/cartSlice"
// import { createOrderThunk } from "@/features/orders/orderSlice"
// import { setSnackbarMessage } from "@/features/snackbar/snackbarSlice"
// import { Breadcrumbs } from "@mui/material"
// import Link from "next/link"

// export default function CheckoutConfirm() {
//     const router = useRouter()
//     const searchParams = useSearchParams()
//     const dispatch = useDispatch()

//     const addressId = searchParams.get("addressId")
//     const paymentMode = searchParams.get("paymentMode")

//     const { addresses, addressLoading } = useSelector(
//         (state) => state.address
//     )

//     const { cart, cartLoading } = useSelector(
//         (state) => state.cart
//     )

//     const { createOrderLoading } = useSelector(
//         (state) => state.order
//     )

//     const [selectedAddress, setSelectedAddress] = useState(null)
// console.log("cart",cart||"cart")
//     useEffect(() => {
//         dispatch(fetchAddresses())
//         dispatch(fetchCart())
//     }, [dispatch])

//     useEffect(() => {
//         if (addresses.length > 0 && addressId) {
//             const address = addresses.find(
//                 (address) => address.id === Number(addressId)
//             )

//             setSelectedAddress(address || null)
//         }
//     }, [addresses, addressId])

//     const handlePlaceOrder = async () => {
//         if (!addressId || !paymentMode) {
//             dispatch(
//                 setSnackbarMessage("Invalid checkout details")
//             )
//             return
//         }

//         try {
//             const response = await dispatch(
//                 createOrderThunk({
//                     address: Number(addressId),
//                     payment_method: paymentMode
//                 })
//             ).unwrap()

//             router.replace(
//                 `/order/success?orderId=${response.order_id}`
//             )
//         } catch (error) {
//             dispatch(
//                 setSnackbarMessage(
//                     error?.message || "Failed to place order"
//                 )
//             )
//         }
//     }

//     if (addressLoading || cartLoading) {
//         return (
//             <div className="flex min-h-screen items-center justify-center">
//                 <LoaderCircle
//                     size={35}
//                     className="animate-spin text-gray-600 dark:text-gray-300"
//                 />
//             </div>
//         )
//     }

//     if (!selectedAddress || !cart || !cart.items || cart.items.length === 0) {
//         return (
//             <div className="flex min-h-[70vh] items-center justify-center px-4">
//                 <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-xl dark:border-gray-800 dark:bg-gray-900">

//                     <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400">
//                         <ShoppingBag size={28} />
//                     </div>

//                     <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
//                         Nothing to review
//                     </h2>

//                     <p className="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400">
//                         Your checkout details are incomplete or there are no items available to place an order.
//                     </p>

//                     <Link
//                         href="/cart"
//                         className="mt-6 inline-flex rounded-lg bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 active:scale-95 dark:bg-white dark:text-black dark:hover:bg-gray-200"
//                     >
//                         Go to Cart
//                     </Link>

//                 </div>
//             </div>
//         )
//     }

//     return (
//         <div className="mx-auto max-w-6xl px-4 py-8">
//             <div className="ml-6">
//                 <Breadcrumbs
//                     aria-label="breadcrumb"
//                     separator={<ChevronRight size={18} />}
//                     maxItems={4}
//                     sx={{ mb: 3 }}
//                 >
//                     <Link
//                         href="/"
//                         className="font-semibold text-blue-500 dark:text-[#24a0ed]"
//                     >
//                         Home
//                     </Link>

//                     <Link
//                         href="/cart"
//                         className="font-semibold text-blue-500 dark:text-[#24a0ed]"
//                     >
//                         Cart
//                     </Link>

//                     <Link
//                         href="/checkout"
//                         className="font-semibold text-blue-500 dark:text-[#24a0ed]"
//                     >
//                         Checkout
//                     </Link>

//                     <span className="font-semibold dark:text-gray-300">
//                         Review Order
//                     </span>
//                 </Breadcrumbs>
//             </div>

//             <h1 className="mb-8 text-3xl font-semibold">
//                 Review Your Order
//             </h1>

//             <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
//                 <div className="space-y-6 lg:col-span-2">

//                     <section className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
//                         <h2 className="mb-4 text-xl font-semibold">
//                             Delivery Address
//                         </h2>

//                         <div className="space-y-1">
//                             <p className="font-medium">
//                                 {selectedAddress.full_name}
//                             </p>

//                             <p>{selectedAddress.phone_number}</p>
//                             <p>{selectedAddress.street_address}</p>

//                             {selectedAddress.landmark && (
//                                 <p>{selectedAddress.landmark}</p>
//                             )}

//                             <p>
//                                 {selectedAddress.city},{" "}
//                                 {selectedAddress.state}
//                             </p>

//                             <p>
//                                 {selectedAddress.country} -{" "}
//                                 {selectedAddress.postal_code}
//                             </p>
//                         </div>
//                     </section>

//                     <section className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
//                         <h2 className="mb-4 text-xl font-semibold">
//                             Payment Method
//                         </h2>

//                         <div className="rounded-lg border-2 border-green-500 bg-green-50 p-4 dark:bg-green-950">
//                             <p className="font-medium text-green-700 dark:text-green-400">
//                                 {paymentMode === "cod"
//                                     ? "Cash on Delivery"
//                                     : paymentMode}
//                             </p>
//                         </div>
//                     </section>

//                     <section className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
//                         <h2 className="mb-6 text-xl font-semibold">
//                             Items
//                         </h2>

//                         <div className="space-y-6">
//                             {cart.items.map((item) => (
//                                 <div
//                                     key={item.id}
//                                     className="flex gap-4 border-b pb-5 last:border-b-0 last:pb-0"
//                                 >
//                                     <div className="h-32 w-28 shrink-0 overflow-hidden rounded-md">
//                                         <img
//                                             src={item.primary_image}
//                                             alt={item.product_name}
//                                             className="h-full w-full object-cover"
//                                         />
//                                     </div>

//                                     <div className="flex-1">
//                                         <h3 className="font-medium">
//                                             {item.product_name}
//                                         </h3>

//                                         <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
//                                             <span
//                                                 className="h-4 w-4 rounded-full border"
//                                                 style={{
//                                                     backgroundColor:
//                                                         item.color
//                                                 }}
//                                             />
//                                             <span>{item.color}</span>
//                                         </div>

//                                         <p className="mt-1 text-sm text-gray-500">
//                                             Size: {item.size}
//                                         </p>

//                                         <div className="mt-3 flex items-center gap-2 text-sm">
//                                             <span>₹{item.price}</span>
//                                             <span>×</span>
//                                             <span>{item.quantity}</span>
//                                         </div>

//                                         <p className="mt-1 font-medium">
//                                             Subtotal: ₹{item.subtotal}
//                                         </p>
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>
//                     </section>
//                 </div>

//                 <div className="h-fit rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
//                     <h2 className="mb-6 text-xl font-semibold">
//                         Order Summary
//                     </h2>

//                     <div className="flex justify-between">
//                         <span>Items</span>
//                         <span>{cart.items.length}</span>
//                     </div>

//                     <div className="mt-4 flex justify-between border-t pt-4 text-lg font-semibold">
//                         <span>Total</span>
//                         <span>₹{cart.total}</span>
//                     </div>

//                     <button
//                         type="button"
//                         onClick={handlePlaceOrder}
//                         disabled={createOrderLoading}
//                         className="mt-6 flex w-full items-center justify-center gap-2 rounded-md bg-green-600 py-3 font-medium text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
//                     >
//                         {createOrderLoading ? (
//                             <>
//                                 <LoaderCircle
//                                     size={20}
//                                     className="animate-spin"
//                                 />
//                                 Placing Order...
//                             </>
//                         ) : (
//                             "Place Order"
//                         )}
//                     </button>
//                 </div>
//             </div>
//         </div>
//     )
// }