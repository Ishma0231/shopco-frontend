"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { ChevronDown, Check } from "lucide-react";

const sortOptions = [
    {
        label: "Latest",
        value: "-created_at",
    },
    {
        label: "Oldest",
        value: "created_at",
    },
    {
        label: "Highest Rated",
        value: "-rating",
    },
    {
        label: "Lowest Rated",
        value: "rating",
    },
];

export default function ReviewSort() {
    const [isOpen, setIsOpen] = useState(false);

    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const dropdownRef = useRef(null);

    const currentOrdering = searchParams.get("ordering") || "-created_at";

    const currentOption =
        sortOptions.find((option) => option.value === currentOrdering) ||
        sortOptions[0];

   
    useEffect(() => {
        if (!isOpen) return;

        const handleOutsideClick = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setIsOpen(false);
            }
        };

        const handleEscape = (event) => {
            if (event.key === "Escape") {
                setIsOpen(false);
            }
        };

        document.addEventListener("pointerdown", handleOutsideClick);
        document.addEventListener("keydown", handleEscape);

        return () => {
            document.removeEventListener("pointerdown", handleOutsideClick);
            document.removeEventListener("keydown", handleEscape);
        };
    }, [isOpen]);

    const handleSortChange = (value) => {
        const params = new URLSearchParams(searchParams.toString());

        params.set("ordering", value);
        params.delete("page");

        const query = params.toString();

        router.push(
            query ? `${pathname}?${query}` : pathname,
            { scroll: false }
        );

        setIsOpen(false);
    };

    return (
        <div
            ref={dropdownRef}
            className="relative z-30 text-left"
        >
            {/* Dropdown trigger */}
            <div className="inline relative">
            <button
                type="button"
                onClick={() => setIsOpen((previous) => !previous)}
                aria-expanded={isOpen}
                aria-haspopup="menu"
                className="group relative inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm transition-colors duration-200  hover:border-zinc-400 hover:bg-zinc-50  active:bg-zinc-100  dark:border-zinc-700 dark:bg-zinc-900  dark:hover:border-zinc-500 dark:hover:bg-zinc-800 dark:active:bg-zinc-700"
            >
                <span className="text-zinc-500 dark:text-zinc-400">
                    Sort by
                </span>

                <span className="font-semibold text-zinc-700 dark:text-white">
                    {currentOption.label}
                </span>

                <ChevronDown
                    size={16}
                    className={`
                        text-zinc-500 transition-transform duration-200
                        group-hover:text-zinc-900
                        dark:text-zinc-400 dark:group-hover:text-white
                        ${isOpen ? "rotate-180" : ""}
                    `}
                />
            </button>

            {/* Dropdown menu */}
            {isOpen && (
                <div
                    role="menu"
                    className="
                        absolute left-0 top-full z-50 mt-2 w-52
                        overflow-hidden rounded-xl
                        border border-zinc-500/30 bg-white p-1.5
                        shadow-xl shadow-black/10
                        dark:border-zinc-700 dark:bg-zinc-900
                        dark:shadow-black/40
                    "
                >
                    <p
                        className="
                            px-3 py-2 text-xs font-semibold uppercase
                            tracking-wider text-zinc-600
                            dark:text-zinc-500
                        "
                    >
                        Sort reviews
                    </p>

                    {sortOptions.map((option) => {
                        const isSelected =
                            option.value === currentOrdering;

                        return (
                            <button
                                key={option.value}
                                type="button"
                                role="menuitem"
                                onClick={() =>
                                    handleSortChange(option.value)
                                }
                                className={`
                                    flex w-full items-center
                                    justify-between gap-3 rounded-lg
                                    px-3 py-2.5 text-left text-sm
                                    transition-colors duration-150

                                    ${
                                        isSelected
                                            ? "bg-zinc-100 font-semibold text-zinc-900 dark:bg-zinc-800 dark:text-white"
                                            : "font-medium text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-white"
                                    }
                                `}
                            >
                                <span>{option.label}</span>

                                {isSelected && (
                                    <Check
                                        size={16}
                                        className="shrink-0 text-zinc-900 dark:text-white"
                                    />
                                )}
                            </button>
                        );
                    })}
                </div>
            )}
            </div>
        </div>
    );
}