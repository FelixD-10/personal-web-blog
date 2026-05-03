const { User, Category, Post } = require('../models');
const jwt = require('jsonwebtoken');

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// ─── Auth Service ───────────────────────────────────────────
const authService = {
  async login(email, password) {
    const user = await User.findOne({ email });
    if (!user) throw new Error('Invalid credentials');
    const isMatch = await user.comparePassword(password);
    if (!isMatch) throw new Error('Invalid credentials');
    const token = generateToken(user);
    return {
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    };
  },

  async getMe(userId) {
    const user = await User.findById(userId).select('-password');
    if (!user) throw new Error('User not found');
    return { id: user._id, name: user.name, email: user.email, role: user.role };
  },

  async createAdmin(name, email, password) {
    const existingUser = await User.findOne({ email });
    if (existingUser) throw new Error('User already exists');
    const user = await User.create({ name, email, password, role: 'admin' });
    return { id: user._id, name: user.name, email: user.email, role: user.role };
  }
};

// ─── Post Service ───────────────────────────────────────────
const postService = {
  async createPost(data) {
    const post = await Post.create(data);
    return await Post.findById(post._id).populate('categoryId').populate('authorId', 'name email');
  },

  async updatePost(id, data) {
    const post = await Post.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!post) throw new Error('Post not found');
    return await Post.findById(post._id).populate('categoryId').populate('authorId', 'name email');
  },

  async deletePost(id) {
    const post = await Post.findByIdAndDelete(id);
    if (!post) throw new Error('Post not found');
    return { message: 'Post deleted successfully' };
  },

  async getPostBySlug(slug) {
    const post = await Post.findOne({ slug }).populate('categoryId').populate('authorId', 'name email');
    if (!post) throw new Error('Post not found');
    return post;
  },

  async getAllPosts(options = {}) {
    const { page = 1, limit = 50, status, category } = options;
    const query = {};
    if (status) query.status = status;
    if (category) query.categoryId = category;
    const posts = await Post.find(query)
      .populate('categoryId')
      .populate('authorId', 'name email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    const total = await Post.countDocuments(query);
    return { posts, total, page: parseInt(page), totalPages: Math.ceil(total / limit) };
  },

  async getPublishedPosts(options = {}) {
    const { page = 1, limit = 10, category } = options;
    const query = { status: 'published' };
    if (category) query.categoryId = category;
    const posts = await Post.find(query)
      .populate('categoryId')
      .populate('authorId', 'name email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    const total = await Post.countDocuments(query);
    return { posts, total, page: parseInt(page), totalPages: Math.ceil(total / limit) };
  },

  async getPostsByCategory(categorySlug) {
    const category = await Category.findOne({ slug: categorySlug });
    if (!category) throw new Error('Category not found');
    const posts = await Post.find({ categoryId: category._id, status: 'published' })
      .populate('categoryId')
      .populate('authorId', 'name email')
      .sort({ createdAt: -1 });
    return { category, posts };
  },

  async searchPosts(query) {
    const posts = await Post.find({
      status: 'published',
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { content: { $regex: query, $options: 'i' } },
        { tags: { $regex: query, $options: 'i' } }
      ]
    })
      .populate('categoryId')
      .populate('authorId', 'name email')
      .sort({ createdAt: -1 })
      .limit(20);
    return posts;
  }
};

// ─── Category Service ───────────────────────────────────────
const categoryService = {
  async createCategory(data) {
    return await Category.create(data);
  },

  async updateCategory(id, data) {
    const category = await Category.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!category) throw new Error('Category not found');
    return category;
  },

  async deleteCategory(id) {
    const category = await Category.findByIdAndDelete(id);
    if (!category) throw new Error('Category not found');
    return { message: 'Category deleted successfully' };
  },

  async getAllCategories() {
    return await Category.find().sort({ name: 1 });
  },

  async getCategoryBySlug(slug) {
    const category = await Category.findOne({ slug });
    if (!category) throw new Error('Category not found');
    return category;
  }
};

module.exports = { authService, postService, categoryService };
