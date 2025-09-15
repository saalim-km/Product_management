import { axiosInstance } from "../api/axios-instance"
import { ICategory, ISubCategory } from "../types/types";
import { ApiResponse } from "./auth.service";

export const CategoryService = {
    addCategory : async (name : string) : Promise<ApiResponse<ICategory>> => {
        const response = await axiosInstance.post('/category', { name })
        console.log(response);
        return response.data;
    },
    getAllCategories : async () : Promise<ApiResponse<ICategory[]>> => {
        const response = await axiosInstance.get('/category');
        return response.data;
    },
    deleteCategory : async (id : string) : Promise<ApiResponse> => {
        const response = await axiosInstance.delete(`/category/${id}`);
        return response.data;
    },
    addSubCategory : async (categoryId : string, name : string) : Promise<ApiResponse<ISubCategory>> => {
        const response = await axiosInstance.post(`/category/sub`, { name : name , category : categoryId});
        return response.data;
    },
    deleteSubCategory : async (id : string) : Promise<ApiResponse> => {
        const response = await axiosInstance.delete(`/category/sub/${id}`);
        return response.data;
    },
    getallsubcategories : async () : Promise<ApiResponse<ISubCategory[]>> => {
        const response = await axiosInstance.get('/category/sub');
        return response.data;
    }
}