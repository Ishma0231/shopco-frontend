import { Heart, LoaderCircle, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { useRouter ,useSearchParams} from "next/navigation";
import { useDispatch } from "react-redux";
import { removeWishlistItemThunk } from "@/features/wishlist/wishlistSlice";
import { addCartItem } from "@/features/cart/cartSlice";
import Link from "next/link"



export default function WishlistCard({
    item,
   handleResponse
}) {
    const [quantity, setQuantity] = useState(item.min_order_quantity || 1);
    const searchParams=useSearchParams()
    const router=useRouter()
    const dispatch=useDispatch()
    const [addToCartLoading,setAddToCartLoading]=useState(false)
    const [removeLoading,setRemoveLoading]=useState(false)
    const imageURL=item.primary_image||null

     const handleAddToCart=async(item)=>{
            try{
            setAddToCartLoading(true)
            const response=await dispatch(addCartItem(item)).unwrap()
            handleResponse(response.message)
            }
            catch(error){
                handleResponse(error.message)
            }
            finally{
                setAddToCartLoading(false)
            }
    
        }
    
        const handleRemoveWishlistItem=async(itemId)=>{
            try{
                setRemoveLoading(true)
                const response=await dispatch(removeWishlistItemThunk(itemId)).unwrap()
                handleResponse(response.message)
                const params=new URLSearchParams(searchParams.toString())
                params.set("page",1)
                router.push(`?${params.toString()}`)
                
            }
            catch(error){
                handleResponse(error.message)
            }
            finally{
                setRemoveLoading(false)
            }
        }

    return (
        <div className="flex flex-col w-full md:flex-row gap-3 px-2 rounded-md shadow-lg bg-white dark:bg-gray-900 dark:text-white transition-transform duration-300">

            <Link
                href={`/products/${item.product_slug}?variant=${item.variant_id}`}
                className="w-full h-48 aspect-square md:w-52 shrink-0 bg-gray-50 dark:bg-gray-900 rounded-md"
            >
                <img
                    src={imageURL}
                    alt={item.product_name || ""}
                    className="w-full h-full object-contain rounded-lg"
                />
            </Link>

            <div className="flex-1 flex flex-col gap-2 p-2">

                <Link
                    href={`/products/${item.product_slug}?variant=${item.variant_id}`}
                    className="font-semibold text-lg hover:underline hover:decoration-black dark:hover:decoration-white active:text-yellow-300"
                >
                    {item.product_name}
                </Link>

                <p className="font-semibold">
                    ₹{item.price}
                </p>

                <p className="text-sm text-gray-500 dark:text-gray-300">
                    Minimum quantity: {item.min_order_quantity}
                </p>

                {item.stock === 0 ? (
                    <button
                        type="button"
                        disabled
                        className="bg-gray-400 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-md shadow-md cursor-not-allowed"
                    >
                        Out of Stock!
                    </button>
                ) : (
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">

                    {/* Quantity and wishlist heart */}
                <div className="flex items-center justify-between gap-2 sm:w-auto sm:shrink-0 sm:justify-start">

                    {/* Quantity selector */}
                    <div className="flex items-center rounded-md bg-gray-100 dark:bg-gray-700">

                        <button
                            type="button"
                            onClick={() =>
                                setQuantity((previous) => previous - 1)
                            }
                            disabled={quantity === item.min_order_quantity}
                            className="rounded-l-md px-2 py-2 font-semibold hover:bg-gray-200 disabled:opacity-40 dark:hover:bg-gray-600 sm:px-3"
                        >
                            -
                        </button>

                        <span className="px-3 font-semibold">
                            {quantity}
                        </span>

                        <button
                            type="button"
                            className="rounded-r-md px-2 py-2 font-semibold hover:bg-gray-200 disabled:opacity-40 dark:hover:bg-gray-600 sm:px-3"
                            onClick={() =>
                                setQuantity((previous) => previous + 1)
                            }
                            disabled={quantity >= item.stock}
                        >
                            +
                        </button>

                    </div>

                    {/* Remove from wishlist */}
                    <button
                        type="button"
                        disabled={removeLoading}
                        onClick={() => handleRemoveWishlistItem(item.id)}
                        aria-label="Remove from wishlist"
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-gray-100 shadow-md transition-colors hover:bg-gray-200 active:scale-95 disabled:opacity-50 dark:bg-gray-700 dark:hover:bg-gray-600"
                    >
                        {removeLoading ? (
                            <LoaderCircle
                                size={16}
                                className="animate-spin"
                            />
                        ) : (
                            <Heart
                                size={18}
                                strokeWidth={1.8}
                                fill="currentColor"
                                className="text-rose-800 dark:text-rose-400"
                            />
                        )}
                    </button>

                </div>

                {/* Add to Cart */}
                <button
                    type="button"
                    onClick={() =>
                        handleAddToCart({
                            variant_id: item.variant_id,
                            quantity: quantity
                        })
                    }
                    disabled={addToCartLoading}
                    className="flex min-h-10 w-full items-center justify-center gap-2 rounded-lg bg-black px-3 py-2 text-sm font-medium text-white shadow-md transition-colors hover:bg-gray-800 active:scale-95 disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-gray-200 sm:w-auto sm:min-w-0 sm:flex-1"
                >
                    {addToCartLoading ? (
                        <LoaderCircle
                            size={18}
                            className="animate-spin"
                        />
                    ) : (
                        <>
                            <ShoppingCart size={18} />
                            Add to Cart
                        </>
                    )}
                </button>

            </div>
                )}

            </div>
        </div>
    );
}