import { useMutation } from "@tanstack/react-query";
import { createOrder } from "../api/posApi.js";

export const useCreateOrder = () => {
    return useMutation({
        mutationFn: createOrder,
    });
};
