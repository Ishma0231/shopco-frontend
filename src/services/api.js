import axios from "axios"
const api=axios.create({
    baseURL:process.env.NEXT_PUBLIC_API_URL,
    withCredentials:true,
})

let store
let authActions
export const injectStore=(reduxStore,actions)=>{
    store=reduxStore
    authActions=actions
}

api.interceptors.request.use(
    (config)=>{
        const accessToken=store?.getState().auth.accessToken
        
        if (accessToken){
            config.headers.Authorization=`Bearer ${accessToken}`;
        }
        return config;

    }
    
)

api.interceptors.response.use(
    (response)=>{
        return response
    },
    async(error)=>{
        const originalRequest=error.config

        if (error.response?.status===401){
            if(originalRequest.url==="/accounts/token/refresh/"){
                store.dispatch(authActions.clearAuth())
                return Promise.reject(error)
            }

            if (!originalRequest._retry){
                originalRequest._retry=true
                const response=await api.post("/accounts/token/refresh/")
                store.dispatch(authActions.setAccessToken(response.data.access))
                return api(originalRequest)
            }

        }

        return Promise.reject(error)
    }

)

export default api