export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Post {
  _id: string;
  title: string;
  slug: string;
  content: string;
  coverImage: string;
  categoryId: Category | string;
  tags: string[];
  authorId: User | { id: string; name: string; email: string } | string;
  status: 'draft' | 'published';
  createdAt: string;
  updatedAt?: string;
}

export interface PostsResponse {
  posts: Post[];
  total: number;
  page: number;
  totalPages: number;
}

export interface CategoryPostsResponse {
  category: Category;
  posts: Post[];
}

export interface AuthResponse {
  user: User;
}
