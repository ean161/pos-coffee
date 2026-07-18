import axiosClient from "../../../shared/axios/axiosClient.js";

const shiftApi = {
    getSlots: () => {
        return axiosClient.get("/shift-assignments/slots");
    },

    getInRange: (from, to) => {
        return axiosClient.get("/shift-assignments", { params: { from, to } });
    },

    assign: (data) => {
        return axiosClient.post("/shift-assignments", data);
    },

    remove: (id) => {
        return axiosClient.delete(`/shift-assignments/${id}`);
    }
};

export default shiftApi;
