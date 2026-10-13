"use client";

import { useSelector, useDispatch } from "react-redux";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, Mousewheel } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

import Rating from "@mui/material/Rating";
import { addCartItem } from "@/features/cart/cartSlice";
import { LoaderCircle, Heart } from "lucide-react";

import {
    addWishlistItem,
    removeWishlistItemThunk,
} from "@/features/wishlist/wishlistSlice";

import { updateVariantWishlistData } from "@/features/products/productSlice";

export default function productDetailCard({
    handleResponse,
    openAuthModal,
}) {
    const { productDetail, productDetailLoading } = useSelector(
        (state) => state.products
    );

    const { isAuthenticated } = useSelector((state) => state.auth);

    const { addToWishlistLoading, removeWishlistItemLoading } =
        useSelector((state) => state.wishlist);

    const { addCartItemLoading } = useSelector((state) => state.cart);

    const searchParams = useSearchParams();
    const router = useRouter();
    const dispatch = useDispatch();

    const [mainSwiper, setMainSwiper] = useState(null);
    const [activeImageIndex, setActiveImageIndex] = useState(0);

    const variantId = Number(searchParams.get("variant"));

    const selectedVariant =
        productDetail?.variants?.find(
            (variant) => variant.id === variantId
        ) || productDetail?.variants?.[0];

    const [quantity, setQuantity] = useState(
        selectedVariant?.min_order_quantity || 1
    );

    const [selectedColorId, setSelectedColorId] = useState(
        selectedVariant?.color?.id || null
    );

    const hasDiscount =
        selectedVariant?.discount_price !== null &&
        selectedVariant?.discount_price !== undefined;

    const discountPercentage =
        hasDiscount && Number(selectedVariant?.price) > 0
            ? Math.round(
                  ((Number(selectedVariant.price) -
                      Number(selectedVariant.discount_price)) /
                      Number(selectedVariant.price)) *
                      100
              )
            : 0;

    const selectedProductColor =
        productDetail?.product_colors?.find(
            (productColor) =>
                productColor.color.id === selectedColorId
        ) || null;

    const selectedProductColorVariants =
        productDetail?.variants?.filter(
            (variant) => variant.color.id === selectedColorId
        ) || [];

    const images = selectedProductColor?.images || [];

    const primaryImageIndex = images.findIndex(
        (image) => image.is_primary
    );

    const handleColorChange = (productColor) => {
        const colorVariants = productDetail?.variants?.filter(
            (variant) =>
                variant.color.id === productColor.color.id
        );

        const variantToSelect =
            colorVariants?.find((variant) => variant.stock > 0) ||
            colorVariants?.[0];

        if (!variantToSelect) return;

        router.push(
            `/products/${productDetail?.slug}?variant=${variantToSelect.id}`
        );
    };

    const handleAddToCart = async (data) => {
        if (!isAuthenticated) {
            openAuthModal();
            return;
        }

        try {
            const response = await dispatch(
                addCartItem(data)
            ).unwrap();

            handleResponse(response.message);
        } catch (error) {
            handleResponse(
                error?.message || "Unable to add product to cart"
            );
        }
    };

    const handleWishlistToggle = async () => {
        if (!isAuthenticated) {
            openAuthModal();
            return;
        }

        const isWishlisted =
            selectedVariant?.wishlisted_data?.is_wishlisted;

        try {
            if (isWishlisted) {
                const response = await dispatch(
                    removeWishlistItemThunk(
                        selectedVariant?.wishlisted_data?.wishlist_id
                    )
                ).unwrap();

                dispatch(
                    updateVariantWishlistData({
                        variantId: selectedVariant?.id,
                        wishlistId: null,
                        isWishlisted: false,
                    })
                );

                handleResponse(response.message);
            } else {
                const response = await dispatch(
                    addWishlistItem({
                        variant: selectedVariant?.id,
                    })
                ).unwrap();

                dispatch(
                    updateVariantWishlistData({
                        variantId: selectedVariant?.id,
                        isWishlisted: true,
                        wishlistId: response.wishlist_id,
                    })
                );

                handleResponse(response.message);
            }
        } catch (error) {
            handleResponse(
                error?.message ||
                    error?.detail ||
                    "Wishlist action failed"
            );
        }
    };

    useEffect(() => {
        if (selectedVariant) {
            setSelectedColorId(selectedVariant.color.id);
            setQuantity(selectedVariant.min_order_quantity || 1);
        }
    }, [selectedVariant]);

    useEffect(() => {
        setActiveImageIndex(
            primaryImageIndex >= 0 ? primaryImageIndex : 0
        );

        if (mainSwiper && !mainSwiper.destroyed) {
            mainSwiper.slideToLoop(
                primaryImageIndex >= 0 ? primaryImageIndex : 0,
                0
            );
        }
    }, [selectedColorId, primaryImageIndex, mainSwiper]);

    if (productDetailLoading) {
        return (
            <div className="flex min-h-96 items-center justify-center">
                <LoaderCircle
                    size={32}
                    className="animate-spin text-zinc-500 dark:text-zinc-300"
                />
            </div>
        );
    }

    if (!productDetail) {
        return (
            <div className="flex items-center justify-center py-16 text-zinc-500 dark:text-zinc-400">
                No details for this product.
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-8 p-4 text-zinc-900 sm:p-6 md:grid-cols-2 md:gap-10 lg:p-8 dark:text-zinc-100">

            {/* Product Gallery */}

            <div className="flex items-start gap-3 self-start md:sticky md:top-6 md:gap-4">

                {/* Thumbnail Gallery */}

                <div className="hidden w-20 shrink-0 sm:block lg:w-24">
                    <Swiper
                        modules={[Mousewheel]}
                        mousewheel={{
                            forceToAxis: true,
                        }}
                        spaceBetween={12}
                        slidesPerView="auto"
                        direction="vertical"
                        className="h-[500px] w-full"
                    >
                        {images.map((image, index) => (
                            <SwiperSlide
                                key={image.id}
                                className="!h-20 !w-full"
                            >
                                <button
                                    type="button"
                                    onClick={() => {
                                        setActiveImageIndex(index);

                                        if (
                                            mainSwiper &&
                                            !mainSwiper.destroyed
                                        ) {
                                            mainSwiper.slideToLoop(index);
                                        }
                                    }}
                                    aria-label={`View product image ${index + 1}`}
                                    aria-pressed={
                                        activeImageIndex === index
                                    }
                                    className={`h-full w-full overflow-hidden rounded-xl border bg-gradient-to-br from-zinc-50 to-zinc-100 p-1 transition dark:from-zinc-800 dark:to-zinc-900 ${
                                        activeImageIndex === index
                                            ? "border-zinc-900 ring-1 ring-zinc-900 dark:border-zinc-100 dark:ring-zinc-100"
                                            : "border-zinc-200 hover:border-zinc-400 dark:border-zinc-700 dark:hover:border-zinc-500"
                                    }`}
                                >
                                    <img
                                        src={image.image}
                                        alt={
                                            image.alt_text ||
                                            productDetail.name
                                        }
                                        className="h-full w-full object-contain"
                                    />
                                </button>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>

                {/* Main Image Gallery */}

                <div className="relative aspect-square min-w-0 flex-1 overflow-hidden rounded-2xl border border-zinc-200 bg-gradient-to-br from-zinc-50 via-white to-zinc-100 dark:border-zinc-800 dark:from-zinc-900 dark:via-zinc-950 dark:to-zinc-800">
                    {images.length > 0 ? (
                        <Swiper
                            key={selectedColorId}
                            modules={[Navigation, Autoplay]}
                            onSwiper={(swiper) => {
                                setMainSwiper(swiper);

                                const initialIndex =
                                    primaryImageIndex >= 0
                                        ? primaryImageIndex
                                        : 0;

                                setActiveImageIndex(initialIndex);
                                swiper.slideToLoop(initialIndex, 0);
                            }}
                            onSlideChange={(swiper) => {
                                setActiveImageIndex(
                                    swiper.realIndex
                                );
                            }}
                            navigation
                            autoplay={{
                                delay: 3000,
                                disableOnInteraction: false,
                            }}
                            initialSlide={
                                primaryImageIndex >= 0
                                    ? primaryImageIndex
                                    : 0
                            }
                            loop={images.length > 1}
                            className="h-full w-full"
                        >
                            {images.map((image) => (
                                <SwiperSlide key={image.id}>
                                    <div className="flex h-full w-full items-center justify-center p-3 sm:p-5">
                                        <img
                                            src={image.image}
                                            alt={
                                                image.alt_text ||
                                                productDetail.name
                                            }
                                            className="h-full w-full object-contain transition-transform duration-500 hover:scale-[1.03]"
                                        />
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    ) : (
                        <div className="flex h-full items-center justify-center text-sm text-zinc-400">
                            No images available
                        </div>
                    )}
                </div>
            </div>

            {/* Product Information */}

            <div className="flex flex-col gap-5">

                <div className="space-y-3">
                    <h1 className="text-2xl font-bold tracking-tight text-zinc-950 sm:text-3xl lg:text-4xl dark:text-zinc-50">
                        {productDetail.name}
                    </h1>

                    <div className="flex items-center gap-2">
                        <Rating
                            value={productDetail?.rating || 0}
                            precision={0.5}
                            readOnly
                            size="small"
                            sx={{
                                "& .MuiRating-iconFilled": {
                                    color: "#a1a1aa",
                                },
                                "& .MuiRating-iconEmpty": {
                                    color: "#d4d4d8",
                                },
                            }}
                        />

                        <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                            {productDetail?.rating || 0}/5
                        </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <span className="text-2xl font-bold text-zinc-950 dark:text-zinc-50">
                            ₹
                            {Number(
                                hasDiscount
                                    ? selectedVariant?.discount_price
                                    : selectedVariant?.price
                            ).toLocaleString("en-IN")}
                        </span>

                        {hasDiscount && (
                            <>
                                <span className="text-base text-zinc-400 line-through">
                                    ₹
                                    {Number(
                                        selectedVariant?.price
                                    ).toLocaleString("en-IN")}
                                </span>

                                {discountPercentage > 0 && (
                                    <span className="rounded-full bg-green-400/40 px-3 py-1 text-xs font-semibold text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200">
                                        -{discountPercentage}%
                                    </span>
                                )}
                            </>
                        )}
                    </div>
                </div>

                <p className="text-sm leading-7 text-zinc-600 dark:text-zinc-400">
                    {productDetail?.description}
                </p>

                {/* Colors */}

                <div className="space-y-3 border-t border-zinc-200 pt-5 dark:border-zinc-800">
                    <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                        Select Color
                    </p>

                    <div className="flex flex-wrap items-center gap-4">
                        {productDetail?.product_colors?.map(
                            (productColor) => (
                                <button
                                    key={productColor.id}
                                    type="button"
                                    aria-label={
                                        productColor.color.name
                                    }
                                    aria-pressed={
                                        selectedColorId ===
                                        productColor.color.id
                                    }
                                    title={productColor.color.name}
                                    onClick={() =>
                                        handleColorChange(productColor)
                                    }
                                    className={`h-8 w-8 rounded-full border border-zinc-200 transition hover:scale-110 dark:border-zinc-700 ${
                                        selectedColorId ===
                                        productColor.color.id
                                            ? "ring-2 ring-zinc-900 ring-offset-2 ring-offset-white dark:ring-zinc-100 dark:ring-offset-zinc-950"
                                            : ""
                                    }`}
                                    style={{
                                        backgroundColor:
                                            productColor.color.hex_code,
                                    }}
                                />
                            )
                        )}
                    </div>
                </div>

                {/* Sizes */}

                <div className="space-y-3">
                    <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                        Select Size
                    </p>

                    <div className="flex flex-wrap items-center gap-3">
                        {selectedProductColorVariants.map(
                            (variant) => (
                                <button
                                    key={variant.id}
                                    type="button"
                                    disabled={variant.stock === 0}
                                    onClick={() =>
                                        router.push(
                                            `/products/${productDetail?.slug}?variant=${variant.id}`
                                        )
                                    }
                                    className={`min-w-12 rounded-lg border border-zinc-500/50 px-4 py-3 text-sm font-medium transition active:scale-95 disabled:cursor-not-allowed  ${
                                        variant.id === selectedVariant?.id
                                            ? "border-zinc-900 bg-black text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900"
                                            : "border-zinc-200 bg-zinc-100 text-zinc-900 hover:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:border-zinc-500"
                                    }`}
                                >
                                    {variant.size.name}
                                </button>
                            )
                        )}
                    </div>
                </div>

                {/* Quantity, Cart and Wishlist */}

                <div className="mt-1 flex items-center gap-3 border-t border-zinc-200 pt-5 dark:border-zinc-800">
                    {selectedVariant?.stock === 0 ? (
                        <button
                            type="button"
                            disabled
                            className="flex-1 cursor-not-allowed rounded-xl bg-zinc-200 px-4 py-3 font-medium text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400"
                        >
                            Out of Stock
                        </button>
                    ) : (
                        <>
                            <div className="flex shrink-0 items-center gap-4 rounded-full border border-zinc-200 bg-gradient-to-br from-zinc-100 to-zinc-200 px-4 py-3 text-zinc-800 dark:border-zinc-700 dark:from-zinc-800 dark:to-zinc-900 dark:text-zinc-100">
                                <button
                                    type="button"
                                    aria-label="Decrease quantity"
                                    disabled={
                                        quantity ===
                                        selectedVariant?.min_order_quantity
                                    }
                                    onClick={() =>
                                        setQuantity(
                                            (previous) => previous - 1
                                        )
                                    }
                                    className="transition hover:text-zinc-500 disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    −
                                </button>

                                <span className="min-w-4 text-center text-sm font-semibold">
                                    {quantity}
                                </span>

                                <button
                                    type="button"
                                    aria-label="Increase quantity"
                                    disabled={
                                        quantity >=
                                        selectedVariant?.stock
                                    }
                                    onClick={() =>
                                        setQuantity(
                                            (previous) => previous + 1
                                        )
                                    }
                                    className="transition hover:text-zinc-500 disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    +
                                </button>
                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    handleAddToCart({
                                        variant_id: selectedVariant.id,
                                        quantity,
                                    })
                                }
                                disabled={addCartItemLoading}
                                className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-black px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:from-zinc-800 hover:to-zinc-600 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 dark:from-zinc-100 dark:to-zinc-300 dark:text-zinc-950 dark:hover:from-zinc-200 dark:hover:to-zinc-400"
                            >
                                {addCartItemLoading ? (
                                    <LoaderCircle
                                        size={20}
                                        className="animate-spin"
                                    />
                                ) : (
                                    "Add to Cart"
                                )}
                            </button>
                        </>
                    )}

                    <button
                        type="button"
                        aria-label={
                            selectedVariant?.wishlisted_data
                                ?.is_wishlisted
                                ? "Remove from wishlist"
                                : "Add to wishlist"
                        }
                        disabled={
                            addToWishlistLoading ||
                            removeWishlistItemLoading
                        }
                        onClick={handleWishlistToggle}
                        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-zinc-200 bg-white text-zinc-700 transition hover:bg-zinc-100 active:scale-95 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
                    >
                        {addToWishlistLoading ||
                        removeWishlistItemLoading ? (
                            <LoaderCircle
                                size={20}
                                className="animate-spin"
                            />
                        ) : (
                            <Heart
                                size={21}
                                strokeWidth={1.8}
                                fill={
                                    selectedVariant?.wishlisted_data
                                        ?.is_wishlisted
                                        ? "currentColor"
                                        : "none"
                                }
                                className={
                                    selectedVariant?.wishlisted_data
                                        ?.is_wishlisted
                                        ? "text-rose-600"
                                        : ""
                                }
                            />
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

