import axios from "axios";
import { toWorkerDto, fromWorkerDto, paginateWorkers } from "./workerMapper";

const api = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL || "http://localhost:8000/api/v1",
    timeout: 15000,
    headers: { "Content-Type": "application/json" },
});

function extractErrorMessage(error) {
    const data = error.response?.data;
    if (typeof data === "string" && data.trim()) return data;
    return (
        data?.message ||
        data?.mensaje ||
        data?.error ||
        error.message ||
        "Error desconocido"
    );
}

api.interceptors.response.use(
    (res) => res,
    (error) => {
        if (error.response?.status === 401) {
            window.dispatchEvent(new CustomEvent("auth:unauthorized"));
        }
        return Promise.reject(new Error(extractErrorMessage(error)));
    }
);

export default api;

export const employeeService = {
    getAll: async (params = {}) => {
        const { data } = await api.get("/workers");
        const workers = (Array.isArray(data) ? data : []).map(fromWorkerDto);
        return { data: paginateWorkers(workers, params) };
    },

    getById: async (id) => {
        const { data } = await api.get(`/workers/${id}`);
        return { data: fromWorkerDto(data) };
    },

    create: async (payload) => {
        await api.post("/workers", toWorkerDto(payload));
        return { data: payload };
    },

    update: async (id, payload) => {
        await api.put(`/workers/${id}`, toWorkerDto(payload));
        return { data: { ...payload, id } };
    },

    delete: async (id) => {
        await api.delete(`/workers/${id}`);
        return { data: { message: "Eliminado" } };
    },
};

export const otpService = {
    sendPhone: (phone) =>
        api.post("/verification/sms/send", null, {
            params: { phoneNumber: phone },
        }),

    verifyPhone: (phone, code) =>
        api.post("/verification/sms/verify", null, {
            params: { phoneNumber: phone, code },
        }),

    sendEmail: (email) =>
        api.post("/verification/email/send", { email }),

    verifyEmail: (email, code) =>
        api.post("/verification/email/verify", { email, code }),
};

export const parametersService = {
    get: () => api.get("/parametros"),
};
