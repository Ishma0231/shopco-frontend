"use client"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { LoaderCircle, X } from "lucide-react"

import {
    TextField,
    MenuItem,
    Checkbox,
    FormControlLabel,
} from "@mui/material"

import PhoneInput, {
    isValidPhoneNumber,
} from "react-phone-number-input"

import "react-phone-number-input/style.css"

import { State, City } from "country-state-city"

import { createAddressThunk } from "@/features/address/addressSlice"
import { setSnackbarMessage } from "@/features/snackbar/snackbarSlice"


export default function AddressCreateForm({ onClose }) {

    const dispatch = useDispatch()

    const { createAddressLoading } = useSelector(
        (state) => state.address
    )

    const [addressType, setAddressType] = useState("home")
    const [fullName, setFullName] = useState("")
    const [phoneNumber, setPhoneNumber] = useState("")
    const [streetAddress, setStreetAddress] = useState("")
    const [landmark, setLandmark] = useState("")

    const [state, setState] = useState("")
    const [city, setCity] = useState("")

    const [states, setStates] = useState([])
    const [cities, setCities] = useState([])

    const [postalCode, setPostalCode] = useState("")

    const [isDefault, setIsDefault] = useState(false)

    const [error, setError] = useState({})


    useEffect(() => {

        const indiaStates = State.getStatesOfCountry("IN")

        setStates(indiaStates)

    }, [])


    const handleStateChange = (e) => {

        const selectedStateCode = e.target.value

        setState(selectedStateCode)

        setCity("")

        const stateCities = City.getCitiesOfState(
            "IN",
            selectedStateCode
        )

        setCities(stateCities)
    }


   const handlePostalCodeChange = (e) => {
    const value = e.target.value
        .replace(/\D/g, "")
        .slice(0, 6)

    setPostalCode(value)

    if (value.length === 0) {
        setError((prev) => ({
            ...prev,
            postalCode: "",
        }))
    } else if (value.length < 6) {
        setError((prev) => ({
            ...prev,
            postalCode: "PIN code must be 6 digits",
        }))
    } else if (!/^[1-9][0-9]{5}$/.test(value)) {
        setError((prev) => ({
            ...prev,
            postalCode: "Please enter a valid PIN code",
        }))
    } else {
        setError((prev) => ({
            ...prev,
            postalCode: "",
        }))
    }
}

    const handleSubmit = async (e) => {

        e.preventDefault()

        const newErrors = {}

        if (!fullName.trim()) {
            newErrors.fullName = "Please fill this field"
        }

        if (!phoneNumber) {
            newErrors.phoneNumber = "Please fill this field"
        } else if (!isValidPhoneNumber(phoneNumber)) {
            newErrors.phoneNumber =
                "Please enter a valid phone number"
        }

        if (!streetAddress.trim()) {
            newErrors.streetAddress =
                "Please fill this field"
        }

        if (!state) {
            newErrors.state =
                "Please select a state"
        }

        if (!city) {
            newErrors.city =
                "Please select a city"
        }

        if (!postalCode) {
            newErrors.postalCode =
                "Please fill this field"
        } else if (!/^[1-9][0-9]{5}$/.test(postalCode)) {
            newErrors.postalCode =
                "Please enter a valid PIN code"
        }

        setError(newErrors)

        if (Object.keys(newErrors).length > 0) {
            return
        }


        const data = {
            address_type: addressType,
            full_name: fullName.trim(),
            phone_number: phoneNumber,
            street_address: streetAddress.trim(),
            landmark: landmark.trim(),
            city: city,

            state: states.find(
                (stateItem) =>
                    stateItem.isoCode === state
            )?.name,

            country: "IN",

            postal_code: postalCode,

            is_default: isDefault,
        }


        try {

            await dispatch(
                createAddressThunk(data)
            ).unwrap()

            dispatch(
                setSnackbarMessage(
                    "Address added successfully"
                )
            )

            onClose()

        } catch (error) {

            dispatch(
                setSnackbarMessage(
                    error?.message ||
                    "Failed to add address"
                )
            )
        }
    }


    return (

        <div
            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
            onClick={onClose}
        >

            <div
                className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg bg-white dark:bg-gray-800 p-6 shadow-xl"
                onClick={(e) => e.stopPropagation()}
            >

                <button
                    type="button"
                    onClick={onClose}
                    className="absolute right-4 top-4 rounded-full p-1 hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                    <X size={20} />
                </button>


                <h2 className="text-xl font-semibold mb-6">
                    Add Address
                </h2>


                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-4"
                >

                    <TextField
                        select
                        label="Address Type"
                        value={addressType}
                        onChange={(e) =>
                            setAddressType(e.target.value)
                        }
                        fullWidth
                    >
                        <MenuItem value="home">
                            Home
                        </MenuItem>

                        <MenuItem value="office">
                            Office
                        </MenuItem>
                    </TextField>


                    <TextField
                        label="Full Name"
                        value={fullName}
                        onChange={(e) =>
                            setFullName(e.target.value)
                        }
                        error={Boolean(error.fullName)}
                        helperText={error.fullName}
                        fullWidth
                    />

                    <div>

                        <PhoneInput
                            international
                            defaultCountry="IN"
                            value={phoneNumber}
                            onChange={setPhoneNumber}
                            placeholder="Enter phone number"
                            className="border rounded-md px-3 py-3"
                        />

                        {error.phoneNumber && (
                            <p className="mt-1 text-sm text-red-500">
                                {error.phoneNumber}
                            </p>
                        )}

                    </div>

                    <TextField
                        label="Street Address"
                        value={streetAddress}
                        onChange={(e) =>
                            setStreetAddress(e.target.value)
                        }
                        error={Boolean(error.streetAddress)}
                        helperText={error.streetAddress}
                        multiline
                        rows={2}
                        fullWidth
                    />

                    <TextField
                        label="Landmark (Optional)"
                        value={landmark}
                        onChange={(e) =>
                            setLandmark(e.target.value)
                        }
                        fullWidth
                    />

                    <TextField
                        select
                        label="State"
                        value={state}
                        onChange={handleStateChange}
                        error={Boolean(error.state)}
                        helperText={error.state}
                        fullWidth
                    >

                        {states.map((stateItem) => (

                            <MenuItem
                                key={stateItem.isoCode}
                                value={stateItem.isoCode}
                            >
                                {stateItem.name}
                            </MenuItem>

                        ))}

                    </TextField>

                    <TextField
                        select
                        label="City"
                        value={city}
                        onChange={(e) =>
                            setCity(e.target.value)
                        }
                        error={Boolean(error.city)}
                        helperText={error.city}
                        disabled={!state}
                        fullWidth
                    >

                        {cities.map((cityItem) => (

                            <MenuItem
                                key={cityItem.name}
                                value={cityItem.name}
                            >
                                {cityItem.name}
                            </MenuItem>

                        ))}

                    </TextField>

                    <TextField
                        label="Country"
                        value="India"
                        disabled
                        fullWidth
                    />

                    <TextField
                        label="PIN Code"
                        value={postalCode}
                        onChange={handlePostalCodeChange}
                        error={Boolean(error.postalCode)}
                        helperText={error.postalCode}
                        slotProps={{
                        htmlInput: {
                            maxLength: 6,
                            inputMode: "numeric",
                        },
                    }}
                    fullWidth
                    />

                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={isDefault}
                                onChange={(e) =>
                                    setIsDefault(
                                        e.target.checked
                                    )
                                }
                            />
                        }
                        label="Set as default address"
                    />

                    <button
                        type="submit"
                        disabled={createAddressLoading}
                        className="flex items-center justify-center gap-2 rounded-md bg-black px-4 py-3 text-white hover:bg-gray-800 disabled:opacity-50"
                    >

                        {createAddressLoading ? (
                            <>
                                <LoaderCircle
                                    size={20}
                                    className="animate-spin"
                                />

                                Adding...
                            </>
                        ) : (
                            "Add Address"
                        )}

                    </button>

                </form>

            </div>

        </div>
    )
}