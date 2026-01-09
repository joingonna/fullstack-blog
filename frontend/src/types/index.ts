export interface User {
    id: number;
    email: string;
    username: string;
    nickname?: string;
    avatar?: string;
    role: 'admin' | 'user';
    createdAt: string;
    updatedAt: string;
}

export interface Category {
    id: number;
    name: string;
    slug: string;
}

export interface Tag {
    id: number;
    name: string;
    slug: string;
}

export interface Post {
    id: number;
    slug: string;
    title: string;
    content: string;
    summary?: string;
    cover?: string;
    published: boolean;
    views: number;
    createdAt: string;
    updatedAt: string;
    authorId: number;
    author?: User;
    categoryId?: number;
    category?: Category;
    tags?: Tag[];
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
}

export interface LoginResponse {
    access_token: string;
    user: User;
}

export interface ApiError {
    message: string;
    statusCode: number;
}
