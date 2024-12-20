import { http } from "@/utils/request";

export const lessonApi = {
    // Get lessons with search parameters
    getLessons(params = {}) {
        return http.get("/api/lessons/search", { params });
    },
};
