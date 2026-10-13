import api from "./api"

export const getAddress=()=>{
    return api.get("/users/addresses/")
}

export const createAddress=(data)=>{
    return api.post("/users/addresses/create/",data)
}

export const updateAddress=(addressId,data)=>{
    return api.patch(`/users/addresses/${addressId}/edit/`,data)
}

export const deleteAddress=(addressId)=>{
    return api.delete(`/users/addresses/${addressId}/delete/`)
}

