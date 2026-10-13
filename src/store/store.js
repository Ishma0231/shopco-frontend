import {configureStore} from "@reduxjs/toolkit";
import authReducer,{setAccessToken,clearAuth} from "@/features/auth/authSlice"
import productReducer from "@/features/products/productSlice"
import cartReducer from "@/features/cart/cartSlice"
import reviewReducer from "@/features/reviews/reviewSlice"
import wishlistReducer from "@/features/wishlist/wishlistSlice"
import snackbarReducer from "@/features/snackbar/snackbarSlice"
import orderReducer from "@/features/orders/orderSlice"
import addressReducer from "@/features/address/addressSlice"
import {injectStore} from "@/services/api"

export const store=configureStore({
    reducer:{
       auth:authReducer ,
       products:productReducer,
       cart:cartReducer,
       reviews:reviewReducer,
       wishlist:wishlistReducer,
       snackbar:snackbarReducer,
       order:orderReducer,
       address:addressReducer
    }
})

injectStore(store,{setAccessToken,clearAuth})