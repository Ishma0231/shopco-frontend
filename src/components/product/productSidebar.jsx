"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { fetchFilterOptions, fetchStyles } from "@/features/products/productSlice";
import { useEffect, useState } from "react";
import Slider from "@mui/material/Slider";
import { ChevronRight, SlidersHorizontal, X } from "lucide-react";
import ProductFiltersSkeleton from "@/components/product/productFilterSkeleton";

export default function ProductSidebar({ onClose, isMobileOpen }) {
    const dispatch = useDispatch();
    const router = useRouter();
    const searchParams = useSearchParams();

    const {
        productFilterOptions,
        productFilterOptionsLoading,
        styles,
        stylesLoading,
    } = useSelector((state) => state.products);

    const [showAllBrands, setShowAllBrands] = useState(false);
    const [showAllProductTypes, setShowAllProductTypes] = useState(false);
    const [showAllColors, setShowAllColors] = useState(false);
    const [showAllSizes, setShowAllSizes] = useState(false);

    const [selectedFilters, setSelectedFilters] = useState(() => {
        const filters = {};
        const multiSelectFilters = [
            "brand",
            "product_type",
            "gender",
            "color",
            "size",
        ];

        multiSelectFilters.forEach((name) => {
            const values = searchParams.get(name);

            if (values) {
                filters[name] = values.split(",");
            }
        });

        const minPrice = searchParams.get("min_price");
        const maxPrice = searchParams.get("max_price");

        if (minPrice) {
            filters.min_price = minPrice;
        }

        if (maxPrice) {
            filters.max_price = maxPrice;
        }

        return filters;
    });

    const priceMin = Number(
        productFilterOptions?.price_range?.min_price ?? 0
    );

    const priceMax = Number(
        productFilterOptions?.price_range?.max_price ?? 0
    );

    const selectedMinFromFilters =
        selectedFilters.min_price !== undefined
            ? Number(selectedFilters.min_price)
            : priceMin;

    const selectedMaxFromPrice =
        selectedFilters.max_price !== undefined
            ? Number(selectedFilters.max_price)
            : priceMax;

    const selectedMin = Math.min(
        priceMax,
        Math.max(priceMin, selectedMinFromFilters)
    );

    const selectedMax = Math.min(
        priceMax,
        Math.max(selectedMin, selectedMaxFromPrice)
    );

    const handleFilterChange = (name, value, checked) => {
        setSelectedFilters((previous) => {
            const currentValues = previous[name] || [];

            if (checked) {
                return {
                    ...previous,
                    [name]: currentValues.includes(value)
                        ? currentValues
                        : [...currentValues, value],
                };
            }

            const updatedValues = currentValues.filter(
                (item) => item !== value
            );

            if (updatedValues.length === 0) {
                const updatedFilters = { ...previous };
                delete updatedFilters[name];
                return updatedFilters;
            }

            return {
                ...previous,
                [name]: updatedValues,
            };
        });
    };

    useEffect(() => {
        const contextParams = {};
        const category = searchParams.get("category");
        const urlStyle = searchParams.get("style");
        const urlGender = searchParams.get("gender");

        if (category) {
            contextParams.category = category;
        }

        if (urlStyle) {
            contextParams.style = urlStyle;
        }

        if (urlGender) {
            contextParams.gender = urlGender;
        }

        if (selectedFilters.gender) {
            contextParams.gender = selectedFilters.gender.join(",");
        }

        dispatch(fetchFilterOptions(contextParams));
    }, [searchParams, selectedFilters.gender, dispatch]);

    useEffect(() => {
        dispatch(fetchStyles());
    }, [dispatch]);

    const visibleBrands = showAllBrands
        ? productFilterOptions?.brands
        : productFilterOptions?.brands?.slice(0, 5);

    const visibleProductTypes = showAllProductTypes
        ? productFilterOptions?.product_types
        : productFilterOptions?.product_types?.slice(0, 5);

    const visibleColors = showAllColors
        ? productFilterOptions?.colors
        : productFilterOptions?.colors?.slice(0, 5);

    const visibleSizes = showAllSizes
        ? productFilterOptions?.sizes
        : productFilterOptions?.sizes?.slice(0, 5);

    const handleApplyFilters = () => {
        const params = new URLSearchParams();

        const category = searchParams.get("category");
        const style = searchParams.get("style");

        if (category) {
            params.set("category", category);
        }

        if (style) {
            params.set("style", style);
        }

        Object.entries(selectedFilters).forEach(([name, value]) => {
            if (Array.isArray(value)) {
                params.set(name, value.join(","));
            } else {
                params.set(name, value);
            }
        });

        router.push(`/products?${params.toString()}`);
    };

    const handleClearAll = () => {
        setSelectedFilters({});

        const params = new URLSearchParams();

        const category = searchParams.get("category");
        const style = searchParams.get("style");

        if (category) params.set("category", category);
        if (style) params.set("style", style);

        router.push(`/products?${params.toString()}`);
    };

    const sectionHeading =
        "mb-3 text-sm font-semibold uppercase tracking-wider text-zinc-800 dark:text-zinc-100";

    const checkboxClass =
        "h-4 w-4 shrink-0 cursor-pointer accent-zinc-900 dark:accent-zinc-100";

    const labelClass =
        "flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2 text-sm text-zinc-700 transition-colors hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800";

    const showMoreClass =
        "mt-2 text-sm font-medium text-zinc-700 transition-colors hover:text-black dark:text-zinc-300 dark:hover:text-white";

    const actionButtonClass =
        "flex-1 rounded-xl bg-zinc-900 px-2 py-2 text-xs font-medium text-white shadow-sm transition hover:bg-zinc-700 active:scale-[0.98] dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300";

    return (
        <aside className="flex min-h-full w-full shrink-0 flex-col md:overflow-hidden rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-4 md:w-64 lg:w-72 dark:border-zinc-700 dark:bg-zinc-900 ">
            <div className="mb-6 shrink-0 flex items-center justify-between border-b border-zinc-200 pb-4 dark:border-zinc-700">
                <h2 className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
                    Filters
                </h2>

                <div className="flex items-center gap-2">
                    <SlidersHorizontal
                        size={19}
                        className="text-zinc-600 dark:text-zinc-300"
                    />

                    {isMobileOpen && (
                        <button
                            type="button"
                            onClick={onClose}
                            aria-label="Close filters"
                            className="rounded-lg p-2 transition hover:bg-zinc-100 md:hidden dark:hover:bg-zinc-800"
                        >
                            <X
                                size={20}
                                className="text-zinc-700 dark:text-zinc-200"
                            />
                        </button>
                    )}
                </div>
            </div>

            {productFilterOptionsLoading ? (
                <ProductFiltersSkeleton />
            ) : (
                <div className="space-y-6">
                    {productFilterOptions?.gender_list?.length > 0 && (
                        <section>
                            <h3 className={sectionHeading}>Gender</h3>

                            <div className="space-y-1">
                                {productFilterOptions.gender_list.map((gender) => (
                                    <label
                                        key={gender.slug}
                                        className={labelClass}
                                    >
                                        <input
                                            type="checkbox"
                                            className={checkboxClass}
                                            checked={
                                                selectedFilters.gender?.includes(
                                                    gender.slug
                                                ) || false
                                            }
                                            onChange={(event) =>
                                                handleFilterChange(
                                                    "gender",
                                                    gender.slug,
                                                    event.target.checked
                                                )
                                            }
                                        />
                                        <span>{gender.name}</span>
                                    </label>
                                ))}
                            </div>
                        </section>
                    )}

                    {visibleBrands?.length > 0 && (
                        <section>
                            <h3 className={sectionHeading}>Brands</h3>

                            <div className="space-y-1">
                                {visibleBrands.map((brand) => (
                                    <label
                                        key={brand.slug}
                                        className={labelClass}
                                    >
                                        <input
                                            type="checkbox"
                                            className={checkboxClass}
                                            checked={
                                                selectedFilters.brand?.includes(
                                                    brand.slug
                                                ) || false
                                            }
                                            onChange={(event) =>
                                                handleFilterChange(
                                                    "brand",
                                                    brand.slug,
                                                    event.target.checked
                                                )
                                            }
                                        />
                                        <span className="min-w-0 break-words">
                                            {brand.name}
                                        </span>
                                    </label>
                                ))}
                            </div>

                            {productFilterOptions?.brands?.length > 5 && (
                                <button
                                    type="button"
                                    className={showMoreClass}
                                    onClick={() =>
                                        setShowAllBrands((previous) => !previous)
                                    }
                                >
                                    {showAllBrands ? "Show less −" : "Show more +"}
                                </button>
                            )}
                        </section>
                    )}

                    {visibleProductTypes?.length > 0 && (
                        <section>
                            <h3 className={sectionHeading}>Product Types</h3>

                            <div className="space-y-1">
                                {visibleProductTypes.map((type) => (
                                    <label
                                        key={type.slug}
                                        className={labelClass}
                                    >
                                        <input
                                            type="checkbox"
                                            className={checkboxClass}
                                            checked={
                                                selectedFilters.product_type?.includes(
                                                    type.slug
                                                ) || false
                                            }
                                            onChange={(event) =>
                                                handleFilterChange(
                                                    "product_type",
                                                    type.slug,
                                                    event.target.checked
                                                )
                                            }
                                        />
                                        <span>{type.name}</span>
                                    </label>
                                ))}
                            </div>

                            {productFilterOptions?.product_types?.length > 5 && (
                                <button
                                    type="button"
                                    className={showMoreClass}
                                    onClick={() =>
                                        setShowAllProductTypes(
                                            (previous) => !previous
                                        )
                                    }
                                >
                                    {showAllProductTypes
                                        ? "Show less −"
                                        : "Show more +"}
                                </button>
                            )}
                        </section>
                    )}

                    {productFilterOptions?.price_range?.min_price != null &&
                        productFilterOptions?.price_range?.max_price != null && (
                            <section>
                                <h3 className={sectionHeading}>Price Range</h3>

                                <div className="px-2">
                                    <Slider
                                        value={[selectedMin, selectedMax]}
                                        min={priceMin}
                                        max={priceMax}
                                        disabled={priceMin === priceMax}
                                        onChange={(event, newValue) => {
                                            setSelectedFilters((previous) => ({
                                                ...previous,
                                                min_price: newValue[0],
                                                max_price: newValue[1],
                                            }));
                                        }}
                                        sx={{
                                            color: "#27272a",
                                            padding: "12px 0",
                                            "& .MuiSlider-thumb": {
                                                width: 17,
                                                height: 17,
                                                boxShadow: "0 0 0 4px #ffffff",
                                            },
                                            "& .MuiSlider-track": {
                                                border: "none",
                                            },
                                            ".dark &": {
                                                color: "#e4e4e7",
                                            },
                                        }}
                                    />

                                    <div className="mt-1 flex items-center justify-between gap-3 text-xs text-zinc-500 dark:text-zinc-400">
                                        <span>₹{selectedMin.toLocaleString("en-IN")}</span>
                                        <span>₹{selectedMax.toLocaleString("en-IN")}</span>
                                    </div>
                                </div>
                            </section>
                        )}

                    {visibleColors?.length > 0 && (
                        <section>
                            <h3 className={sectionHeading}>Colors</h3>

                            <div className="flex flex-wrap items-center gap-3">
                                {visibleColors.map((color) => {
                                    const isSelected =
                                        selectedFilters.color?.includes(
                                            color.slug
                                        ) || false;

                                    return (
                                        <button
                                            key={color.slug}
                                            type="button"
                                            aria-label={color.name}
                                            aria-pressed={isSelected}
                                            title={color.name}
                                            onClick={() =>
                                                handleFilterChange(
                                                    "color",
                                                    color.slug,
                                                    !isSelected
                                                )
                                            }
                                            className={`h-8 w-8 rounded-full border border-zinc-200 transition-transform hover:scale-110 dark:border-zinc-700 ${
                                                isSelected
                                                    ? "ring-2 ring-zinc-900 ring-offset-2 ring-offset-white dark:ring-zinc-100 dark:ring-offset-zinc-900"
                                                    : ""
                                            }`}
                                            style={{
                                                backgroundColor: color.hex_code,
                                            }}
                                        />
                                    );
                                })}
                            </div>

                            {productFilterOptions?.colors?.length > 5 && (
                                <button
                                    type="button"
                                    className={showMoreClass}
                                    onClick={() =>
                                        setShowAllColors((previous) => !previous)
                                    }
                                >
                                    {showAllColors ? "Show less −" : "Show more +"}
                                </button>
                            )}
                        </section>
                    )}

                    {visibleSizes?.length > 0 && (
                        <section>
                            <h3 className={sectionHeading}>Sizes</h3>

                            <div className="flex flex-wrap gap-2">
                                {visibleSizes.map((size) => {
                                    const selectedSize =
                                        selectedFilters.size?.includes(size.slug) ||
                                        false;

                                    return (
                                        <button
                                            key={size.slug}
                                            type="button"
                                            aria-pressed={selectedSize}
                                            onClick={() =>
                                                handleFilterChange(
                                                    "size",
                                                    size.slug,
                                                    !selectedSize
                                                )
                                            }
                                            className={`min-w-10 rounded-lg border px-3 py-2 text-sm font-medium transition ${
                                                selectedSize
                                                    ? "border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900"
                                                    : "border-zinc-200 bg-zinc-100 text-zinc-700 hover:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:border-zinc-500"
                                            }`}
                                        >
                                            {size.name}
                                        </button>
                                    );
                                })}
                            </div>

                            {productFilterOptions?.sizes?.length > 5 && (
                                <button
                                    type="button"
                                    className={showMoreClass}
                                    onClick={() =>
                                        setShowAllSizes((previous) => !previous)
                                    }
                                >
                                    {showAllSizes ? "Show less −" : "Show more +"}
                                </button>
                            )}
                        </section>
                    )}

                    <div className="grid grid-cols-2 gap-1 border-t border-zinc-200 pt-5 dark:border-zinc-700">
                        <button
                            type="button"
                            onClick={handleApplyFilters}
                            className={actionButtonClass}
                        >
                            Apply Filters
                        </button>

                        <button
                            type="button"
                            onClick={handleClearAll}
                            className="flex-1 rounded-xl border border-zinc-300 bg-white px-2 py-2 text-xs font-medium text-zinc-700 transition hover:bg-zinc-100 active:scale-[0.98] dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
                        >
                            Clear All
                        </button>
                    </div>

                    <section className="border-t border-zinc-200 pt-5 dark:border-zinc-700">
                        {stylesLoading ? (
                            <div className="space-y-3">
                                <div className="h-5 w-20 animate-pulse rounded bg-zinc-200 dark:bg-zinc-700" />

                                <div className="space-y-2">
                                    <div className="h-10 w-full animate-pulse rounded-lg bg-zinc-200 dark:bg-zinc-700" />
                                    <div className="h-10 w-full animate-pulse rounded-lg bg-zinc-200 dark:bg-zinc-700" />
                                    <div className="h-10 w-full animate-pulse rounded-lg bg-zinc-200 dark:bg-zinc-700" />
                                </div>
                            </div>
                        ) : (
                            <>
                                <h3 className={sectionHeading}>Shop by Style</h3>

                                <div className="space-y-1">
                                    {styles?.map((style) => (
                                        <button
                                            key={style.slug}
                                            type="button"
                                            onClick={() =>
                                                router.push(
                                                    `/products?style=${style.slug}`
                                                )
                                            }
                                            className="flex w-full items-center justify-between rounded-lg px-3 py-3 text-left text-sm text-zinc-700 transition hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-white"
                                        >
                                            <span>{style.name}</span>
                                            <ChevronRight
                                                size={17}
                                                className="shrink-0 text-zinc-400"
                                            />
                                        </button>
                                    ))}
                                </div>
                            </>
                        )}
                    </section>
                </div>
            )}
        </aside>
    );
}

