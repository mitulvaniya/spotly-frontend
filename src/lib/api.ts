const API_URL = "https://spotly-frontend.onrender.com/api";

type ApiResponse<T = any> = {
    success: boolean;
    data?: T;
    message?: string;
};

async function fetchAPI<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const url = `${API_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

    const defaultHeaders: HeadersInit = {
        "Content-Type": "application/json",
    };

    // Add token if it exists
    if (typeof window !== "undefined") {
        const token = localStorage.getItem("token");
        if (token) {
            defaultHeaders["Authorization"] = `Bearer ${token}`;
        }
    }

    const config: RequestInit = {
        ...options,
        headers: {
            ...defaultHeaders,
            ...options.headers,
        },
    };

    try {
        const response = await fetch(url, config);
        const data = await response.json();

        if (!response.ok) {
            console.error(`API Error ${response.status}:`, data);
            return {
                success: false,
                message: data.message || `Error ${response.status}: ${response.statusText}`,
            };
        }

        return {
            success: true,
            data: data.data || data, // Handle backend structure wrappers
            message: data.message,
        };
    } catch (error: any) {
        console.error("Network Error:", error);
        return {
            success: false,
            message: error.message || "Network error occurred",
        };
    }
}

export const authApi = {
    login: async (email: string, password: string) => {
        const result = await fetchAPI<any>("/auth/login", {
            method: "POST",
            body: JSON.stringify({ email, password }),
        });

        if (result.success && result.data?.token) {
            if (typeof window !== "undefined") {
                localStorage.setItem("token", result.data.token);
                if (result.data.user) {
                    localStorage.setItem("user", JSON.stringify(result.data.user));
                }
            }
        }

        return result;
    },

    register: async (name: string, email: string, password: string) => {
        const result = await fetchAPI<any>("/auth/register", {
            method: "POST",
            body: JSON.stringify({ name, email, password }),
        });

        if (result.success && result.data?.token) {
            if (typeof window !== "undefined") {
                localStorage.setItem("token", result.data.token);
                if (result.data.user) {
                    localStorage.setItem("user", JSON.stringify(result.data.user));
                }
            }
        }

        return result;
    },

    logout: () => {
        if (typeof window !== "undefined") {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            window.location.href = '/signin';
        }
    },

    getCurrentUser: () => {
        if (typeof window !== "undefined") {
            const userStr = localStorage.getItem("user");
            return userStr ? JSON.parse(userStr) : null;
        }
        return null;
    }
};

export const api = {
    get: <T>(endpoint: string) => fetchAPI<T>(endpoint, { method: "GET" }),
    post: <T>(endpoint: string, body: any) => fetchAPI<T>(endpoint, { method: "POST", body: JSON.stringify(body) }),
    put: <T>(endpoint: string, body: any) => fetchAPI<T>(endpoint, { method: "PUT", body: JSON.stringify(body) }),
    delete: <T>(endpoint: string) => fetchAPI<T>(endpoint, { method: "DELETE" }),
};
