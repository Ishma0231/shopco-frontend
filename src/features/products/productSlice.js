import {createSlice,createAsyncThunk} from "@reduxjs/toolkit"
import { getProducts, getStyles,getProductDetail,getFilterOptions,getBrands,getSizes} from "@/services/productService"

const initialState={
    products:[],
    count:0,
    next:null,
    previous:null,  
    brands:[],
    brandsLoading:false,
    productDetail:null,
    productFilterOptions:null,
    styles:[],
    stylesLoading:false,
    sizes:[],
    sizesLoading:false,
    productsLoading:false,
    productDetailLoading:false,
    productFilterOptionsLoading:false

}

export const fetchSizes=createAsyncThunk(
    "products/sizes",
    async(_,{rejectWithValue})=>{
        try{
            const response=await getSizes()
            return response.data
        }
        catch(error){
            return rejectWithValue(error.response?.data)
        }
    }
)
export const fetchStyles=createAsyncThunk(
    "products/style",
    async(_,{rejectWithValue})=>{
        try{
            const response=await getStyles()
            return response.data
        }
        catch(error){
            return rejectWithValue(error.response?.data)
        }
    }
)

export const fetchProducts=createAsyncThunk(
    "products/fetchProducts",
    async (params={},{rejectWithValue})=>{
        try{
            const response=await getProducts(params)
            return response.data
        }
        catch(error){
            return rejectWithValue(error.response?.data)
        }
    }
)

export const fetchProductDetail=createAsyncThunk(
    "products/fetchProductDetail",
    async(slug,{rejectWithValue})=>{
        try{
            const response=await getProductDetail(slug)
            return response.data
        }
        catch(error){
            return rejectWithValue(error.response?.data)
        }
    }
)

export const fetchFilterOptions=createAsyncThunk(
    "products/fetchFilterOptions",
    async(params={},{rejectWithValue})=>{
        try{
            const response=await getFilterOptions(params)
            return response.data
        }
        catch(error){
            return rejectWithValue(error.response?.data)
        }
    }
)
export const fetchBrands=createAsyncThunk(
    "products/fetchBrands",
    async(_,{rejectWithValue})=>{
        try{
            const response=await getBrands()
            return response.data
        }
        catch(error){
            return rejectWithValue(error.response?.data)
        }
    }
)

const productSlice=createSlice({
    name:"products",
    initialState,
    reducers:{
        clearProductDetail:(state)=>{
            state.productDetail=null;
        },

        updateProductWishlist:(state,action)=>{
            const {productId,isWishlisted,wishlistId}=action.payload
            const product=state.products.find(
                (product)=>product.id===productId
            );
            if(product){
                product.wishlist_data={
                    is_wishlisted:isWishlisted,
                    wishlist_id:wishlistId
                }
            }
        },
        updateVariantWishlistData:(state,action)=>{
            const {variantId,wishlistId,isWishlisted}=action.payload
            const variant=state.productDetail?.variants?.find(
                (variant)=>variant.id===variantId
                )
            if (variant){
                variant.wishlisted_data={
                    "is_wishlisted":isWishlisted,
                    "wishlist_id":wishlistId
                }
        }

    }},
    extraReducers:(builder)=>{
        builder
        
        .addCase(fetchProducts.pending,(state)=>{
            state.productsLoading=true
        })
        .addCase(fetchProducts.fulfilled,(state,action)=>{
            state.productsLoading=false;
            state.products=action.payload.results;
            state.next=action.payload.next;
            state.previous=action.payload.previous;
            state.count=action.payload.count;
        })
        .addCase(fetchProducts.rejected,(state)=>{
            state.productsLoading=false;
        })
        .addCase(fetchProductDetail.pending,(state)=>{
            state.productDetailLoading=true;
        })
        .addCase(fetchProductDetail.fulfilled,(state,action)=>{
            state.productDetailLoading=false;
            state.productDetail=action.payload;
            
        })
        .addCase(fetchProductDetail.rejected,(state)=>{
            state.productDetailLoading=false
        })
        .addCase(fetchFilterOptions.pending,(state)=>{
            state.productFilterOptionsLoading=true;
        })
        .addCase(fetchFilterOptions.fulfilled,(state,action)=>{
            state.productFilterOptionsLoading=false;
            state.productFilterOptions=action.payload;
        })
        .addCase(fetchFilterOptions.rejected,(state)=>{
            state.productFilterOptionsLoading=false;
        })
        .addCase(fetchBrands.pending,(state)=>{
            state.brandsLoading=true;
        })
        .addCase(fetchBrands.fulfilled,(state,action)=>{
            state.brandsLoading=false;
            state.brands=action.payload;
        })
        .addCase(fetchBrands.rejected,(state)=>{
            state.brandsLoading=false;
        })
        .addCase(fetchStyles.pending,(state)=>{
            state.stylesLoading=true;
        })
        .addCase(fetchStyles.fulfilled,(state,action)=>{
            state.stylesLoading=false;
            state.styles=action.payload;
        })
        .addCase(fetchStyles.rejected,(state)=>{
            state.stylesLoading=false;
        })
        .addCase(fetchSizes.pending,(state)=>{
            state.sizesLoading=true
        })
        .addCase(fetchSizes.fulfilled,(state,action)=>{
            state.sizesLoading=false;
            state.sizes=action.payload;
        })
        .addCase(fetchSizes.rejected,(state)=>{
            state.sizesLoading=false
        })
    }
})

export const {clearProductDetail,updateProductWishlist,updateVariantWishlistData}=productSlice.actions;
export default productSlice.reducer