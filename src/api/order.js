import { http } from "@/utils/request";

export const orderApi = {
    // Create new order
    createOrder(data) {
        return http.post("/orders", data);
    },
};
