import { Post, LoginResponse, User, ApiError } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

class ApiClient {
    private getHeaders(): HeadersInit {
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('token');
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
        }
        return headers;
    }

    private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
        const url = `${API_BASE_URL}${endpoint}`;
        const headers = { ...this.getHeaders(), ...options.headers };

        const response = await fetch(url, { ...options, headers });

        if (!response.ok) {
            let errorMessage = 'An error occurred';
            try {
                const errorData: ApiError = await response.json();
                errorMessage = errorData.message || errorMessage;
            } catch {
                errorMessage = response.statusText;
            }
            throw new Error(errorMessage);
        }

        // Handle 204 No Content
        if (response.status === 204) {
            return {} as T;
        }

        return response.json();
    }

    // Posts API
    async getPosts(page = 1, limit = 10) {
        // The current backend returns a flat array of posts and does not support pagination params yet.
        // We simulate pagination on the client side for now.
        // Also handling the case where it might return a paginated object in the future.
        const response = await this.request<Post[] | { data: Post[], total: number }>('/posts');

        // Case 1: Array response (current behavior)
        if (Array.isArray(response)) {
            const start = (page - 1) * limit;
            const end = start + limit;
            return {
                data: response.slice(start, end),
                total: response.length
            };
        }

        // Case 2: Object response with data property (future proofing)
        if (response && typeof response === 'object' && 'data' in response) {
            return response as { data: Post[], total: number };
        }

        console.warn('Unexpected API response format for getPosts:', response);
        return { data: [], total: 0 };
    }

    async getPostBySlug(slug: string) {
        return this.request<Post>(`/posts/slug/${slug}`);
    }

    async getPostById(id: number) {
        return this.request<Post>(`/posts/${id}`);
    }

    async createPost(data: Partial<Post>) {
        return this.request<Post>('/posts', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async updatePost(id: number, data: Partial<Post>) {
        return this.request<Post>(`/posts/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(data),
        });
    }

    async deletePost(id: number) {
        return this.request<void>(`/posts/${id}`, {
            method: 'DELETE',
        });
    }

    // Auth API
    async login(credentials: { username?: string; email?: string; password: string }) {
        return this.request<LoginResponse>('/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials),
        });
    }

    async register(data: { username: string; email: string; password: string }) {
        return this.request<User>('/auth/register', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async getMe() {
        return this.request<User>('/auth/me');
    }
}

export const api = new ApiClient();
