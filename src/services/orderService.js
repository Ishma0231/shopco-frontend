import api from "./api"

export const getOrders = () => {
    return api.get("/orders/")
}

export const checkout = (data) => {
    return api.post("/orders/checkout/", data)
}

export const createOrder = (data) => {
    return api.post("/orders/create/", data)
}

export const getOrderDetail = (orderId) => {
    return api.get(`/orders/${orderId}/`)
}

export const cancelOrder = (orderId) => {
    return api.patch(`/orders/${orderId}/cancel/`)
}

export const cancelOrderItem = (itemId) => {
    return api.patch(`/orders/items/${itemId}/cancel/`)
}