import axiosClient from "./axiosClient";

const categoryApi = {
    /**
     * GET /api/v1/categories?page=&size=&sort=
     */
    getAll: (params = {}) => {
        const { page = 0, size = 10, sort = "id,desc" } = params;
        return axiosClient.get("/categories", {
            params: { page, size, sort },
        });
    },

    /**
     * GET /api/v1/categories/{id}
     */
    getById: (id) => axiosClient.get(`/categories/${id}`),

    /**
     * POST /api/v1/categories
     */
    create: (name) => axiosClient.post("/categories", { name }),

    /**
     * PUT /api/v1/categories/{id}
     */
    update: (id, name) => axiosClient.put(`/categories/${id}`, { name }),

    /**
     * PATCH /api/v1/categories/{id}/status?status=true|false
     */
    updateStatus: (id, status) =>
        axiosClient.patch(`/categories/${id}/status`, null, {
            params: { status },
        }),
};

export default categoryApi;