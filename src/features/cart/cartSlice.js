import { createAsyncThunk,createSlice } from "@reduxjs/toolkit";
import {getCart,addToCart,removeCartItem,clearCart,updateCartItem} from "@/services/cartService"

const initialState={
    cart:null,
    cartLoading:false,
    updateCartItemLoading:false,
    removeCartItemLoading:false,
    clearCartLoading:false,
    addCartItemResponse:null,
    addCartItemLoading:false,
    
};

export const fetchCart=createAsyncThunk(
    "cart/fetchCart",
    async(_,{rejectWithValue})=>{
        try{
        const response=await getCart()
        return response.data
        }
        catch(error){
            return rejectWithValue(error.response?.data)
        }
    }
)

export const addCartItem=createAsyncThunk(
    "cart/addCartItem",
    async(data,{rejectWithValue})=>{
        try{
            const response=await addToCart(data);
            return response.data
        }
        catch(error){
            return rejectWithValue(error.response?.data)
        }
    }
)

export const updateCartItemQuantity=createAsyncThunk(
    "cart/updateCartItemQuantity",
    async({itemId,quantity},{rejectWithValue})=>{
        try{
        const response=await updateCartItem(itemId,{quantity});
        return response.data;
        }
        catch(error){
            return rejectWithValue(error.response?.data)
        }


    }
)

export const removeCartItemThunk=createAsyncThunk(
    "cart/removeCartItemThunk",
    async(ItemId,{rejectWithValue})=>{
        try{
            const response=await removeCartItem(ItemId)
            return response.data
        }
        catch(error){
            return rejectWithValue(error.response?.data)
        }
    }
)
export const clearCartThunk=createAsyncThunk(
    "cart/clearCartThunk",
    async(_,{rejectWithValue})=>{
        try{
            await clearCart();
            const response=await getCart();
            return response.data;
        }
        catch(error){
            return rejectWithValue(error.response?.data)
        }
    }
)

const cartSlice=createSlice({
    name:"cart",
    initialState,
    reducers:{
        resetCart:(state)=>{
            state.cart=null;
        },
        updateItemQuantity:(state,action)=>{
            const {itemId,quantity}=action.payload
            const cartItem=state.cart?.items.find((item)=>
                item.id===itemId
            )
            if(cartItem){
                cartItem.quantity=quantity
            }
        }
    },
    extraReducers:(builder)=>{
        builder
        //fetchcart
        .addCase(fetchCart.pending,(state)=>{
            state.cartLoading=true;
        })
        .addCase(fetchCart.fulfilled,(state,action)=>{
            state.cartLoading=false;
            state.cart=action.payload;
        })
        .addCase(fetchCart.rejected,(state)=>{
            state.cartLoading=false;
        })

        //addcartitem
        .addCase(addCartItem.pending,(state)=>{
            state.addCartItemLoading=true;
        })
        .addCase(addCartItem.fulfilled,(state,action)=>{
            state.addCartItemLoading=false;
        })
        .addCase(addCartItem.rejected,(state)=>{
            state.addCartItemLoading=false;
           
        })

        //removeCartItem
        .addCase(removeCartItemThunk.pending,(state)=>{
            state.removeCartItemLoading=true;
        })
        .addCase(removeCartItemThunk.fulfilled,(state,action)=>{
            state.removeCartItemLoading=false;
        })
        .addCase(removeCartItemThunk.rejected,(state)=>{
            state.removeCartItemLoading=false;
        })

        //updatecartitemquantity
        .addCase(updateCartItemQuantity.pending,(state)=>{
            state.updateCartItemLoading=true;
        })
        .addCase(updateCartItemQuantity.fulfilled,(state,action)=>{
            state.updateCartItemLoading=false;
         
        })
        .addCase(updateCartItemQuantity.rejected,(state)=>{
            state.updateCartItemLoading=false;
        })

        //clearcart
        .addCase(clearCartThunk.pending,(state)=>{
            state.clearCartLoading=true;
        })
        .addCase(clearCartThunk.fulfilled,(state,action)=>{
            state.clearCartLoading=false;
            state.cart=action.payload;
        })
        .addCase(clearCartThunk.rejected,(state)=>{
            state.clearCartLoading=false;
    })

    }
})


export const {resetCart,updateItemQuantity}=cartSlice.actions;
export default cartSlice.reducer;