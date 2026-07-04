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
axiosClient.interceptors.response.use(
    (response) => response,
    (error) => {
        const message =
            error?.response?.data?.message ||
            error?.response?.data?.error ||
            "Đã có lỗi xảy ra, vui lòng thử lại!";
        return Promise.reject(new Error(message));
    }
);

export default axiosClient;