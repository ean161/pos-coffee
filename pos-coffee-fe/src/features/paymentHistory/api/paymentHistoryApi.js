import axiosClient from "../../../shared/axios/axiosClient.js";

export const getPaymentHistory = (params) =>
    axiosClient.get("/admin/payment-history", { params });
