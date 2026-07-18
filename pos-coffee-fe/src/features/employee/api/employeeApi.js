import axiosClient from "../../../shared/axios/axiosClient.js";

const employeeApi = {
    getAll: () => {
        return axiosClient.get("/employees");
    },

    getById: (id) => {
        return axiosClient.get(`/employees/${id}`);
    },

    create: (data) => {
        return axiosClient.post("/employees", data);
    },

    update: (id, data) => {
        return axiosClient.put(`/employees/${id}`, data);
    },

    delete: (id) => {
        return axiosClient.delete(`/employees/${id}`);
    },

    updateWage: (id, hourlyWage) => {
        return axiosClient.patch(`/employees/${id}/wage`, { hourlyWage });
    }
};

export default employeeApi;
