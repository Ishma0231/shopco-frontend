import { useState } from "react"
import { useDispatch } from "react-redux"
import { Pencil, Trash2, LoaderCircle } from "lucide-react"

import {updateAddressThunk,deleteAddressThunk} from "@/features/address/addressSlice"

import { setSnackbarMessage } from "@/features/snackbar/snackbarSlice"


export default function AddressCard({address,selectedAddress,onSelect,onEdit}){

    const dispatch = useDispatch()

    const [defaultLoading, setDefaultLoading]=useState(false)
    const [deleteLoading, setDeleteLoading]=useState(false)


    const handleSetDefault = async () => {
        try {
            setDefaultLoading(true)
            const response = await dispatch(
                updateAddressThunk({
                    addressId: address.id,
                    data: {
                        is_default: true
                    }
                })
            ).unwrap()

            dispatch(
                setSnackbarMessage(
                    response?.message || "Default address updated successfully"
                )
            )

        } catch (error) {

            dispatch(
                setSnackbarMessage(
                    error?.message || "Failed to update default address"
                )
            )

        } finally {

            setDefaultLoading(false)

        }
    }


    const handleDelete = async () => {

        try {

            setDeleteLoading(true)

            const response = await dispatch(
                deleteAddressThunk(address.id)
            ).unwrap()

            dispatch(
                setSnackbarMessage(
                    response?.message || "Address deleted successfully"
                )
            )

        } catch (error) {

            dispatch(
                setSnackbarMessage(
                    error?.message || "Failed to delete address"
                )
            )

        } finally {

            setDeleteLoading(false)

        }
    }


    return (
        <div
            className={`
                relative
                rounded-lg
                bg-white
                dark:bg-gray-800
                p-4
                pl-12
                shadow-md
                border-2
                transition
                ${
                    selectedAddress === address.id
                        ? "border-blue-500"
                        : "border-transparent"
                }
            `}
        >

       
            <input
                type="radio"
                name="selected-address"
                checked={selectedAddress === address.id}
                onChange={() => onSelect(address.id)}
                className="absolute top-4 left-4 w-5 h-5"
            />


            <div className="flex flex-col gap-1">

                <div className="flex items-center gap-2 flex-wrap">

                    <h3 className="font-semibold text-lg">
                        {address.full_name}
                    </h3>

                    <span className="text-xs px-2 py-1 rounded-full bg-gray-200 dark:bg-gray-700 capitalize">
                        {address.address_type}
                    </span>

                </div>


                <p className="text-sm text-gray-600 dark:text-gray-300">
                    {address.phone_number}
                </p>


                <p className="text-sm">
                    {address.street_address}
                </p>


                {address.landmark && (
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                        {address.landmark}
                    </p>
                )}


                <p className="text-sm">
                    {address.city}, {address.state}
                </p>


                <p className="text-sm">
                    {address.country} - {address.postal_code}
                </p>


                <div className="flex items-center gap-2 mt-4 flex-wrap">

                    {address.is_default ? (

                        <span className="px-3 py-2 rounded-md bg-green-100 text-green-700 font-semibold text-sm">
                            ✓ Default Address
                        </span>

                    ) : (

                        <button
                            type="button"
                            onClick={handleSetDefault}
                            disabled={defaultLoading}
                            className="px-3 py-2 rounded-md bg-green-100 text-green-700 font-semibold text-sm flex justify-center items-center gap-2 active:scale-95"
                        >
                            {defaultLoading ? (
                                <LoaderCircle
                                    size={16}
                                    className="animate-spin"
                                />
                            ) : (
                                "Set as Default"
                            )}
                        </button>

                    )}


                    {/* Edit */}

                    <button
                        type="button"
                        onClick={() => onEdit(address)}
                        className="p-2 rounded-md bg-gray-100 dark:bg-gray-700 active:scale-95"
                    >
                        <Pencil size={18} />
                    </button>


                    {/* Delete */}

                    <button
                        type="button"
                        onClick={handleDelete}
                        disabled={deleteLoading}
                        className="p-2 rounded-md bg-gray-100 dark:bg-gray-700 text-red-600 active:scale-95"
                    >
                        {deleteLoading ? (
                            <LoaderCircle
                                size={18}
                                className="animate-spin"
                            />
                        ) : (
                            <Trash2 size={18} />
                        )}
                    </button>

                </div>

            </div>

        </div>
    )
}