import axiosClient from "../../../shared/axios/axiosClient";

export const getStaffOrders = () => axiosClient.get("/staff/orders");

export const updateStaffOrderStatus = (orderId, status) =>
    axiosClient.patch(`/staff/orders/${orderId}/status`, { status });
