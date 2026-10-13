import {createSlice,createAsyncThunk} from "@reduxjs/toolkit"
import { getWishlist,removeWishlistItem,addToWishlist } from "@/services/wishlistService"

const initialState={
    wishlist:[],
    count:0,
    next:null,
    previous:null,
    wishlistLoading:false,
    addToWishlistLoading:false,
    removeWishlistItemLoading:false
}
export const fetchWishlist=createAsyncThunk(
    "wishlist/fetchWishlist",
     async(params={},{rejectWithValue})=>{
        try{
            const response=await getWishlist(params)
            return response.data

        }
        catch(error){
            return rejectWithValue(error.response?.data)
        }
    }
)

export const addWishlistItem=createAsyncThunk(
    "wishlist/addWishlistItem",
    async(data,{rejectWithValue})=>{
        try{
        const response=await addToWishlist(data)
        return response.data
        }
        catch(error){
            return rejectWithValue(error.response?.data)
        }
    }
)

export const removeWishlistItemThunk=createAsyncThunk(
    "wishlist/removeWishlistItemThunk",
    async(itemId,{rejectWithValue})=>{
        try{
        const response=await removeWishlistItem(itemId)
        return response.data
        }
        catch(error){
            return rejectWithValue(error.response?.data)
        }
    }
)

const wishlistSlice=createSlice({
    name:"wishlist",
    initialState,
    reducers:{
        resetWishlist:(state)=>{
            state.wishlist=[];
            state.count=0;
            state.next=null;
            state.previous=null;
        }

    },
    extraReducers:(builder)=>{
        builder
        .addCase(fetchWishlist.pending,(state)=>{
         state.wishlistLoading=true;
        })
        .addCase(fetchWishlist.fulfilled,(state,action)=>{
            state.wishlistLoading=false;
            state.wishlist=action.payload.results;
            state.count=action.payload.count;
            state.next=action.payload.next;
            state.previous=action.payload.previous;
        })
        .addCase(fetchWishlist.rejected,(state)=>{
            state.wishlistLoading=false;
        })

        //addwishlist
        .addCase(addWishlistItem.pending,(state)=>{
            state.addToWishlistLoading=true;
        })
        .addCase(addWishlistItem.fulfilled,(state,action)=>{
            state.addToWishlistLoading=false;
        })
        .addCase(addWishlistItem.rejected,(state)=>{
            state.addToWishlistLoading=false;
        })

        //removefromwishlist
        .addCase(removeWishlistItemThunk.pending,(state)=>{
            state.removeWishlistItemLoading=true;
        })
        .addCase(removeWishlistItemThunk.fulfilled,(state,action)=>{
            state.removeWishlistItemLoading=false;
        })
        .addCase(removeWishlistItemThunk.rejected,(state)=>{
            state.removeWishlistItemLoading=false;
        })
    }
})


export const {resetWishlist}=wishlistSlice.actions
export default wishlistSlice.reducer