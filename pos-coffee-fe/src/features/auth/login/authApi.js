import axiosClient from "../../../shared/axios/axiosClient.js";

export const login = async (payload) => {
    const response = await axiosClient.post("/auth/login", payload);
    return response.data;
};

export const logout = async () => {
    await axiosClient.post("/auth/logout");
};

export const getCurrentUser = async () => {
    const response = await axiosClient.get("/auth/me");
    return response.data;
};