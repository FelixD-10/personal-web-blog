import type { Post, Category, PostsResponse, CategoryPostsResponse, AuthResponse } from '../types';

const API_BASE = import.meta.env.VITE_API_URL;

async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('authToken');
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
    // Không cần credentials: 'include' nữa
  });
  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem('authToken');
      // Có thể redirect về login
    }
    throw new Error(await response.text());
  }
  return response.json();
}

// ─── Auth API ───────────────────────────────────────────────
export const authApi = {
  login: (email: string, password: string) =>
    apiRequest<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  logout: () =>
    apiRequest<{ message: string }>('/auth/logout', { method: 'POST' }),
  getMe: () =>
    apiRequest<AuthResponse>('/auth/me'),
};

// ─── Posts API ──────────────────────────────────────────────
export const postsApi = {
  getPublished: (params?: { page?: number; limit?: number }) => {
    const query = new URLSearchParams();
    if (params?.page) query.set('page', String(params.page));
    if (params?.limit) query.set('limit', String(params.limit));
    return apiRequest<PostsResponse>(`/posts?${query.toString()}`);
  },
  getBySlug: (slug: string) =>
    apiRequest<Post>(`/posts/slug/${slug}`),
  getByCategory: (slug: string) =>
    apiRequest<CategoryPostsResponse>(`/posts/category/${slug}`),
  search: (q: string) =>
    apiRequest<Post[]>(`/posts/search?q=${encodeURIComponent(q)}`),
  getAdmin: () =>
    apiRequest<PostsResponse>('/posts/admin/all'),
  create: (data: Partial<Post>) =>
    apiRequest<Post>('/posts', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: Partial<Post>) =>
    apiRequest<Post>(`/posts/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) =>
    apiRequest<{ message: string }>(`/posts/${id}`, { method: 'DELETE' }),
};

// ─── Categories API ─────────────────────────────────────────
export const categoriesApi = {
  getAll: () => apiRequest<Category[]>('/categories'),
  create: (data: Partial<Category>) =>
    apiRequest<Category>('/categories', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: Partial<Category>) =>
    apiRequest<Category>(`/categories/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) =>
    apiRequest<{ message: string }>(`/categories/${id}`, { method: 'DELETE' }),
};
