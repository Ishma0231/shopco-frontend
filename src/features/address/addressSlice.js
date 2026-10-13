import { createAsyncThunk,createSlice } from "@reduxjs/toolkit";
import { getAddress,updateAddress,deleteAddress,
    createAddress } from "@/services/addressService";

const initialState={
    addresses:[],
    addressLoading:false,
    createAddressLoading:false,
    deleteAddressLoading:false,
    updateAddressLoading:false,
}

export const fetchAddresses=createAsyncThunk(
    "address/fetchAddresses",
    async(_,{rejectWithValue})=>{
        try{
            const response=await getAddress()
            return response.data
        }
        catch(error){
            return rejectWithValue(error.response?.data)
        }
    }
)

export const updateAddressThunk=createAsyncThunk(
    "address/updateAddressThunk",
    async({addressId,data},{rejectWithValue})=>{
        try{
            await updateAddress(addressId,data)
            const response=await getAddress()
            return response.data
        }
        catch(error){
            return rejectWithValue(error.response?.data)
        }
    }
)

export const deleteAddressThunk=createAsyncThunk(
    "address/deleteAddressThunk",
    async(addressId,{rejectWithValue})=>{
        try{
            await deleteAddress(addressId)
            const response=await getAddress()
            return response.data
        }
        catch(error){
            return rejectWithValue(error.response?.data)
        }
    }
)

export const createAddressThunk=createAsyncThunk(
    "address/createAddressThunk",
    async(data,{rejectWithValue})=>{
        try{
            await createAddress(data)
            const response=await getAddress()
            return response.data
        }
        catch(error){
            return rejectWithValue(error.response?.data)
        }
    }
)

const addressSlice=createSlice({
    name:"address",
    initialState,
    reducers:{
        resetAddress:(state)=>{
            state.addresses=[];
        }
    },
    extraReducers:(builder)=>{
        builder
        .addCase(fetchAddresses.pending,(state)=>{
            state.addressLoading=true;
        })
        .addCase(fetchAddresses.fulfilled,(state,action)=>{
            state.addressLoading=false;
            state.addresses=action.payload;
        })
        .addCase(fetchAddresses.rejected,(state)=>{
            state.addressLoading=false;
        })
        .addCase(updateAddressThunk.pending,(state)=>{
            state.updateAddressLoading=true;
        })
        .addCase(updateAddressThunk.fulfilled,(state,action)=>{
            state.updateAddressLoading=false;
            state.addresses=action.payload;
        })
        .addCase(updateAddressThunk.rejected,(state)=>{
            state.updateAddressLoading=false;
        })

        .addCase(deleteAddressThunk.pending,(state)=>{
            state.deleteAddressLoading=true;
        })
        .addCase(deleteAddressThunk.fulfilled,(state,action)=>{
            state.deleteAddressLoading=false;
            state.addresses=action.payload;
        })
        .addCase(deleteAddressThunk.rejected,(state)=>{
            state.deleteAddressLoading=false;
        })

        .addCase(createAddressThunk.pending,(state)=>{
            state.createAddressLoading=true;
        })
        .addCase(createAddressThunk.fulfilled,(state,action)=>{
            state.createAddressLoading=false;
            state.addresses=action.payload;
        })
        .addCase(createAddressThunk.rejected,(state)=>{
            state.createAddressLoading=false;
        })
    }
})

export const {resetAddress}=addressSlice.actions
export default addressSlice.reducer