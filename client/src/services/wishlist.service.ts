import { axiosInstance } from "../api/axios-instance"
import { IProduct, IWishlist } from "../types/types";
import { ApiResponse } from "./auth.service";

export const wishlistService = {
    addToWishlist: async (productId: string) : Promise<ApiResponse<IWishlist>> => {
        const response = await axiosInstance.post(`/wishlist/${productId}`);
        return response.data;
    },
    removeFromWishlist: async (productId: string) : Promise<ApiResponse> => {
        const response = await axiosInstance.delete(`/wishlist/${productId}`);
        return response.data;
    },
    getWishlist: async () : Promise<ApiResponse<IProduct[]>> => {
        const response = await axiosInstance.get('/wishlist');
        return response.data;
    }
}