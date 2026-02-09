import type { ApiResponse } from './types';

class ApiError extends Error {
    constructor(
        message: string,
        public statusCode: number = 500,
        public data?: any
    ) {
        super(message);
        this.name = 'ApiError';
    }
}

async function handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new ApiError(
            error.error || `HTTP ${response.status}: ${response.statusText}`,
            response.status,
            error
        );
    }

    return response.json();
}

export const apiClient = {
    async post<T = any>(url: string, data: any): Promise<ApiResponse<T>> {
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            return handleResponse<ApiResponse<T>>(response);
        } catch (error) {
            if (error instanceof ApiError) {
                return {
                    success: false,
                    error: error.message,
                };
            }
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
            };
        }
    },

    async get<T = any>(url: string): Promise<ApiResponse<T>> {
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            return handleResponse<ApiResponse<T>>(response);
        } catch (error) {
            if (error instanceof ApiError) {
                return {
                    success: false,
                    error: error.message,
                };
            }
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
            };
        }
    },
};
