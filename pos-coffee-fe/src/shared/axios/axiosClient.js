import axios from "axios";
import { clearStoredAuth } from "../../features/auth/login/authStorage.js";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api/v1";

const axiosClient = axios.create({
    baseURL: BASE_URL,
    headers: { "Content-Type": "application/json" },
});

axiosClient.interceptors.request.use((config) => {
    const token = localStorage.getItem("accessToken");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

axiosClient.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error?.response?.status;
        const responseData = error?.response?.data;
        const userMessage =
            (typeof responseData === "string" ? responseData : null) ||
            responseData?.message ||
            responseData?.error ||
            error?.message ||
            "Đã có lỗi xảy ra, vui lòng thử lại!";
        error.userMessage = userMessage;
        error.message = userMessage;

        const isLoginRequest = error.config?.url?.endsWith("/auth/login");
        if (status === 401 && !isLoginRequest) {
            clearStoredAuth();
            if (window.location.pathname !== "/login") {
                sessionStorage.setItem(
                    "authRedirectPath",
                    `${window.location.pathname}${window.location.search}`
                );
                window.location.assign("/login");
            }
        }

        return Promise.reject(error);
    }
);

export default axiosClient;
