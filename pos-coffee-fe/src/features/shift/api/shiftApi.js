import axiosClient from "../../../shared/axios/axiosClient.js";

const shiftApi = {
    // ───── ShiftSlot CRUD ─────
    getSlots: (from, to) =>
        axiosClient.get("/shift-assignments/slots", { params: { from, to } }),

    createSlot: (data) => axiosClient.post("/shift-assignments/slots", data),

    updateSlot: (id, data) => axiosClient.put(`/shift-assignments/slots/${id}`, data),

    deleteSlot: (id) => axiosClient.delete(`/shift-assignments/slots/${id}`),

    seedDefaultSlots: (days = 7) =>
        axiosClient.post(`/shift-assignments/slots/seed`, null, { params: { days } }),

    // ───── ShiftAssignment ─────
    getInRange: (from, to) =>
        axiosClient.get("/shift-assignments", { params: { from, to } }),

    /** data: { slotId, employeeUserIds: string[], workDate, note? } */
    assign: (data) => axiosClient.post("/shift-assignments", data),

    remove: (id) => axiosClient.delete(`/shift-assignments/${id}`),
};

export default shiftApi;