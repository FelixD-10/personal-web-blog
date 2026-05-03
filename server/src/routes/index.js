const { authController, postController, categoryController } = require('../controllers');
const {
  authenticate,
  sanitizeXSS,
  validateLogin,
  validateCreatePost,
  validateUpdatePost,
  validateCreateCategory,
  validateUpdateCategory
} = require('../middleware');

// ─── Auth Routes ────────────────────────────────────────────
const authRoutes = (router) => {
  router.post('/auth/login', sanitizeXSS, /* validateLogin, */ authController.login);
  router.post('/auth/logout', authController.logout);
  router.get('/auth/me', authenticate, authController.getMe);
};

// ─── Post Routes ────────────────────────────────────────────
const postRoutes = (router) => {
  // Public routes
  router.get('/posts', postController.getPublishedPosts);
  router.get('/posts/search', postController.searchPosts);
  router.get('/posts/category/:slug', postController.getPostsByCategory);
  router.get('/posts/slug/:slug', postController.getPostBySlug);

  // Protected admin routes
  router.get('/posts/admin/all', authenticate, postController.getAllPosts);
  router.post('/posts', authenticate, sanitizeXSS, validateCreatePost, postController.createPost);
  router.put('/posts/:id', authenticate, sanitizeXSS, validateUpdatePost, postController.updatePost);
  router.delete('/posts/:id', authenticate, postController.deletePost);
};

// ─── Category Routes ────────────────────────────────────────
const categoryRoutes = (router) => {
  // Public routes
  router.get('/categories', categoryController.getAllCategories);
  router.get('/categories/slug/:slug', categoryController.getCategoryBySlug);

  // Protected admin routes
  router.post('/categories', authenticate, sanitizeXSS, validateCreateCategory, categoryController.createCategory);
  router.put('/categories/:id', authenticate, sanitizeXSS, validateUpdateCategory, categoryController.updateCategory);
  router.delete('/categories/:id', authenticate, categoryController.deleteCategory);
};

module.exports = { authRoutes, postRoutes, categoryRoutes };
