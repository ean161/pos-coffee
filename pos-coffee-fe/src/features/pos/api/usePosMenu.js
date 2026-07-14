import { useQuery } from "@tanstack/react-query";
import { getPosMenu } from "../api/posApi.js";

export const usePosMenu = () => {
    return useQuery({
        queryKey: ["pos-menu"],
        queryFn: getPosMenu,
        select: (res) => res.data,
    });
};
