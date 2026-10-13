import api from "./api";

export const getReviews = (slug, params = {}) => {
    return api.get(`/reviews/product/${slug}/`, {
        params
    });
};

export const createReview = (slug, data) => {
    return api.post(`/reviews/products/${slug}/create/`, data);
};

export const updateReview = (reviewId, data) => {
    return api.patch(`/reviews/${reviewId}/update/`, data);
};

export const deleteReview = (reviewId) => {
    return api.delete(`/reviews/${reviewId}/delete/`);
};

export const createReviewImage = (reviewId, data) => {
    return api.post(`/reviews/${reviewId}/images/create/`, data);
};

export const deleteReviewImage = (imageId) => {
    return api.delete(`/reviews/images/${imageId}/delete/`);
};

export const getMyReviews = (slug) => {
    return api.get(`/reviews/product/${slug}/my-reviews/`);
};

export const getAllReviews = (params = {}) => {
    return api.get("/reviews/", {
        params
    })
}