import api from "./api"

export const getWishlist=(params={})=>{
    return api.get("/wishlist/",{params});
}

export const addToWishlist=(data)=>{
    return api.post("/wishlist/add/",data)
}

export const removeWishlistItem=(itemId)=>{
    return api.delete(`/wishlist/items/${itemId}/remove/`)
}

