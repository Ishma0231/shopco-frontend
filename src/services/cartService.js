import api from "./api";

export const getCart = () => {
    return api.get("/cart/");
};

export const addToCart = (data) => {
    return api.post("/cart/add/", data);
};

export const updateCartItem = (itemId, data) => {
    return api.patch(`/cart/items/${itemId}/update/`, data);
};

export const removeCartItem = (itemId) => {
    return api.delete(`/cart/items/${itemId}/remove/`);
};

export const clearCart = () => {
    return api.delete("/cart/clear/");
};