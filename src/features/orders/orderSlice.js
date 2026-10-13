import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import {
    checkout,
    createOrder,
    getOrders,
    getOrderDetail,
    cancelOrder,
    cancelOrderItem,
} from "@/services/orderService";


const initialState = {
    orders: [],
    orderDetail: null,
    checkoutLoading: false,
    createOrderLoading: false,
    ordersLoading: false,
    orderDetailLoading: false,
    cancelOrderLoading: false,
    cancelOrderItemLoading: false,
};




export const checkoutThunk = createAsyncThunk(
    "orders/checkoutThunk",
    async (data, { rejectWithValue }) => {
        try {
            const response = await checkout(data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data);
        }
    }
);




export const createOrderThunk = createAsyncThunk(
    "orders/createOrderThunk",
    async (data, { rejectWithValue }) => {
        try {
            const response = await createOrder(data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data);
        }
    }
);




export const fetchOrders = createAsyncThunk(
    "orders/fetchOrders",
    async (_, { rejectWithValue }) => {
        try {
            const response = await getOrders();
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data);
        }
    }
);

export const fetchOrderDetail = createAsyncThunk(
    "orders/fetchOrderDetail",
    async (orderId, { rejectWithValue }) => {
        try {
            const response = await getOrderDetail(orderId);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data);
        }
    }
);




export const cancelOrderThunk = createAsyncThunk(
    "orders/cancelOrderThunk",
    async (orderId, { rejectWithValue }) => {
        try {
            const response = await cancelOrder(orderId);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data);
        }
    }
);



export const cancelOrderItemThunk = createAsyncThunk(
    "orders/cancelOrderItemThunk",
    async (itemId, { rejectWithValue }) => {
        try {
            const response = await cancelOrderItem(itemId);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data);
        }
    }
);



const orderSlice = createSlice({
    name: "orders",
    initialState,

    reducers: {

    },

    extraReducers: (builder) => {

        builder

            .addCase(checkoutThunk.pending, (state) => {
                state.checkoutLoading = true;
            })

            .addCase(checkoutThunk.fulfilled, (state) => {
                state.checkoutLoading = false;
            })

            .addCase(checkoutThunk.rejected, (state) => {
                state.checkoutLoading = false;
            })


            .addCase(createOrderThunk.pending, (state) => {
                state.createOrderLoading = true;
            })

            .addCase(createOrderThunk.fulfilled, (state) => {
                state.createOrderLoading = false;
            })

            .addCase(createOrderThunk.rejected, (state) => {
                state.createOrderLoading = false;
            })



            .addCase(fetchOrders.pending, (state) => {
                state.ordersLoading = true;
            })

            .addCase(fetchOrders.fulfilled, (state, action) => {
                state.ordersLoading = false;
                state.orders = action.payload.results;
            })

            .addCase(fetchOrders.rejected, (state) => {
                state.ordersLoading = false;
            })



            .addCase(fetchOrderDetail.pending, (state) => {
                state.orderDetailLoading = true;
            })

            .addCase(fetchOrderDetail.fulfilled, (state, action) => {
                state.orderDetailLoading = false;
                state.orderDetail = action.payload;
            })

            .addCase(fetchOrderDetail.rejected, (state) => {
                state.orderDetailLoading = false;
            })


            .addCase(cancelOrderThunk.pending, (state) => {
                state.cancelOrderLoading = true;
            })

            .addCase(cancelOrderThunk.fulfilled, (state) => {
                state.cancelOrderLoading = false;
            })

            .addCase(cancelOrderThunk.rejected, (state) => {
                state.cancelOrderLoading = false;
            })


            .addCase(cancelOrderItemThunk.pending, (state) => {
                state.cancelOrderItemLoading = true;
            })

            .addCase(cancelOrderItemThunk.fulfilled, (state) => {
                state.cancelOrderItemLoading = false;
            })

            .addCase(cancelOrderItemThunk.rejected, (state) => {
                state.cancelOrderItemLoading = false;
            });
    },
});


export const {
    resetOrderDetail,
    resetOrders,
} = orderSlice.actions;

export default orderSlice.reducer;