import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getCurrentUser, login, logout } from "./authApi.js";

export const useCurrentUser = () => {
    return useQuery({
        queryKey: ["currentUser"],
        queryFn: getCurrentUser,
        enabled: Boolean(localStorage.getItem("accessToken")),
        retry: false,
        select: (res) => res.data,
    });
};

export const useLogin = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: login,
        onSuccess: (data) => {
            localStorage.setItem("accessToken", data.token);
            if (data.user) {
                localStorage.setItem("currentUser", JSON.stringify(data.user));
                queryClient.setQueryData(["currentUser"], data.user);
            }
        },
    });
};

export const useLogout = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: logout,
        onSettled: () => {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("currentUser");
            queryClient.removeQueries({ queryKey: ["currentUser"] });
        },
    });
};
