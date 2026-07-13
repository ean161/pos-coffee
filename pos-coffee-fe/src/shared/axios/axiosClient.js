import axios from "axios";

// Đổi lại BASE_URL cho đúng với backend Spring Boot của bạn
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api/v1";

const axiosClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Có thể thêm interceptor để gắn token, log lỗi... tại đây
axiosClient.interceptors.request.use((config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

axiosClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error?.response?.status === 401) {
            localStorage.removeItem("accessToken");
            if (window.location.pathname !== "/login") {
                window.location.assign("/login");
            }
        }

        const message =
            error?.response?.data?.message ||
            error?.response?.data?.error ||
            "Đã có lỗi xảy ra, vui lòng thử lại!";
        return Promise.reject(new Error(message));
    }
);

export default axiosClient;
