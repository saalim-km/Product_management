import { get } from "http";
import { axiosInstance } from "../api/axios-instance";
import { IProduct } from "../types/types";
import { ApiResponse } from "./auth.service";

export const productService = {
  createProduct: async (data: any) : Promise<ApiResponse<IProduct>> => {
    const response = await axiosInstance.post("/product", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },
  getAllProducts: async () => {
    const response = await axiosInstance.get("/product");
    return response.data;
  },
  updateProduct : async (id: string, data: any) : Promise<ApiResponse<IProduct>> => {
    const response = await axiosInstance.put(`/product/${id}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  }
};

// params: { search: string; page: number; limit: number }