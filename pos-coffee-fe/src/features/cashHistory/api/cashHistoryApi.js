import axiosClient from "../../../shared/axios/axiosClient.js";

const cashHistoryApi = {
    open: (openAmount) => axiosClient.post("/cash-history/open", { openAmount }),
    close: (closeAmount) => axiosClient.put("/cash-history/close", { closeAmount }),
    getCurrent: () => axiosClient.get("/cash-history/current"),
    listAll: () => axiosClient.get("/cash-history"),
};

export default cashHistoryApi;
