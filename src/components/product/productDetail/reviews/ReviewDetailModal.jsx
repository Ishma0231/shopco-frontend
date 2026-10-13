"use client";

import { X, Trash2, Pencil, LoaderCircle } from "lucide-react";
import Rating from "@mui/material/Rating";
import { useDispatch, useSelector } from "react-redux";
import {
    deleteReviewImageThunk,
    createReviewImageThunk,
    deleteReviewThunk,
    updateReviewThunk,
} from "@/features/reviews/reviewSlice";
import { useState, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import {
    Navigation,
    Thumbs,
    Mousewheel,
    Autoplay,
    Scrollbar,
} from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import "swiper/css/scrollbar";

import { TextField } from "@mui/material";

export default function ReviewDetailModal({
    review,
    onResponse,
    onReviewEditSuccess,
    onClose,
    handleDeleteSuccess,
}) {
   
    const [title, setTitle] = useState(review.title);
    const [comment, setComment] = useState(review.comment);
    const [rating, setRating] = useState(review.rating);
    const [images, setImages] = useState(review.images || []);
    const [newImages, setNewImages] = useState([]);
    const [deletedImagesId, setDeletedImagesId] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [thumbsSwiper, setThumbsSwiper] = useState(null);
    const [errors, setErrors] = useState({});
    const [reviewEditLoading, setReviewEditLoading] = useState(false);

    const fileInputRef = useRef(null);
    const dispatch = useDispatch();

    const { deleteReviewLoading } = useSelector(
        (state) => state.reviews
    );

    const handleImageDelete = (imageId) => {
        setDeletedImagesId((previous) => [...previous, imageId]);

        setImages((previous) =>
            previous.filter((image) => image.id !== imageId)
        );
    };

    const handleReviewDelete = async () => {
        try {
            await dispatch(deleteReviewThunk(review.id)).unwrap();
          
            handleDeleteSuccess();
            onResponse("Deleted successfuly");
            onClose();
        } catch (error) {
            onResponse("Failed to delete review");
        }
    };

    const handleNewImageDelete = (imageIndex) => {
        setNewImages((previous) =>
            previous.filter((_, index) => index !== imageIndex)
        );
    };

    const handleReviewEdit = async () => {
        const newErrors = {};

        setReviewEditLoading(true);

        if (!rating) {
            newErrors["rating"] = "Please choose a rating";
        }

        if (!title.trim()) {
            newErrors["title"] = "This field cannot be blank";
        }

        if (!comment.trim()) {
            newErrors["comment"] = "This field cannot be blank";
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            setReviewEditLoading(false);
            return;
        }

        const data = {};

        if (title !== review.title) {
            data["title"] = title;
        }

        if (rating !== review.rating) {
            data["rating"] = rating;
        }

        if (comment !== review.comment) {
            data["comment"] = comment;
        }

       const hasTextChanges = Object.keys(data).length > 0;

        const hasImageChanges =
            newImages.length > 0 || deletedImagesId.length > 0;

        if (!hasTextChanges && !hasImageChanges) {
            setReviewEditLoading(false);
            onResponse("No changes to save");
            return;
        }

        try {
            setReviewEditLoading(true);

            if (Object.keys(data).length > 0) {
                await dispatch(
                    updateReviewThunk({
                        reviewId: review.id,
                        data: data,
                    })
                ).unwrap();
            }

            if (newImages.length > 0) {
                const formData = new FormData();

                newImages.forEach((image) => {
                    formData.append("images", image);
                });

                await dispatch(
                    createReviewImageThunk({
                        reviewId: review.id,
                        data: formData,
                    })
                ).unwrap();
            }

            if (deletedImagesId.length > 0) {
                await Promise.all(
                    deletedImagesId.map((imageId) =>
                        dispatch(
                            deleteReviewImageThunk(imageId)
                        ).unwrap()
                    )
                );
            }

            onReviewEditSuccess();
            onResponse("Review edited successfully");
            onClose();
        } catch (error) {
            onResponse("Failed to edit review");
            onClose();
        } finally {
            setReviewEditLoading(false);
        }
    };

    return (
        <div
            onClick={onClose}
            className="
                fixed inset-0 z-[100]
                flex items-center justify-center
                bg-black/60 p-3 backdrop-blur-sm
                sm:p-5
            "
        >
    
            <div
                onClick={(event) => event.stopPropagation()}
                className="
                    relative grid
                    h-[90dvh] max-h-[720px]
                    w-full max-w-5xl
                    grid-cols-1
                    grid-rows-[minmax(0,0.85fr)_minmax(0,1.15fr)]
                    overflow-hidden
                    rounded-2xl border border-zinc-200
                    bg-white shadow-2xl
                    dark:border-zinc-700
                    dark:bg-zinc-900
                    md:grid-cols-2 md:grid-rows-1
                "
            >
                {/* Close button */}
                <button
                    type="button"
                    onClick={onClose}
                    aria-label="Close review"
                    className="
                        absolute right-3 top-3 z-50
                        flex h-9 w-9 items-center justify-center
                        rounded-full border
                        border-zinc-200 bg-white
                        text-zinc-700 shadow-sm
                        transition
                        hover:bg-zinc-100
                        active:scale-95
                        dark:border-zinc-700
                        dark:bg-zinc-800
                        dark:text-zinc-200
                        dark:hover:bg-zinc-700
                    "
                >
                    <X size={18} />
                </button>

             
                <div
                    className="
                        flex min-h-0 min-w-0 flex-col
                        overflow-hidden
                        border-b border-zinc-200
                        bg-zinc-50
                        dark:border-zinc-700
                        dark:bg-zinc-950
                        md:border-b-0 md:border-r
                    "
                >
                    {/* Main image */}
                    <div className="relative min-h-0 flex-1">
                        {images.length > 0 ? (
                            <Swiper
                                modules={[
                                    Navigation,
                                    Autoplay,
                                    Mousewheel,
                                    Thumbs,
                                ]}

                                autoplay={{
                                    delay: 3000,
                                    disableOnInteraction: false,
                                }}
                                navigation
                                thumbs={{
                                    swiper:
                                        thumbsSwiper &&
                                        !thumbsSwiper.destroyed
                                            ? thumbsSwiper
                                            : null,
                                }}
                                direction="horizontal"
                                mousewheel={{
                                    forceToAxis: true,
                                }}
                                loop={images.length > 1}
                                className="h-full w-full"
                            >
                                {images.map((image) => (
                                    <SwiperSlide
                                        key={image.id}
                                        className="flex h-full items-center justify-center overflow-hidden"
                                    >
                                        <div className="flex h-full w-full items-center justify-center p-5 sm:p-8">
                                            <img
                                                src={image.image}
                                                alt={image.alt_text || ""}
                                                className="
                                                    max-h-full max-w-full
                                                    object-contain
                                                "
                                            />
                                        </div>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        ) : (
                            <div
                                className="
                                    flex h-full flex-col
                                    items-center justify-center
                                    gap-3 p-6 text-center
                                "
                            >
                                <div
                                    className="
                                        flex h-14 w-14
                                        items-center justify-center
                                        rounded-2xl
                                        bg-zinc-200 text-zinc-500
                                        dark:bg-zinc-800
                                        dark:text-zinc-400
                                    "
                                >
                                    <X size={25} />
                                </div>

                                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                                    No photos attached to this review
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Image controls and thumbnails */}
                    <div
                        className="
                            shrink-0 space-y-3
                            border-t border-zinc-200
                            bg-white p-3
                            dark:border-zinc-800
                            dark:bg-zinc-900
                        "
                    >
                        {/* Existing images — view mode */}
                        {!isEditing && images.length > 0 && (
                            <Swiper
                                modules={[Thumbs, Scrollbar]}
                                slidesPerView="auto"
                                watchSlidesProgress
                                onSwiper={setThumbsSwiper}
                                scrollbar={{ draggable: true }}
                                spaceBetween={8}
                                className="w-full"
                            >
                                {images.map((image) => (
                                    <SwiperSlide
                                        key={image.id}
                                        className="w-16!"
                                    >
                                        <div
                                            className="
                                                aspect-square w-full
                                                overflow-hidden
                                                rounded-lg
                                                border border-zinc-200
                                                bg-zinc-100
                                                dark:border-zinc-700
                                                dark:bg-zinc-800
                                            "
                                        >
                                            <img
                                                src={image.image}
                                                alt={image.alt_text || ""}
                                                className="h-full w-full object-cover"
                                            />
                                        </div>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        )}

                        {/* Existing images — edit mode */}
                        {isEditing && (
                            <>
                                <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                                    Review photos
                                </p>

                                {images.length > 0 && (
                                    <Swiper
                                        modules={[
                                            Thumbs,
                                            Scrollbar,
                                            Mousewheel,
                                        ]}
                                        onSwiper={setThumbsSwiper}
                                        scrollbar={{ draggable: true }}
                                        watchSlidesProgress
                                        slidesPerView="auto"
                                        direction="horizontal"
                                        mousewheel={{
                                            forceToAxis: true,
                                        }}
                                        spaceBetween={8}
                                        className="w-full"
                                    >
                                        {images.map((image) => (
                                            <SwiperSlide
                                                key={image.id}
                                                className="w-20! overflow-hidden"
                                            >
                                                <div
                                                    className="
                                                        relative aspect-square
                                                        overflow-hidden
                                                        rounded-lg
                                                        border border-zinc-200
                                                        bg-zinc-100
                                                        dark:border-zinc-700
                                                        dark:bg-zinc-800
                                                    "
                                                >
                                                    <img
                                                        src={image.image}
                                                        alt={image.alt_text || ""}
                                                        className="h-full w-full object-cover"
                                                    />

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleImageDelete(
                                                                image.id
                                                            )
                                                        }
                                                        aria-label="Remove photo"
                                                        className="
                                                            absolute right-1 top-1
                                                            flex h-6 w-6
                                                            items-center justify-center
                                                            rounded-full
                                                            bg-black/70 text-white
                                                            transition
                                                            hover:bg-red-600
                                                            active:scale-95
                                                        "
                                                    >
                                                        <X size={14} />
                                                    </button>
                                                </div>
                                            </SwiperSlide>
                                        ))}
                                    </Swiper>
                                )}

                                {/* File input and Add Photo button */}
                                <div>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={(event) =>
                                            setNewImages((previous) => {
                                                const selectedFiles =
                                                    Array.from(
                                                        event.target.files
                                                    );

                                                return [
                                                    ...previous,
                                                    ...selectedFiles,
                                                ];
                                            })
                                        }
                                        className="hidden"
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            fileInputRef?.current.click()
                                        }
                                        className="
                                            flex w-full items-center
                                            justify-center gap-2
                                            rounded-lg border
                                            border-dashed
                                            border-zinc-300
                                            bg-zinc-50 px-3 py-2.5
                                            text-sm font-semibold
                                            text-zinc-700
                                            transition
                                            hover:border-zinc-500
                                            hover:bg-zinc-100
                                            active:scale-[0.99]
                                            dark:border-zinc-700
                                            dark:bg-zinc-800
                                            dark:text-zinc-200
                                            dark:hover:bg-zinc-700
                                        "
                                    >
                                        <span className="text-lg leading-none">
                                            +
                                        </span>
                                        Add Photo
                                    </button>
                                </div>

                                {/* Newly selected images */}
                                {newImages.length > 0 && (
                                    <>
                                        <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                                            New photos
                                        </p>

                                        <Swiper
                                            modules={[
                                                Thumbs,
                                                Scrollbar,
                                                Mousewheel,
                                            ]}
                                            onSwiper={setThumbsSwiper}
                                            scrollbar={{ draggable: true }}
                                            watchSlidesProgress
                                            slidesPerView="auto"
                                            direction="horizontal"
                                            mousewheel={{
                                                forceToAxis: true,
                                            }}
                                            spaceBetween={8}
                                            className="w-full"
                                        >
                                            {newImages.map((image, index) => (
                                                <SwiperSlide
                                                    key={index}
                                                    className="w-20! overflow-hidden"
                                                >
                                                    <div
                                                        className="
                                                            relative aspect-square
                                                            overflow-hidden
                                                            rounded-lg
                                                            border border-zinc-200
                                                            bg-zinc-100
                                                            dark:border-zinc-700
                                                            dark:bg-zinc-800
                                                        "
                                                    >
                                                        <img
                                                            src={URL.createObjectURL(
                                                                image
                                                            )}
                                                            alt=""
                                                            className="h-full w-full object-cover"
                                                        />

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleNewImageDelete(
                                                                    index
                                                                )
                                                            }
                                                            aria-label="Remove new photo"
                                                            className="
                                                                absolute right-1 top-1
                                                                flex h-6 w-6
                                                                items-center
                                                                justify-center
                                                                rounded-full
                                                                bg-black/70
                                                                text-white
                                                                transition
                                                                hover:bg-red-600
                                                                active:scale-95
                                                            "
                                                        >
                                                            <X size={14} />
                                                        </button>
                                                    </div>
                                                </SwiperSlide>
                                            ))}
                                        </Swiper>
                                    </>
                                )}
                            </>
                        )}
                    </div>
                </div>

                {/* right side edit form*/}
                <div
                    className="
                        flex min-h-0 min-w-0 flex-col
                        overflow-hidden bg-white
                        text-zinc-800
                        dark:bg-zinc-900
                        dark:text-zinc-100
                    "
                >
                    {/* Header */}
                    <div
                        className="
                            shrink-0 border-b
                            border-zinc-200 px-5 py-4 pr-14
                            dark:border-zinc-800
                            sm:px-6 sm:py-5
                        "
                    >
                        <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
                            {isEditing
                                ? "Edit your review"
                                : "Customer review"}
                        </h2>

                        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                            {isEditing
                                ? "Update your rating and review."
                                : "Review details"}
                        </p>
                    </div>

                    {/* Scrollable review content */}
                    <div
                        className="
                            min-h-0 flex-1 overflow-y-auto
                            overscroll-contain p-5
                            sm:p-6
                        "
                    >
                        {!isEditing ? (
                            <div className="flex flex-col gap-5">
                                <div>
                                    <p className="font-semibold text-zinc-900 dark:text-white">
                                        {review.first_name}{" "}
                                        {review.last_name}
                                    </p>

                                    <Rating
                                        value={review.rating}
                                        readOnly
                                        sx={{
                                            "& .MuiRating-iconFilled": {
                                                color: "#f59e0b",
                                            },
                                            "& .MuiRating-iconEmpty": {
                                                color: "#a1a1aa",
                                            },
                                        }}
                                    />

                                    <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                                        {new Date(
                                            review.created_at
                                        ).toLocaleDateString("en-US", {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                        })}
                                    </p>
                                </div>

                                <div className="border-t border-zinc-200 pt-5 dark:border-zinc-800">
                                    <p className="font-semibold text-zinc-900 dark:text-white">
                                        {review.title}
                                    </p>

                                    <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-zinc-600 dark:text-zinc-300">
                                        {review.comment}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-5">
                                {/* Rating */}
                                <div>
                                    <p className="mb-2 text-sm font-semibold text-zinc-700 dark:text-zinc-200">
                                        Your rating
                                    </p>

                                    <Rating
                                        value={rating}
                                        onChange={(event, newValue) =>
                                            setRating(newValue)
                                        }
                                        precision={1}
                                        sx={{
                                            fontSize: "2rem",
                                            "& .MuiRating-iconFilled": {
                                                color: "#f59e0b",
                                            },
                                            "& .MuiRating-iconEmpty": {
                                                color: "#a1a1aa",
                                            },
                                        }}
                                    />

                                    {errors.rating && (
                                        <p className="mt-1 text-sm text-red-500">
                                            {errors.rating}
                                        </p>
                                    )}
                                </div>

                                {/* Title */}
                                <TextField
                                    label="Review title"
                                    value={title}
                                    onChange={(event) =>
                                        setTitle(event.target.value)
                                    }
                                    error={Boolean(errors.title)}
                                    helperText={errors.title || ""}
                                    fullWidth
                                    sx={{
                                        "& .MuiInputLabel-root": {
                                            color: "#71717a",
                                        },
                                        "& .MuiOutlinedInput-root": {
                                            color: "#18181b",
                                            "& fieldset": {
                                                borderColor: "#d4d4d8",
                                            },
                                            "&:hover fieldset": {
                                                borderColor: "#71717a",
                                            },
                                        },
                                        "& .MuiInputBase-input": {
                                            color: "#18181b",
                                        },
                                        ".dark & .MuiInputLabel-root": {
                                            color: "#a1a1aa",
                                        },
                                        ".dark & .MuiOutlinedInput-root": {
                                            color: "#f4f4f5",
                                            "& fieldset": {
                                                borderColor: "#52525b",
                                            },
                                            "&:hover fieldset": {
                                                borderColor: "#a1a1aa",
                                            },
                                        },
                                        ".dark & .MuiInputBase-input": {
                                            color: "#f4f4f5",
                                        },
                                    }}
                                />

                                {/* Comment */}
                                <TextField
                                    label="Your review"
                                    value={comment}
                                    onChange={(event) =>
                                        setComment(event.target.value)
                                    }
                                    fullWidth
                                    multiline
                                    rows={5}
                                    error={Boolean(errors.comment)}
                                    helperText={errors.comment || ""}
                                    sx={{
                                        "& .MuiInputLabel-root": {
                                            color: "#71717a",
                                        },
                                        "& .MuiOutlinedInput-root": {
                                            color: "#18181b",
                                            "& fieldset": {
                                                borderColor: "#d4d4d8",
                                            },
                                            "&:hover fieldset": {
                                                borderColor: "#71717a",
                                            },
                                        },
                                        "& .MuiInputBase-input": {
                                            color: "#18181b",
                                        },
                                        ".dark & .MuiInputLabel-root": {
                                            color: "#a1a1aa",
                                        },
                                        ".dark & .MuiOutlinedInput-root": {
                                            color: "#f4f4f5",
                                            "& fieldset": {
                                                borderColor: "#52525b",
                                            },
                                            "&:hover fieldset": {
                                                borderColor: "#a1a1aa",
                                            },
                                        },
                                        ".dark & .MuiInputBase-input": {
                                            color: "#f4f4f5",
                                        },
                                    }}
                                />
                            </div>
                        )}
                    </div>

                    {/* Fixed action footer */}
                    <div
                        className="
                            flex shrink-0 flex-wrap
                            items-center justify-end gap-2
                            border-t border-zinc-200
                            bg-white p-4
                            dark:border-zinc-800
                            dark:bg-zinc-900
                            sm:gap-3
                        "
                    >
                        {!isEditing ? (
                            <>
                                <button
                                    type="button"
                                    onClick={() => setIsEditing(true)}
                                    className="
                                        inline-flex items-center gap-2
                                        rounded-lg border
                                        border-zinc-300 px-4 py-2.5
                                        text-sm font-semibold
                                        text-zinc-700 transition
                                        hover:bg-zinc-100
                                        active:scale-95
                                        dark:border-zinc-700
                                        dark:text-zinc-200
                                        dark:hover:bg-zinc-800
                                    "
                                >
                                    <Pencil size={16} />
                                    Edit
                                </button>

                                <button
                                    type="button"
                                    disabled={deleteReviewLoading}
                                    onClick={() => handleReviewDelete()}
                                    className="
                                        inline-flex items-center gap-2
                                        rounded-lg bg-red-600
                                        px-4 py-2.5 text-sm
                                        font-semibold text-white
                                        transition hover:bg-red-700
                                        active:scale-95
                                        disabled:cursor-not-allowed
                                        disabled:opacity-60
                                    "
                                >
                                    {deleteReviewLoading ? (
                                        <LoaderCircle
                                            size={16}
                                            className="animate-spin"
                                        />
                                    ) : (
                                        <Trash2 size={16} />
                                    )}
                                    Delete
                                </button>

                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="
                                        rounded-lg bg-zinc-900
                                        px-4 py-2.5 text-sm
                                        font-semibold text-white
                                        transition hover:bg-zinc-700
                                        active:scale-95
                                        dark:bg-white
                                        dark:text-zinc-900
                                        dark:hover:bg-zinc-200
                                    "
                                >
                                    Close
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    type="button"
                                    onClick={() => onClose()}
                                    className="
                                        rounded-lg border
                                        border-zinc-300 px-4 py-2.5
                                        text-sm font-semibold
                                        text-zinc-700 transition
                                        hover:bg-zinc-100
                                        active:scale-95
                                        dark:border-zinc-700
                                        dark:text-zinc-200
                                        dark:hover:bg-zinc-800
                                    "
                                >
                                    Cancel
                                </button>

                                <button
                                    type="button"
                                    disabled={reviewEditLoading}
                                    onClick={handleReviewEdit}
                                    className="
                                        inline-flex items-center
                                        justify-center gap-2
                                        rounded-lg bg-zinc-900
                                        px-5 py-2.5 text-sm
                                        font-semibold text-white
                                        transition hover:bg-zinc-700
                                        active:scale-95
                                        disabled:cursor-not-allowed
                                        disabled:opacity-60
                                        dark:bg-white
                                        dark:text-zinc-900
                                        dark:hover:bg-zinc-200
                                    "
                                >
                                    {reviewEditLoading ? (
                                        <>
                                            <LoaderCircle
                                                size={16}
                                                className="animate-spin"
                                            />
                                            Saving...
                                        </>
                                    ) : (
                                        "Save changes"
                                    )}
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

