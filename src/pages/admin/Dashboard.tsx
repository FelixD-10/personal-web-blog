import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { postsApi, categoriesApi } from '../../api/client';
import type { Post, Category } from '../../types';

type Tab = 'posts' | 'categories';

export default function AdminDashboard() {
  const { isAuthenticated, isLoading, user, logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('posts');

  // Posts state
  const [posts, setPosts] = useState<Post[]>([]);
  const [postLoading, setPostLoading] = useState(true);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [showPostForm, setShowPostForm] = useState(false);
  const [postForm, setPostForm] = useState({
    title: '',
    slug: '',
    content: '',
    coverImage: '',
    categoryId: '',
    tags: '',
    status: 'draft' as 'draft' | 'published',
  });

  // Categories state
  const [categories, setCategories] = useState<Category[]>([]);
  const [catLoading, setCatLoading] = useState(true);
  const [editingCat, setEditingCat] = useState<Category | null>(null);
  const [showCatForm, setShowCatForm] = useState(false);
  const [catForm, setCatForm] = useState({ name: '', slug: '' });

  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Auth guard
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/admin/login', { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  // Fetch posts
  const fetchPosts = useCallback(async () => {
    try {
      const data = await postsApi.getAdmin();
      setPosts(data.posts);
    } catch {
      setMessage({ type: 'error', text: 'Failed to fetch posts. Is the server running?' });
    } finally {
      setPostLoading(false);
    }
  }, []);

  // Fetch categories
  const fetchCategories = useCallback(async () => {
    try {
      const data = await categoriesApi.getAll();
      setCategories(data);
    } catch {
      setMessage({ type: 'error', text: 'Failed to fetch categories.' });
    } finally {
      setCatLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchPosts();
      fetchCategories();
    }
  }, [isAuthenticated, fetchPosts, fetchCategories]);

  // Generate slug from title
  const generateSlug = (title: string) =>
    title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

  // ─── Post Handlers ────────────────────────────────────────
  const handleCreatePost = () => {
    setEditingPost(null);
    setPostForm({ title: '', slug: '', content: '', coverImage: '', categoryId: '', tags: '', status: 'draft' });
    setShowPostForm(true);
  };

  const handleEditPost = (post: Post) => {
    setEditingPost(post);
    const cat = typeof post.categoryId === 'object' ? post.categoryId._id : post.categoryId;
    setPostForm({
      title: post.title,
      slug: post.slug,
      content: post.content,
      coverImage: post.coverImage,
      categoryId: cat as string,
      tags: post.tags.join(', '),
      status: post.status,
    });
    setShowPostForm(true);
  };

  const handleSavePost = async () => {
    try {
      const data = {
        ...postForm,
        tags: postForm.tags.split(',').map((t) => t.trim()).filter(Boolean),
      };
      if (editingPost) {
        await postsApi.update(editingPost._id, data);
        setMessage({ type: 'success', text: 'Post updated successfully!' });
      } else {
        await postsApi.create(data);
        setMessage({ type: 'success', text: 'Post created successfully!' });
      }
      setShowPostForm(false);
      fetchPosts();
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Failed to save post' });
    }
  };

  const handleDeletePost = async (id: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    try {
      await postsApi.delete(id);
      setMessage({ type: 'success', text: 'Post deleted successfully!' });
      fetchPosts();
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Failed to delete post' });
    }
  };

  // ─── Category Handlers ────────────────────────────────────
  const handleCreateCat = () => {
    setEditingCat(null);
    setCatForm({ name: '', slug: '' });
    setShowCatForm(true);
  };

  const handleEditCat = (cat: Category) => {
    setEditingCat(cat);
    setCatForm({ name: cat.name, slug: cat.slug });
    setShowCatForm(true);
  };

  const handleSaveCat = async () => {
    try {
      if (editingCat) {
        await categoriesApi.update(editingCat._id, catForm);
        setMessage({ type: 'success', text: 'Category updated successfully!' });
      } else {
        await categoriesApi.create(catForm);
        setMessage({ type: 'success', text: 'Category created successfully!' });
      }
      setShowCatForm(false);
      fetchCategories();
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Failed to save category' });
    }
  };

  const handleDeleteCat = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    try {
      await categoriesApi.delete(id);
      setMessage({ type: 'success', text: 'Category deleted successfully!' });
      fetchCategories();
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Failed to delete category' });
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  // ─── Loading ──────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Dashboard Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-sm text-gray-500">Welcome back, {user?.name}</p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigate('/')}
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                View Site
              </button>
              <button
                onClick={handleLogout}
                className="text-sm text-red-600 hover:text-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Message */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-lg border ${
              message.type === 'success'
                ? 'bg-green-50 border-green-200 text-green-700'
                : 'bg-red-50 border-red-200 text-red-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <p className="text-sm">{message.text}</p>
              <button onClick={() => setMessage(null)} className="text-current opacity-50 hover:opacity-100">
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <p className="text-sm text-gray-500">Total Posts</p>
            <p className="text-2xl font-bold text-gray-900">{posts.length}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <p className="text-sm text-gray-500">Published</p>
            <p className="text-2xl font-bold text-green-600">{posts.filter((p) => p.status === 'published').length}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <p className="text-sm text-gray-500">Categories</p>
            <p className="text-2xl font-bold text-indigo-600">{categories.length}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 mb-6 max-w-xs">
          <button
            onClick={() => setTab('posts')}
            className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
              tab === 'posts' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Posts
          </button>
          <button
            onClick={() => setTab('categories')}
            className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
              tab === 'categories' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Categories
          </button>
        </div>

        {/* ─── Posts Tab ─────────────────────────────────── */}
        {tab === 'posts' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">All Posts</h2>
              <button
                onClick={handleCreatePost}
                className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
              >
                + New Post
              </button>
            </div>

            {/* Post Form */}
            {showPostForm && (
              <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {editingPost ? 'Edit Post' : 'Create New Post'}
                </h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                      <input
                        type="text"
                        value={postForm.title}
                        onChange={(e) => {
                          const title = e.target.value;
                          setPostForm({ ...postForm, title, slug: generateSlug(title) });
                        }}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                        placeholder="Post title"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                      <input
                        type="text"
                        value={postForm.slug}
                        onChange={(e) => setPostForm({ ...postForm, slug: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                        placeholder="post-slug"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Content (HTML)</label>
                    <textarea
                      value={postForm.content}
                      onChange={(e) => setPostForm({ ...postForm, content: e.target.value })}
                      rows={8}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-mono"
                      placeholder="<h2>Title</h2><p>Content...</p>"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                      <select
                        value={postForm.categoryId}
                        onChange={(e) => setPostForm({ ...postForm, categoryId: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                      >
                        <option value="">Select category</option>
                        {categories.map((cat) => (
                          <option key={cat._id} value={cat._id}>{cat.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                      <select
                        value={postForm.status}
                        onChange={(e) => setPostForm({ ...postForm, status: e.target.value as 'draft' | 'published' })}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                      >
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Cover Image URL</label>
                      <input
                        type="url"
                        value={postForm.coverImage}
                        onChange={(e) => setPostForm({ ...postForm, coverImage: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                        placeholder="https://..."
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma-separated)</label>
                    <input
                      type="text"
                      value={postForm.tags}
                      onChange={(e) => setPostForm({ ...postForm, tags: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                      placeholder="javascript, react, web-development"
                    />
                  </div>
                  <div className="flex items-center space-x-3 pt-2">
                    <button
                      onClick={handleSavePost}
                      className="px-6 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      {editingPost ? 'Update Post' : 'Create Post'}
                    </button>
                    <button
                      onClick={() => setShowPostForm(false)}
                      className="px-6 py-2 text-gray-600 text-sm font-medium hover:text-gray-800 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Posts Table */}
            {postLoading ? (
              <div className="animate-pulse space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-16 bg-gray-200 rounded-lg" />
                ))}
              </div>
            ) : posts.length > 0 ? (
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="text-left text-xs font-semibold text-gray-500 uppercase px-4 py-3">Title</th>
                        <th className="text-left text-xs font-semibold text-gray-500 uppercase px-4 py-3">Category</th>
                        <th className="text-left text-xs font-semibold text-gray-500 uppercase px-4 py-3">Status</th>
                        <th className="text-left text-xs font-semibold text-gray-500 uppercase px-4 py-3">Date</th>
                        <th className="text-right text-xs font-semibold text-gray-500 uppercase px-4 py-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {posts.map((post) => {
                        const cat = typeof post.categoryId === 'object' ? post.categoryId : null;
                        return (
                          <tr key={post._id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-4 py-3">
                              <p className="text-sm font-medium text-gray-900 truncate max-w-xs">{post.title}</p>
                              <p className="text-xs text-gray-400">/{post.slug}</p>
                            </td>
                            <td className="px-4 py-3">
                              {cat && (
                                <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
                                  {cat.name}
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-3">
                              <span
                                className={`text-xs font-medium px-2 py-1 rounded ${
                                  post.status === 'published'
                                    ? 'text-green-700 bg-green-50'
                                    : 'text-amber-700 bg-amber-50'
                                }`}
                              >
                                {post.status}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-500">
                              {new Date(post.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-4 py-3 text-right">
                              <div className="flex items-center justify-end space-x-2">
                                <button
                                  onClick={() => handleEditPost(post)}
                                  className="text-xs text-gray-600 hover:text-indigo-600 transition-colors font-medium"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDeletePost(post._id)}
                                  className="text-xs text-gray-600 hover:text-red-600 transition-colors font-medium"
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                <p className="text-gray-500">No posts yet. Create your first post!</p>
                <button
                  onClick={handleCreatePost}
                  className="mt-4 text-sm text-indigo-600 font-medium hover:text-indigo-700"
                >
                  + New Post
                </button>
              </div>
            )}
          </div>
        )}

        {/* ─── Categories Tab ────────────────────────────── */}
        {tab === 'categories' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">All Categories</h2>
              <button
                onClick={handleCreateCat}
                className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
              >
                + New Category
              </button>
            </div>

            {/* Category Form */}
            {showCatForm && (
              <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {editingCat ? 'Edit Category' : 'Create New Category'}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      type="text"
                      value={catForm.name}
                      onChange={(e) => {
                        const name = e.target.value;
                        setCatForm({ ...catForm, name, slug: generateSlug(name) });
                      }}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                      placeholder="Category name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                    <input
                      type="text"
                      value={catForm.slug}
                      onChange={(e) => setCatForm({ ...catForm, slug: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                      placeholder="category-slug"
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-3 mt-4">
                  <button
                    onClick={handleSaveCat}
                    className="px-6 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    {editingCat ? 'Update Category' : 'Create Category'}
                  </button>
                  <button
                    onClick={() => setShowCatForm(false)}
                    className="px-6 py-2 text-gray-600 text-sm font-medium hover:text-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Categories Table */}
            {catLoading ? (
              <div className="animate-pulse space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-12 bg-gray-200 rounded-lg" />
                ))}
              </div>
            ) : categories.length > 0 ? (
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="text-left text-xs font-semibold text-gray-500 uppercase px-4 py-3">Name</th>
                      <th className="text-left text-xs font-semibold text-gray-500 uppercase px-4 py-3">Slug</th>
                      <th className="text-right text-xs font-semibold text-gray-500 uppercase px-4 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {categories.map((cat) => (
                      <tr key={cat._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{cat.name}</td>
                        <td className="px-4 py-3 text-sm text-gray-500">/{cat.slug}</td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => handleEditCat(cat)}
                              className="text-xs text-gray-600 hover:text-indigo-600 transition-colors font-medium"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteCat(cat._id)}
                              className="text-xs text-gray-600 hover:text-red-600 transition-colors font-medium"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                <p className="text-gray-500">No categories yet. Create your first category!</p>
                <button
                  onClick={handleCreateCat}
                  className="mt-4 text-sm text-indigo-600 font-medium hover:text-indigo-700"
                >
                  + New Category
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
