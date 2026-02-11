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

        if (result.success && result.data?.accessToken) {
            if (typeof window !== "undefined") {
                localStorage.setItem("token", result.data.accessToken);
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

        if (result.success && result.data?.accessToken) {
            if (typeof window !== "undefined") {
                localStorage.setItem("token", result.data.accessToken);
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

export const userApi = {
    getProfile: async () => {
        return await fetchAPI<any>("/users/profile");
    },

    updateProfile: async (data: { name?: string; phone?: string; bio?: string }) => {
        const result = await fetchAPI<any>("/users/profile", {
            method: "PUT",
            body: JSON.stringify(data),
        });

        if (result.success && result.data?.user) {
            if (typeof window !== "undefined") {
                // Update stored user data
                const currentUser = authApi.getCurrentUser();
                localStorage.setItem("user", JSON.stringify({ ...currentUser, ...result.data.user }));
            }
        }

        return result;
    },

    getSavedSpots: async () => {
        return await fetchAPI<any>("/users/saved");
    },

    toggleSaveSpot: async (spotId: string) => {
        return await fetchAPI<any>(`/users/saved/${spotId}`, {
            method: "POST"
        });
    }
};

export const reviewApi = {
    getSpotReviews: async (spotId: string) => {
        return await fetchAPI<any>(`/reviews/spot/${spotId}`);
    },

    createReview: async (data: { spot: string; rating: number; text: string; images?: string[] }) => {
        return await fetchAPI<any>("/reviews", {
            method: "POST",
            body: JSON.stringify(data),
        });
    }
};

export const api = {
    get: <T>(endpoint: string) => fetchAPI<T>(endpoint, { method: "GET" }),
    post: <T>(endpoint: string, body: any) => fetchAPI<T>(endpoint, { method: "POST", body: JSON.stringify(body) }),
    put: <T>(endpoint: string, body: any) => fetchAPI<T>(endpoint, { method: "PUT", body: JSON.stringify(body) }),
    delete: <T>(endpoint: string) => fetchAPI<T>(endpoint, { method: "DELETE" }),
};
