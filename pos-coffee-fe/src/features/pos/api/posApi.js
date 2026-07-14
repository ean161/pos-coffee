import axiosClient from "../../../shared/axios/axiosClient";

export const getPosMenu = () => axiosClient.get("/pos/menu");

export const createOrder = (data) => axiosClient.post("/pos/orders", data);

export const validateVoucher = (data) => axiosClient.post("/pos/vouchers/validate", data);
