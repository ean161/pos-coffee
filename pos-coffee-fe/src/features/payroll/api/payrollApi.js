import axiosClient from "../../../shared/axios/axiosClient.js";

const payrollApi = {
    getSummary: (from, to) => {
        return axiosClient.get("/admin/payroll/summary", { params: { from, to } });
    },

    getDetail: (employeeId, from, to) => {
        return axiosClient.get("/admin/payroll/detail", { params: { employeeId, from, to } });
    },

    exportUrl: (from, to) => {
        const base = (import.meta.env.VITE_API_URL || "http://localhost:8080/api/v1");
        return `${base}/admin/payroll/summary/export?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`;
    }
};

export default payrollApi;
