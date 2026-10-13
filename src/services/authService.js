import api from "./api";

export const signup = (data) => {
    return api.post("/accounts/signup/", data);
};

export const verifySignup = (data) => {
    return api.post("/accounts/signup/verify/", data);
};

export const resendSignupOTP = (data) => {
    return api.post("/accounts/signup/resend-otp/", data);
};

export const login = (data) => {
    return api.post("/accounts/login/", data);
};

export const verifyLogin = (data) => {
    return api.post("/accounts/login/verify/", data);
};

export const resendLoginOTP = (data) => {
    return api.post("/accounts/login/resend-otp/", data);
};

export const logout = () => {
    return api.post("/accounts/logout/");
};

export const getme=(accessToken)=>{
    return api.get("/accounts/me/",{
        headers:{
            Authorization:`Bearer ${accessToken}`
        }
    })
}

export const editProfile = (data) => {
    return api.patch("/accounts/me/edit/", data);
};

export const updateProfileImage = (data) => {
    return api.patch("/accounts/me/profile-image/", data);
};

export const deleteProfileImage = () => {
    return api.delete("/accounts/me/profile-image/delete/");
};

export const refreshToken = () => {
    return api.post("/accounts/token/refresh/");
};

export const googleLogin = (data) => {
    return api.post("/accounts/google/", data);
};