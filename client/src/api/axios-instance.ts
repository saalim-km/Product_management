import axios from "axios";
import { toast } from "sonner";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URI,
  withCredentials: true,
});

let isRefreshing = false;

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check for 401 status and the specific error message in response data
    if (error.response?.status === 401 && 
        error.response?.data?.message === "Unauthorized access." && 
        !originalRequest._retry) {
      
      console.log("Access token expired - attempting refresh");
      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;
        try {
          // Refresh the token
          await axiosInstance.post("/auth/refresh-token");
          isRefreshing = false;

          // Retry the original request with new token
          return axiosInstance(originalRequest);
        } catch (refreshError) {
          isRefreshing = false;

          // Clear session and redirect to login
          console.log("Refresh failed - clearing session");
          localStorage.removeItem("userSession");
          sessionStorage.removeItem("userSession"); // Also clear sessionStorage if used
          
          toast.info("Please login again");
          window.location.href = "/auth";
          
          return Promise.reject(refreshError);
        }
      } else {
        // If refresh is already in progress, wait for it to complete
        // You might want to implement a queue system here
        return new Promise((resolve) => {
          const interval = setInterval(() => {
            if (!isRefreshing) {
              clearInterval(interval);
              resolve(axiosInstance(originalRequest));
            }
          }, 100);
        });
      }
    }
    
    // For other 401 errors that aren't "Unauthorized access." message
    if (error.response?.status === 401) {
      console.log("Other 401 error - clearing session");
      localStorage.removeItem("userSession");
      sessionStorage.removeItem("userSession");
      toast.info("Please login again");
      window.location.href = "/auth";
    }
    
    return Promise.reject(error);
  }
);