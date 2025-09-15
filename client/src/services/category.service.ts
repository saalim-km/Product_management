import { axiosInstance } from "../api/axios-instance"
import { ApiResponse } from "./auth.service";

export const CategoryService = {
    addCategory : async (name : string) : Promise<ApiResponse> => {
        const response = await axiosInstance.post('/category', { name })
        console.log(response);
        return response.data;
    },
    deleteCategory : async (id : string) : Promise<ApiResponse> => {
        const response = await axiosInstance.delete(`/category/${id}`);
        return response.data;
    },
    addSubCategory : async (categoryId : string, name : string) : Promise<ApiResponse> => {
        const response = await axiosInstance.post(`/category/sub/${categoryId}`, { name });
        return response.data;
    },
    deleteSubCategory : async (id : string) : Promise<ApiResponse> => {
        const response = await axiosInstance.delete(`/category/sub/${id}`);
        return response.data;
    }
}