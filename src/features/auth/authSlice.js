import {createSlice,createAsyncThunk} from "@reduxjs/toolkit"
import {login,verifyLogin,signup,verifySignup,googleLogin,
    refreshToken,editProfile,updateProfileImage,deleteProfileImage,getme,logout,resendSignupOTP,resendLoginOTP
} from "@/services/authService"

const initialState={
    user:null,
    accessToken:null,
    isAuthenticated:false,
    loginLoading:false,
    signupLoading:false,
    googleLoginLoading:false,
    logoutLoading:false,
    authInitialised:false,
    verifyLoginLoading:false,
    resendLoginOTPLoading:false,
    resendSignupOTPLoading:false,
    verifySignupLoading:false,
    getMeLoading:false,
    addProfileImageLoading:false,
    editProfileLoading:false,
    deleteProfileImageLoading:false
}

export const loginUser=createAsyncThunk(
    "auth/loginUser",

    async (data,{rejectWithValue})=>{
        try{
          const response=await login(data)
          return response.data
        }
        catch(error){
            return rejectWithValue(error.response?.data)
        }

    }

)

export const verifyLoginUser=createAsyncThunk(
    "auth/verifyLoginUser",

    async (data,{rejectWithValue})=>{
        try{
            const response=await verifyLogin(data)
            return response.data
        }
        catch(error){
            return rejectWithValue(error.response?.data)
        }
    }
)

export const signupUser=createAsyncThunk(
    "auth/signupUser",

    async (data,{rejectWithValue})=>{
        try{
         const response=await signup(data)
         return response.data
        }
        catch(error){
            return rejectWithValue(error.response?.data)
        }

    }
)

export const verifySignupUser=createAsyncThunk(
    "auth/verifySignupUser",

    async(data,{rejectWithValue})=>{
        try{
            const response=await verifySignup(data)
            return response.data
        }
        catch(error){
            return rejectWithValue(error.response?.data)
        }
    }
)

export const googleLoginUser=createAsyncThunk(
    "auth/googleLoginUser",

    async(data,{rejectWithValue})=>{
        try{
            const response=await googleLogin(data)
            return response.data
        }
        catch(error){
            return rejectWithValue(error.response?.data)
        }
    }
)

export const restoreSession=createAsyncThunk(
    "auth/restoreSession",
     async(_,{rejectWithValue}) =>{
        try{
            const refreshResponse=await refreshToken()
            const access=refreshResponse.data.access
            const userResponse=await getme(access)
            return {
                "access":access,
                "user":userResponse.data
            }

        }
        catch(error){
           return rejectWithValue(error.response?.data)
        }
    }
)

export const logoutUser=createAsyncThunk(
    "auth/logoutUser",
    async(_,{rejectWithValue})=>{
        try{
        const response=await logout()
        return response.data
        }
        catch(error){
            return rejectWithValue(error.response?.data)
        }

    }
)

export const resendLoginOTPThunk=createAsyncThunk(
    "auth/resendLoginOTPThunk",
    async(data,{rejectWithValue})=>{
        try{
            const response=await resendLoginOTP(data)
            return response.data
        }
        catch(error){
            return rejectWithValue(error.response?.data)
        }
    }
)
export const resendSignupOTPThunk=createAsyncThunk(
    "auth/resendSignupOTPThunk",
    async(data,{rejectWithValue})=>{
        try{
            const response=await resendSignupOTP(data)
            return response.data
        }
        catch(error){
            return rejectWithValue(error.response?.data)
        }
    }
)

export const getMeThunk=createAsyncThunk(
    "auth/getMeThunk",
    async(_,{rejectWithValue})=>{
        try{
            const response=await getme()
            return response.data
        }
        catch(error){
            return rejectWithValue(error.response?.data)
        }
    }
)

export const editProfileThunk=createAsyncThunk(
    "auth/editProfileThunk",
    async(data,{rejectWithValue})=>{
         try{
            const response=await editProfile(data)
            return response.data
        }
        catch(error){
            return rejectWithValue(error.response?.data)
        }
    }
)
export const addProfileImage=createAsyncThunk(
    "auth/addProfileImage",
    async(data,{rejectWithValue})=>{
         try{
            const response=await updateProfileImage(data)
            return response.data
        }
        catch(error){
            return rejectWithValue(error.response?.data)
        }
    }
)
export const deleteProfileImageThunk=createAsyncThunk(
    "auth/deleteProfileImageThunk",
    async(_,{rejectWithValue})=>{
         try{
            const response=await deleteProfileImage()
            return response.data
        }
        catch(error){
            return rejectWithValue(error.response?.data)
        }
    }
)

const authSlice=createSlice({
    name:"auth",
    initialState,
    reducers:{
        setAccessToken:(state,action)=>{
            state.accessToken=action.payload
        },
        clearAuth:(state)=>{
            state.user=null;
            state.isAuthenticated=false;
            state.accessToken=null;
            state.authInitialised=true;
        }
    },
    extraReducers:(builder)=>{
        builder
        .addCase(loginUser.pending,(state)=>{
            state.loginLoading=true
        })
        .addCase(loginUser.fulfilled,(state)=>{
            state.loginLoading=false
        })
        .addCase(loginUser.rejected,(state)=>{
            state.loginLoading=false
        })
        .addCase(verifyLoginUser.pending,(state)=>{
            state.verifyLoginLoading=true
        })
        .addCase(verifyLoginUser.fulfilled,(state,action)=>{
            state.verifyLoginLoading=false;
            state.user=action.payload.user;
            state.accessToken=action.payload.access;
            state.isAuthenticated=true;
        })
        .addCase(verifyLoginUser.rejected,(state)=>{
            state.verifyLoginLoading=false
        })
        .addCase(signupUser.pending,(state)=>{
            state.signupLoading=true
        })
        .addCase(signupUser.fulfilled,(state)=>{
            state.signupLoading=false
        })
        .addCase(signupUser.rejected,(state)=>{
            state.signupLoading=false
        })
        .addCase(verifySignupUser.pending,(state)=>{
            state.verifySignupLoading=true
        })
        .addCase(verifySignupUser.fulfilled,(state,action)=>{
            state.verifySignupLoading=false;
            state.user=action.payload.user;
            state.accessToken=action.payload.access;
            state.isAuthenticated=true;
        })
        .addCase(verifySignupUser.rejected,(state)=>{
            state.verifySignupLoading=false
        })
        .addCase(googleLoginUser.pending,(state)=>{
            state.googleLoginLoading=true
        })
        .addCase(googleLoginUser.fulfilled,(state,action)=>{
            state.user=action.payload.user;
            state.googleLoginLoading=false;
            state.isAuthenticated=true;
            state.accessToken=action.payload.access;
        })
        .addCase(googleLoginUser.rejected,(state)=>{
            state.googleLoginLoading=false
        })
        .addCase(restoreSession.pending,(state)=>{
            state.authInitialised=false
        })
        .addCase(restoreSession.fulfilled,(state,action)=>{
            state.accessToken=action.payload.access;
            state.user=action.payload.user;
            state.isAuthenticated=true;
            state.authInitialised=true;

        })
        .addCase(restoreSession.rejected,(state)=>{
            state.authInitialised=true;
        })
        .addCase(logoutUser.pending,(state)=>{
            state.logoutLoading=true
            state.authInitialised=false
        })
        .addCase(logoutUser.fulfilled,(state)=>{
            state.user=null;
            state.accessToken=null;
            state.isAuthenticated=false;
            state.logoutLoading=false;
            state.authInitialised=true
        })
        .addCase(logoutUser.rejected,(state)=>{
            state.logoutLoading=false;
            state.authInitialised=true;
        })
        .addCase(resendLoginOTPThunk.pending,(state=>{
            state.resendLoginOTPLoading=true;
        }))
        .addCase(resendLoginOTPThunk.fulfilled,(state=>{
            state.resendLoginOTPLoading=false;
        }))
        .addCase(resendLoginOTPThunk.rejected,(state=>{
            state.resendLoginOTPLoading=false;
        }))

        .addCase(resendSignupOTPThunk.pending,(state)=>{
            state.resendSignupOTPLoading=true;
        })
        .addCase(resendSignupOTPThunk.fulfilled,(state)=>{
            state.resendSignupOTPLoading=false;
        })
        .addCase(resendSignupOTPThunk.rejected,(state)=>{
            state.resendSignupOTPLoading=false;
        })
        .addCase(getMeThunk.pending,(state)=>{
            state.getMeLoading=true
        })

        .addCase(getMeThunk.fulfilled,(state,action)=>{
            state.getMeLoading=false
            state.user=action.payload
        })
        
        .addCase(getMeThunk.rejected,(state)=>{
            state.getMeLoading=false
        })
        .addCase(addProfileImage.pending,(state)=>{
            state.addProfileImageLoading=true
        })
        .addCase(addProfileImage.fulfilled,(state,action)=>{
            state.addProfileImageLoading=false
            state.user={
                ...state.user,
                ...action.payload
            }

        })
        .addCase(addProfileImage.rejected,(state)=>{
            state.addProfileImageLoading=false
        })
        .addCase(editProfileThunk.pending,(state)=>{
            state.editProfileLoading=true
        })
        .addCase(editProfileThunk.fulfilled,(state,action)=>{
            state.editProfileLoading=false
            state.user={
                ...state.user,
                ...action.payload
            }
        })
        .addCase(editProfileThunk.rejected,(state)=>{
            state.editProfileLoading=false
        })
        .addCase(deleteProfileImageThunk.pending,(state)=>{
            state.deleteProfileImageLoading=true
        })
    
        .addCase(deleteProfileImageThunk.fulfilled,(state)=>{
            state.deleteProfileImageLoading=false
            if (state.user){
                state.user.profile_image=null
            }
        })
    
        .addCase(deleteProfileImageThunk.rejected,(state)=>{
            state.deleteProfileImageLoading=false
        })
    }
   
}
    
)

export const {setAccessToken,clearAuth}=authSlice.actions
export default authSlice.reducer