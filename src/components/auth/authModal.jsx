"use client"
import { usePathname,useSearchParams} from "next/navigation";
import Link from "next/link"
import { X } from "lucide-react";
import GoogleLoginButton from "./googleLoginButton";

export default function AuthModal({ onClose }) {
    const pathName = usePathname();
    const searchParams = useSearchParams();

    const queryString = searchParams.toString();
    const currentURL = queryString
        ? `${pathName}?${queryString}`
        : pathName;

    const params = new URLSearchParams();
    params.set("next", currentURL);

    const loginURL = `/login?${params.toString()}`;
    const signupURL = `/signup?${params.toString()}`;

    const handleGoogleLoginSuccess = () => {
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">

            <div
                className="relative w-full max-w-md rounded-2xl bg-white px-8 py-8 shadow-2xl dark:bg-zinc-900 dark:text-white"
                onClick={(e) => e.stopPropagation()}
            >

             
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 rounded-full p-1 transition-transform active:scale-95"
                    type="button"
                >
                    <X size={20} />
                </button>

             
                <div className="text-center">
                    <h1 className="text-2xl font-bold">
                        Join SHOP.CO
                    </h1>

                    <p className="mt-3 px-2 text-sm leading-5 text-gray-500 dark:text-gray-400">
                        Please log in or sign up to add items to your
                        cart and proceed to checkout.
                    </p>
                </div>

              
                <div className="mt-7 flex flex-col gap-3">

                    <Link
                        href={loginURL}
                        className="flex w-full items-center justify-center rounded-full bg-black py-3 font-semibold text-white transition-transform active:scale-[0.98] dark:bg-white dark:text-black"
                    >
                        Log In
                    </Link>

                    <Link
                        href={signupURL}
                        className="flex w-full items-center justify-center rounded-full border border-gray-200 py-3 font-semibold text-black transition-transform active:scale-[0.98] hover:bg-gray-50 dark:border-zinc-700 dark:text-white dark:hover:bg-zinc-800"
                    >
                        Sign Up
                    </Link>

                    <div className="my-1 flex items-center gap-3">
                        <div className="h-px flex-1 bg-gray-200 dark:bg-zinc-700" />

                        <span className="text-xs font-semibold text-gray-400">
                            OR
                        </span>

                        <div className="h-px flex-1 bg-gray-200 dark:bg-zinc-700" />
                    </div>

                    <GoogleLoginButton
                        className="w-full"
                        onLoginSuccess={handleGoogleLoginSuccess}
                    />

                </div>
            </div>
        </div>
    );
}