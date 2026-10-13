"use client"

import { useState, useRef } from "react"
import { LoaderCircle, X, Plus } from "lucide-react"
import Rating from "@mui/material/Rating"
import { createReviewThunk } from "@/features/reviews/reviewSlice"
import { useDispatch, useSelector } from "react-redux"
import { TextField } from "@mui/material"

export default function AddReviewModal({
    slug,
    onClose,
    onReviewResponse,
    onReviewCreated
}) {
    const dispatch = useDispatch()
    const { createReviewLoading } = useSelector((state) => state.reviews)
    const fileInputRef = useRef(null)

    const [rating, setRating] = useState(0)
    const [title, setTitle] = useState("")
    const [comment, setComment] = useState("")
    const [images, setImages] = useState([])
    const [errors, setErrors] = useState({})

    const handleClose = () => {
        setRating(0)
        setTitle("")
        setComment("")
        setImages([])
        setErrors({})
        onClose()
    }

    const handleSubmit = async () => {
        const formData = new FormData()
        const newErrors = {}

        if (!rating) {
            newErrors.rating = "Please choose a rating"
        }

        if (!title.trim()) {
            newErrors.title = "Please fill in this field."
        }

        if (!comment.trim()) {
            newErrors.comment = "Please fill in this field."
        }

        setErrors(newErrors)

        if (Object.keys(newErrors).length > 0) {
            return
        }

        formData.append("rating", rating)
        formData.append("title", title)
        formData.append("comment", comment)

        images.forEach((image) => {
            formData.append("images", image)
        })

        try {
            await dispatch(
                createReviewThunk({
                    slug,
                    data: formData
                })
            ).unwrap()

            handleClose()
            onReviewCreated()
            onReviewResponse("Review added successfully")
        } catch (error) {
            onReviewResponse("Failed to add Review")
        }
    }

    const handleImageDelete = (imageIndex) => {
        setImages((previousImages) =>
            previousImages.filter((_, index) => index !== imageIndex)
        )
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-black/50 p-4"
            onClick={handleClose}
        >
            <div
                className="relative flex h-[calc(100dvh-3rem)] max-h-[600px] w-full max-w-xl flex-col overflow-hidden rounded-xl bg-white dark:bg-gray-900"
                onClick={(event) => event.stopPropagation()}
            >
                <div className="flex shrink-0 items-center justify-between border-b border-gray-200 p-6 dark:border-gray-800">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                        Write a Review
                    </h2>

                    <button
                        type="button"
                        onClick={handleClose}
                        className="rounded-full p-1 text-gray-600 transition active:scale-95 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-6">
                    <div className="mt-6">
                        <p className="mb-2 text-sm font-semibold text-gray-800 dark:text-gray-200">
                            Rating
                        </p>
                            <Rating
                value={rating}
                onChange={(event, newValue) => {
                    setRating(newValue)
                }}
                precision={1}
                sx={{
                    fontSize: "2rem",
                    "& .MuiRating-iconFilled": {
                        color: "#f59e0b",
                    },
                    "& .MuiRating-iconEmpty": {
                        color: "#6b7280",
                    },
                }}
            />

                        {errors?.rating && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.rating}
                            </p>
                        )}
                    </div>

                    <div className="mt-5">
                        <TextField
                            label="Review title"
                            value={title}
                            onChange={(event) => {
                                setTitle(event.target.value)
                            }}
                            error={Boolean(errors?.title)}
                            helperText={errors?.title || ""}
                            fullWidth
                        />
                    </div>

                    <div className="mt-5">
                        <TextField
                            label="Your Review"
                            value={comment}
                            onChange={(event) => {
                                setComment(event.target.value)
                            }}
                            rows={5}
                            multiline
                            sx={{ width: "100%" }}
                            error={Boolean(errors?.comment)}
                            helperText={errors?.comment || ""}
                        />
                    </div>

                    <div className="mt-5">
                        <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                            Add Photos
                        </p>

                        <input
                            ref={fileInputRef}
                            multiple
                            accept="image/*"
                            type="file"
                            onChange={(event) => {
                                setImages((previous) => {
                                    const selectedFiles = Array.from(
                                        event.target.files
                                    )
                                    return [...previous, ...selectedFiles]
                                })
                            }}
                            className="hidden"
                        />

                        <div className="mt-3 flex w-full gap-3 overflow-x-auto">
                            {images.map((image, index) => (
                                <div
                                    key={index}
                                    className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg transition-transform duration-300 hover:scale-105"
                                >
                                    <img
                                        src={URL.createObjectURL(image)}
                                        alt=""
                                        className="h-full w-full object-contain"
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleImageDelete(index)
                                        }
                                        className="absolute right-1 top-1 rounded-full bg-white p-1 text-black shadow-md transition active:scale-95 hover:scale-105"
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                            ))}

                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="flex h-24 w-24 shrink-0 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-white text-gray-500 transition-all duration-200 active:scale-95 hover:border-gray-500 hover:text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-gray-400 dark:hover:text-white"
                            >
                                <Plus size={24} />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex shrink-0 justify-end gap-3 border-t border-gray-200 p-6 dark:border-gray-800">
                    <button
                        type="button"
                        onClick={handleClose}
                        className="rounded-md px-4 py-2 text-gray-800 transition active:scale-95 active:bg-white/20 hover:bg-gray-200 dark:text-gray-200 dark:hover:bg-gray-700"
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={createReviewLoading}
                        className="flex min-w-20 shadow hover:shadow-white/20 active:translate-y-0 transition-all duration-300  hover:-translate-y-0.5  items-center justify-center rounded-md bg-black px-4 py-2 text-white active:scale-95 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-white dark:text-black"
                    >
                        {createReviewLoading ? (
                            <LoaderCircle size={18} className="animate-spin" />
                        ) : (
                            "Submit"
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}
