import {useDispatch} from "react-redux"
import {useState} from "react"
import Link from "next/link"
import {LoaderCircle,Trash2} from "lucide-react"
import {updateCartItemQuantity,removeCartItemThunk} from "@/features/cart/cartSlice"

export default function CartItemCard({item,handleResponse,refetchCart}){
    const dispatch=useDispatch()
    const [updateQuantityLoading,setUpdateQuantityLoading]=useState(false)
    const [removeLoading,setRemoveLoading]=useState(false)
    const imageURL = item.primary_image
    ? item.primary_image.startsWith("http")
        ? item.primary_image
        : `${process.env.NEXT_PUBLIC_MEDIA_URL}${item.primary_image.startsWith("/") ? "" : "/"}${product.primary_image}`
    : null;
    const handleUpdateQuantity=async(quantity)=>{
        try{
            setUpdateQuantityLoading(true)
            await dispatch(updateCartItemQuantity({
                itemId:item.id,
                quantity:quantity
            })).unwrap()
            await refetchCart()
        }
        catch(error){
            handleResponse(error.message)
        }
        finally{
            setUpdateQuantityLoading(false)
        }
    }
    const handleItemRemove=async()=>{
       try{
        setRemoveLoading(true)
        await dispatch(removeCartItemThunk(item.id)).unwrap()
        await refetchCart()
        handleResponse("Item removed from cart")
       }
       catch(error){
        handleResponse("Failed to remove item")
       }
       finally{
        setRemoveLoading(false)
       }
    }

    return (
        <div className="flex flex-col md:flex-row px-3 mx-3 rounded-md shadow-md hover:border hover:border-gray-700/30 hover:dark:border-gray-100/20 bg-white dark:bg-gray-800 dark:text-white transition-transform duration-300">
            <Link href={`/products/${item.product_slug}?variant=${item.variant_id}`} 
            className="w-full md:w-52 aspect-square shrink-0 overflow-hidden rounded-md active:scale-95">
                <img
                src={imageURL}
                alt={item.product_name}
                className="w-full h-full object-contain "
                />
            </Link>

                <div className="flex-1 flex flex-col pl-7 pb-4 pt-5 gap-2">

                    <Link
                        href={`/products/${item.product_slug}?variant=${item.variant_id}`}
                        className="font-semibold text-lg hover:underline active:underline active:text-blue-500"
                    >
                        {item.product_name}
                    </Link>

                    <p className="font-semibold">
                        ₹{item.price}

                    </p>

                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500 dark:text-gray-300">
                            Color:
                        </span>

                        <span
                            className="w-5 h-5 rounded-full border border-gray-300"
                            style={{ backgroundColor: item.color }}
                        />
                    </div>

                    <p className="text-sm text-gray-500 dark:text-gray-300">
                        Size: {item.size}
                    </p>

                    <p className="font-semibold">
                        Subtotal: ₹{item.subtotal}
                    </p>

                    <div className="flex gap-2 mt-auto">

                        <div className="flex items-center rounded-md bg-gray-100 dark:bg-gray-700">
                            <button
                                type="button"
                                disabled={item.quantity===item.min_order_quantity||updateQuantityLoading}
                                className="rounded-l-md px-3 py-2 font-semibold active:scale-95"
                                onClick={()=>handleUpdateQuantity(item.quantity-1)}
                            >
                                -
                            </button>

                            <span className="px-3 font-semibold">
                                {updateQuantityLoading?(<LoaderCircle size={18} className="animate-spin"/>):
                                (item.quantity)}
                            </span>

                            <button
                                type="button"
                                disabled={item.quantity===item.stock||updateQuantityLoading}
                                className="rounded-r-md px-3 py-2 font-semibold active:scale-95"
                                onClick={()=>handleUpdateQuantity(item.quantity+1)}
                            >
                                +
                            </button>

                        </div>

                      
                        <button
                            type="button"
                            className="px-3 rounded-md bg-gray-100 dark:bg-gray-700 text-red-700 active:scale-95"
                            onClick={handleItemRemove}
                            disabled={removeLoading}
                        >
                            {removeLoading?(<LoaderCircle size={18} className="animate-spin"/>)
                            :(<Trash2 size={18} />)}
                        </button>

                    </div>

                </div>
        </div>
    )

}