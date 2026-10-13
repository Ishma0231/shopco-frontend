"use client"

import AddressCard from "@/components/address/addressCard"
import AddressCreateModal from "@/components/address/addressCreateForm"
import AddressEditModal from "@/components/address/addressEditForm"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { LoaderCircle, Plus, ChevronRight } from "lucide-react"
import { useDispatch, useSelector } from "react-redux"
import { fetchAddresses } from "@/features/address/addressSlice"
import { checkoutThunk } from "@/features/orders/orderSlice"
import { setSnackbarMessage } from "@/features/snackbar/snackbarSlice"
import { Radio, FormControlLabel, Breadcrumbs } from "@mui/material"
import Link from "next/link"

export default function Checkout() {
    const dispatch = useDispatch()
    const router = useRouter()

    const { addresses, addressLoading } = useSelector(
        (state) => state.address
    )

    const { checkoutLoading } = useSelector(
        (state) => state.order
    )

    const [createModalOpen, setCreateModalOpen] = useState(false)
    const [editModal, setEditModal] = useState(null)
    const [addressId, setAddressId] = useState("")
    const [paymentMode, setPaymentMode] = useState("")
    const [error, setError] = useState({})

    useEffect(() => {
        dispatch(fetchAddresses())
    }, [dispatch])

    useEffect(() => {
        if (addresses.length > 0 && !addressId) {
            const defaultAddress = addresses.find(
                (address) => address.is_default
            )

            if (defaultAddress) {
                setAddressId(defaultAddress.id)
            }
        }
    }, [addresses, addressId])

    const handleCheckout = async () => {
        const newError = {}

        if (!addressId) {
            newError.addressId = "Please choose an address"
        }

        if (!paymentMode) {
            newError.paymentMode = "Please choose a payment mode"
        }

        setError(newError)

        if (Object.keys(newError).length > 0) {
            return
        }

        try {
            await dispatch(
                checkoutThunk({
                    address: Number(addressId),
                    payment_method: paymentMode
                })
            ).unwrap()

            const params = new URLSearchParams()

            params.set("addressId", addressId)
            params.set("paymentMode", paymentMode)

            router.push(
                `/checkout/confirm?${params.toString()}`
            )
        } catch (error) {
            dispatch(
                setSnackbarMessage(
                    error?.message || "Something went wrong"
                )
            )
        }
    }

    return (
        <div className="flex flex-col gap-6 p-3">
            <div className="ml-6">
                <Breadcrumbs
                    aria-label="breadcrumb"
                    separator={<ChevronRight size={18} />}
                    sx={{ mb: 3 }}
                >
                    <Link
                        href="/"
                        className="font-semibold text-blue-500 dark:text-[#24a0ed]"
                    >
                        Home
                    </Link>

                    <Link
                        href="/cart"
                        className="font-semibold text-blue-500 dark:text-[#24a0ed]"
                    >
                        Cart
                    </Link>

                    <span className="font-semibold dark:text-gray-300">
                        Checkout
                    </span>
                </Breadcrumbs>
            </div>

            <section>
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">
                        Choose an Address
                    </h1>

                    <button
                        type="button"
                        onClick={() => setCreateModalOpen(true)}
                        className="flex items-center gap-1 rounded-md bg-blue-500 px-3 py-2 font-semibold text-white shadow-md transition hover:bg-blue-600 active:scale-95"
                    >
                        <Plus size={18} />
                        Add Address
                    </button>
                </div>

                {error.addressId && (
                    <p className="mt-2 text-sm text-red-600">
                        {error.addressId}
                    </p>
                )}

                {addressLoading ? (
                    <div className="flex items-center justify-center py-10">
                        <LoaderCircle
                            size={28}
                            className="animate-spin"
                        />
                    </div>
                ) : addresses.length === 0 ? (
                    <div className="mt-4 rounded-2xl border border-gray-200 bg-gray-50 px-6 py-10 text-center shadow-sm dark:border-gray-800 dark:bg-gray-900">
                        <p className="font-semibold text-gray-800 dark:text-gray-100">
                            No addresses found
                        </p>

                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            Add an address to continue with your order.
                        </p>
                    </div>
                ) : (
                    <div className="mt-4 grid grid-cols-1 gap-4">
                        {addresses.map((address) => (
                            <AddressCard
                                key={address.id}
                                address={address}
                                selectedAddress={addressId}
                                onSelect={setAddressId}
                                onEdit={setEditModal}
                            />
                        ))}
                    </div>
                )}
            </section>

            <section>
                <h2 className="text-xl font-semibold">
                    Payment Method
                </h2>

                {error.paymentMode && (
                    <p className="mt-2 text-sm text-red-600">
                        {error.paymentMode}
                    </p>
                )}

                <div className="mt-3">
                    <FormControlLabel
                        control={
                            <Radio
                                checked={paymentMode === "cod"}
                                onChange={() => setPaymentMode("cod")}
                            />
                        }
                        label="Cash on Delivery"
                    />
                </div>
            </section>

            <div className="flex justify-end">
                <button
                    type="button"
                    onClick={handleCheckout}
                    disabled={checkoutLoading}
                    className="flex items-center justify-center gap-2 rounded-md bg-blue-500 px-5 py-3 font-semibold text-white shadow-md transition hover:bg-blue-600 active:scale-95 disabled:opacity-60"
                >
                    {checkoutLoading ? (
                        <LoaderCircle
                            size={18}
                            className="animate-spin"
                        />
                    ) : (
                        "Proceed"
                    )}
                </button>
            </div>

            {createModalOpen && (
                <AddressCreateModal
                    onClose={() => setCreateModalOpen(false)}
                />
            )}

            {editModal && (
                <AddressEditModal
                    address={editModal}
                    onClose={() => setEditModal(null)}
                />
            )}
        </div>
    )
}