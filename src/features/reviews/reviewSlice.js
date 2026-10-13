import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import { getReviews,
    createReview,createReviewImage,deleteReview,deleteReviewImage,updateReview,getMyReviews,
 } from "@/services/reviewService";

const initialState={
    reviews:[],
    count:0,
    next:null,
    previous:null,
    reviewsLoading:false,
    deleteReviewLoading:false,
    updateReviewLoading:false,
    createReviewLoading:false,
    deleteReviewImageLoading:false,
    createReviewImageLoading:false,
    myReviews:[],
    myReviewsLoading:false
}

export const fetchReviews=createAsyncThunk(
    "reviews/fetchReviews",
    async({slug,params={}},{rejectWithValue})=>{
        try{
        const response=await getReviews(slug,params);
        return response.data
        }
        catch(error){
            return rejectWithValue(error.response?.data)
        }
    }
)
export const createReviewThunk=createAsyncThunk(
    "reviews/createReviewThunk",
    async({slug,data},{rejectWithValue})=>{
        try{
            const response=await createReview(slug,data)

            return response.data
        }
        catch(error){
            return rejectWithValue(error.response?.data)
        }
    }

)
export const updateReviewThunk=createAsyncThunk(
    "reviews/updateReviewThunk",
    async({reviewId,data},{rejectWithValue})=>{
        try{
           
            const response= await updateReview(reviewId,data)
            return response.data
        }
        catch(error){
            return rejectWithValue(error.response?.data)
        }
    }
)

export const deleteReviewThunk=createAsyncThunk(
    "reviews/deleteReviewThunk",
    async(reviewId,{rejectWithValue})=>{
        try{
        
        const response=await deleteReview(reviewId)
        return response.data
        }
        catch(error){
            return rejectWithValue(error.response?.data)
        }
    } 
)

export const createReviewImageThunk=createAsyncThunk(
    "reviews/createReviewImageThunk",
    async({reviewId,data},{rejectWithValue})=>{
        try{
           
            const response= await createReviewImage(reviewId,data)
            return response.data;
        }
        catch(error){
            return rejectWithValue(error.response?.data)
        }
    }
)


export const deleteReviewImageThunk=createAsyncThunk(
    "reviews/deleteReviewImageThunk",
    async(reviewImageId,{rejectWithValue})=>{
        try{
            
            const response=await deleteReviewImage(reviewImageId)
            return response.data;
        }
        catch(error){
            return rejectWithValue(error.response?.data)
        }
    }
)

export const fetchMyReviewsThunk=createAsyncThunk(
    "reviews/fetchMyReviewsThunk",
    async(slug,{rejectWithValue})=>{
        try{
            const response=await getMyReviews(slug)
            return response.data
        }
        catch(error){
            return rejectWithValue(error.response?.data)
        }
    }
)

const reviewSlice=createSlice({
    name:"reviews",
    initialState,
    reducers:{
    },
    extraReducers:(builder)=>{
        builder

        //fetchreviews
        .addCase(fetchReviews.pending,(state)=>{
            state.reviewsLoading=true;
        })
        .addCase(fetchReviews.fulfilled,(state,action)=>{
            state.reviewsLoading=false;
            state.reviews=action.payload.results;
            state.count=action.payload.count;
            state.previous=action.payload.previous;
            state.next=action.payload.next;
        }
        )
        .addCase(fetchReviews.rejected,(state)=>{
            state.reviewsLoading=false;
        })
        //createReviewthunk
        .addCase(createReviewThunk.pending,(state)=>{
            state.createReviewLoading=true;
        })
        .addCase(createReviewThunk.fulfilled,(state)=>{
            state.createReviewLoading=false;
            
        })

        .addCase(createReviewThunk.rejected,(state)=>{
            state.createReviewLoading=false;
        })
       //updatereviewthunk
        .addCase(updateReviewThunk.pending,(state)=>{
            state.updateReviewLoading=true;
        })

        .addCase(updateReviewThunk.fulfilled,(state)=>{
            state.updateReviewLoading=false;
           
        })

        .addCase(updateReviewThunk.rejected,(state)=>{
            state.updateReviewLoading=false;
        })

        //deletereviewthunk
        .addCase(deleteReviewThunk.pending,(state)=>{
            state.deleteReviewLoading=true;
        })
        .addCase(deleteReviewThunk.fulfilled,(state)=>{
            state.deleteReviewLoading=false;
           
        }
        )
        .addCase(deleteReviewThunk.rejected,(state)=>{
            state.deleteReviewLoading=false;
        })
        //createreviewimagethunk
        .addCase(createReviewImageThunk.pending,(state)=>{
            state.createReviewImageLoading=true;
        })
        .addCase(createReviewImageThunk.fulfilled,(state)=>{
            state.createReviewImageLoading=false;
            
        })

        .addCase(createReviewImageThunk.rejected,(state)=>{
            state.createReviewImageLoading=false;
        })
        //deletereviewimagethunk
        .addCase(deleteReviewImageThunk.pending,(state)=>{
            state.deleteReviewImageLoading=true;
        })
        .addCase(deleteReviewImageThunk.fulfilled,(state)=>{
            state.deleteReviewImageLoading=false;
           
        })
        .addCase(deleteReviewImageThunk.rejected,(state)=>{
            state.deleteReviewImageLoading=false;
        })
        .addCase(fetchMyReviewsThunk.pending,(state)=>{
            state.myReviewsLoading=true;
        })
        .addCase(fetchMyReviewsThunk.fulfilled,(state,action)=>{
            state.myReviewsLoading=false;
            state.myReviews=action.payload;
        })
        .addCase(fetchMyReviewsThunk.rejected,(state)=>{
            state.myReviewsLoading=false;
        })
    }

})

export default reviewSlice.reducer