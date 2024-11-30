// Basic configuration for fetch requests
const baseConfig = {
    baseURL: process.env.VUE_APP_API_URL,
    headers: {
        "Content-Type": "application/json",
    },
};

// Request interceptor
const requestInterceptor = (config) => {
    // Add token if exists
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    // Clean params
    if (config.params) {
        config.params = Object.fromEntries(
            Object.entries(config.params).filter(
                ([_, value]) =>
                    value !== undefined && value !== null && value !== ""
            )
        );
    }

    return config;
};

// Response interceptor
const responseInterceptor = async (response) => {
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Network response was not ok");
    }
    return response.json();
};

// Error handler
const errorHandler = (error) => {
    console.error("Request Error:", error);
    throw error;
};

// Main request function
const request = async (url, options = {}) => {
    try {
        // Merge configurations
        const config = {
            ...baseConfig,
            ...options,
            headers: {
                ...baseConfig.headers,
                ...options.headers,
            },
        };

        // Apply request interceptor
        const interceptedConfig = requestInterceptor(config);

        // Build full URL with query params
        let fullUrl = `${interceptedConfig.baseURL}${url}`;
        if (interceptedConfig.params) {
            const queryString = new URLSearchParams(
                interceptedConfig.params
            ).toString();
            fullUrl += `?${queryString}`;
        }

        // Make request
        const response = await fetch(fullUrl, interceptedConfig);

        // Apply response interceptor
        return await responseInterceptor(response);
    } catch (error) {
        return errorHandler(error);
    }
};

// HTTP method shortcuts
export const http = {
    get: (url, config = {}) => request(url, { ...config, method: "GET" }),
    post: (url, data, config = {}) =>
        request(url, {
            ...config,
            method: "POST",
            body: JSON.stringify(data),
        }),
    put: (url, data, config = {}) =>
        request(url, {
            ...config,
            method: "PUT",
            body: JSON.stringify(data),
        }),
    delete: (url, config = {}) => request(url, { ...config, method: "DELETE" }),
};
