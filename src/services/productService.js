import api from "./api"

export const getProducts=(params={})=>{
    return api.get("/products/",{
        params,
    })
};

export const getProductDetail=(slug)=>{
    return api.get(`/products/${slug}/`)
}

export const getFilterOptions=(params={})=>{
    return api.get("/products/filter-options/",{
        params
    })
};

export const getBrands=()=>{
    return api.get("/products/brands/")
}

export const getStyles=()=>{
    return api.get("/products/style/")
}
export const getSizes=()=>{
    return api.get("/products/size/")
}