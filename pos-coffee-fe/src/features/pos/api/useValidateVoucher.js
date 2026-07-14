import { useMutation } from "@tanstack/react-query";
import { validateVoucher } from "../api/posApi.js";

export const useValidateVoucher = () => {
    return useMutation({
        mutationFn: ({ code, orderTotal }) => validateVoucher({ code, orderTotal }),
    });
};
