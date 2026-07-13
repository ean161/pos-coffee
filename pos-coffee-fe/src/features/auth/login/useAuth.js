import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getCurrentUser, login, logout } from "./authApi.js";

export const useCurrentUser = () => {
    return useQuery({
        queryKey: ["currentUser"],
        queryFn: getCurrentUser,
        enabled: Boolean(localStorage.getItem("accessToken")),
        retry: false,
    });
};

export const useLogin = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: login,
        onSuccess: (data) => {
            localStorage.setItem("accessToken", data.token);
            queryClient.setQueryData(["currentUser"], data.user);
        },
    });
};

export const useLogout = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: logout,
        onSettled: () => {
            localStorage.removeItem("accessToken");
            queryClient.removeQueries({ queryKey: ["currentUser"] });
        },
    });
};
