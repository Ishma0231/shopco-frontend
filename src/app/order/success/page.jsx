"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Check } from "lucide-react"

export default function OrderSuccess() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const orderId = searchParams.get("orderId")

    const [showTick, setShowTick] = useState(false)
    const [showText, setShowText] = useState(false)

    useEffect(() => {
        const tickTimer = setTimeout(() => {
            setShowTick(true)
        }, 1300)

        const textTimer = setTimeout(() => {
            setShowText(true)
        }, 1800)

        const redirectTimer = setTimeout(() => {
            router.replace(`/order/${orderId}`)
        }, 3000)

        return () => {
            clearTimeout(tickTimer)
            clearTimeout(textTimer)
            clearTimeout(redirectTimer)
        }
    }, [orderId, router])

    return (
        <div className="fixed inset-0 overflow-hidden bg-white">
            <div className="order-success-circle absolute left-1/2 top-1/2 z-10 h-32 w-32 rounded-full bg-green-500" />

            <div className="absolute left-1/2 top-1/2 z-20 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center">
                <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-white">
                    {showTick && (
                        <Check
                            size={55}
                            strokeWidth={3}
                            className="order-success-check text-green-400"
                        />
                    )}
                </div>

                {showText && (
                    <h1 className="order-success-text mt-6 z-10 text-2xl font-semibold text-white">
                        Order Confirmed!
                    </h1>
                )}
            </div>
        </div>
    )
}