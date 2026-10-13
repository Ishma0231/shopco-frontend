"use client";

import Link from "next/link";
import {
    FaGithub,
    FaFacebook,
    FaInstagram,
    FaTwitter,
    FaCcVisa,
    FaCcMastercard,
    FaCcPaypal,
    FaApplePay,
    FaGooglePay,
} from "react-icons/fa";
import { usePathname } from "next/navigation";

export default function Footer() {
    const pathName=usePathname()
      if (pathName==="/orders/success"){
            return null
        }
        if (pathName==="/order/success"){
        return null
    }
    return (
        <footer className="mt-auto bg-white text-black dark:bg-zinc-900/20 z-10 dark:text-white">

            {/* Newsletter */}
            <div className="mx-auto max-w-7xl px-4 pt-10">
                <div className="rounded-[24px] bg-black px-8 py-10 text-white md:px-12">

                    <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">

                        <h2 className="max-w-lg text-2xl font-black leading-tight md:text-4xl">
                            STAY UP TO DATE ABOUT
                           
                            OUR LATEST OFFERS
                        </h2>

                        <div className="flex w-full max-w-sm flex-col gap-3">
                            <input
                                type="email"
                                placeholder="Enter your email address"
                                className="h-11 w-full rounded-full bg-white px-5 text-sm text-black outline-none placeholder:text-gray-500"
                            />

                            <button
                                type="button"
                                className="h-11 w-full rounded-full bg-white px-5 text-sm font-semibold text-black transition-transform active:scale-[0.98]"
                            >
                                Subscribe to Newsletter
                            </button>
                        </div>

                    </div>
                </div>
            </div>

            {/* Main footer */}
            <div className="mx-auto max-w-7xl px-4 py-12">

                <div className="grid grid-cols-2 gap-10 md:grid-cols-5">

                    {/* Brand */}
                    <div className="col-span-2 md:col-span-1">
                        <h2 className="text-2xl font-black">
                            SHOP.CO
                        </h2>

                        <p className="mt-5 max-w-xs text-sm leading-6 text-gray-600 dark:text-gray-400">
                            We have clothes that suit your style and
                            which you're proud to wear.
                        </p>

                        {/* Social icons */}
                        <div className="mt-6 flex items-center gap-3">

                            <Link
                                href="#"
                                aria-label="GitHub"
                                className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-black transition-transform active:scale-95 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                            >
                                <FaGithub size={16} />
                            </Link>

                            <Link
                                href="#"
                                aria-label="Facebook"
                                className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-black transition-transform active:scale-95 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                            >
                                <FaFacebook size={16} />
                            </Link>

                            <Link
                                href="#"
                                aria-label="Instagram"
                                className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-black transition-transform active:scale-95 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                            >
                                <FaInstagram size={16} />
                            </Link>

                            <Link
                                href="#"
                                aria-label="Twitter"
                                className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-black transition-transform active:scale-95 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                            >
                                <FaTwitter size={16} />
                            </Link>

                        </div>
                    </div>

                    {/* Company */}
                    <div>
                        <h3 className="text-sm font-bold uppercase tracking-wide">
                            Company
                        </h3>

                        <div className="mt-5 space-y-3 text-sm text-gray-600 dark:text-gray-400">
                            <Link className="block hover:text-black dark:hover:text-white" href="#">
                                About
                            </Link>
                            <Link className="block hover:text-black dark:hover:text-white" href="#">
                                Features
                            </Link>
                            <Link className="block hover:text-black dark:hover:text-white" href="#">
                                Works
                            </Link>
                            <Link className="block hover:text-black dark:hover:text-white" href="#">
                                Career
                            </Link>
                        </div>
                    </div>

                    {/* Help */}
                    <div>
                        <h3 className="text-sm font-bold uppercase tracking-wide">
                            Help
                        </h3>

                        <div className="mt-5 space-y-3 text-sm text-gray-600 dark:text-gray-400">
                            <Link className="block hover:text-black dark:hover:text-white" href="#">
                                Customer Support
                            </Link>
                            <Link className="block hover:text-black dark:hover:text-white" href="#">
                                Delivery Details
                            </Link>
                            <Link className="block hover:text-black dark:hover:text-white" href="#">
                                Terms & Conditions
                            </Link>
                            <Link className="block hover:text-black dark:hover:text-white" href="#">
                                Privacy Policy
                            </Link>
                        </div>
                    </div>

                    {/* FAQ */}
                    <div>
                        <h3 className="text-sm font-bold uppercase tracking-wide">
                            FAQ
                        </h3>

                        <div className="mt-5 space-y-3 text-sm text-gray-600 dark:text-gray-400">
                            <Link className="block hover:text-black dark:hover:text-white" href="#">
                                Account
                            </Link>
                            <Link className="block hover:text-black dark:hover:text-white" href="#">
                                Manage Deliveries
                            </Link>
                            <Link className="block hover:text-black dark:hover:text-white" href="#">
                                Orders
                            </Link>
                            <Link className="block hover:text-black dark:hover:text-white" href="#">
                                Payments
                            </Link>
                        </div>
                    </div>

                    {/* Resources */}
                    <div>
                        <h3 className="text-sm font-bold uppercase tracking-wide">
                            Resources
                        </h3>

                        <div className="mt-5 space-y-3 text-sm text-gray-600 dark:text-gray-400">
                            <Link className="block hover:text-black dark:hover:text-white" href="#">
                                Free eBooks
                            </Link>
                            <Link className="block hover:text-black dark:hover:text-white" href="#">
                                Development Tutorial
                            </Link>
                            <Link className="block hover:text-black dark:hover:text-white" href="#">
                                How to - Blog
                            </Link>
                            <Link className="block hover:text-black dark:hover:text-white" href="#">
                                YouTube Playlist
                            </Link>
                        </div>
                    </div>

                </div>

                {/* Bottom */}
                <div className="mt-10 flex flex-col gap-5 border-t border-gray-200 pt-6 dark:border-zinc-700 md:flex-row md:items-center md:justify-between">

                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        © 2026 SHOP.CO. All rights reserved.
                    </p>

                    {/* Payment icons */}
                    <div className="flex items-center gap-3">

                        <div className="flex h-7 w-11 items-center justify-center rounded-md border border-gray-200 bg-white dark:border-zinc-700">
                            <FaCcVisa className="text-blue-700" size={25} />
                        </div>

                        <div className="flex h-7 w-11 items-center justify-center rounded-md border border-gray-200 bg-white dark:border-zinc-700">
                            <FaCcMastercard size={25} />
                        </div>

                        <div className="flex h-7 w-11 items-center justify-center rounded-md border border-gray-200 bg-white dark:border-zinc-700">
                            <FaCcPaypal className="text-blue-600" size={25} />
                        </div>

                        <div className="flex h-7 w-11 items-center justify-center rounded-md border border-gray-200 bg-white dark:border-zinc-700">
                            <FaApplePay size={27} />
                        </div>

                        <div className="flex h-7 w-11 items-center justify-center rounded-md border border-gray-200 bg-white dark:border-zinc-700">
                            <FaGooglePay size={27} />
                        </div>

                    </div>

                </div>
            </div>
        </footer>
    );
}