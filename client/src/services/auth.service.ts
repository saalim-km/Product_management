import { AxiosResponse } from "axios";
import { axiosInstance } from "../api/axios-instance";

export interface ApiResponse {
  success : boolean,
  message : string,
}

export const AuthService = {
    login: async (email: string, password: string) : Promise<AxiosResponse> => {
        console.log('inside the login service');
        const response = await axiosInstance.post("/auth/login", { email, password });
        console.log(response);
        return response.data;
    },

    register: async (name: string, email: string, password: string) : Promise<AxiosResponse> => {
        const response = await axiosInstance.post("/auth/register", { name, email, password });
        return response.data;
    },
}