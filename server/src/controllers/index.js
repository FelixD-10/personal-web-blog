const { authService, postService, categoryService } = require('../services');

// ─── Auth Controller ────────────────────────────────────────
const authController = {
  async login(req, res) {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);
      res.status(200).json({
        success: true,
        user: { id: user._id, email: user.email, name: user.name },
        token: result.token // Gửi token về cho frontend
      });
      res.json({ user: result.user, token: result.token });
    } catch (error) {
      res.status(401).json({ message: error.message });
    }
  },

  async logout(req, res) {
    res.clearCookie('token', {
      httpOnly: true,
      secure: true,                // Luôn true trên production (Render dùng HTTPS)
      sameSite: 'none'
    });
    res.json({ message: 'Logged out successfully' });
  },

  async getMe(req, res) {
    try {
      const user = await authService.getMe(req.user.id);
      res.json({ user });
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }
};

// ─── Post Controller ────────────────────────────────────────
const postController = {
  async createPost(req, res) {
    try {
      req.body.authorId = req.user.id;
      const post = await postService.createPost(req.body);
      res.status(201).json(post);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  async updatePost(req, res) {
    try {
      const post = await postService.updatePost(req.params.id, req.body);
      res.json(post);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  async deletePost(req, res) {
    try {
      const result = await postService.deletePost(req.params.id);
      res.json(result);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  },

  async getAllPosts(req, res) {
    try {
      const result = await postService.getAllPosts(req.query);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async getPublishedPosts(req, res) {
    try {
      const result = await postService.getPublishedPosts(req.query);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async getPostBySlug(req, res) {
    try {
      const post = await postService.getPostBySlug(req.params.slug);
      res.json(post);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  },

  async getPostsByCategory(req, res) {
    try {
      const result = await postService.getPostsByCategory(req.params.slug);
      res.json(result);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  },

  async searchPosts(req, res) {
    try {
      const posts = await postService.searchPosts(req.query.q || '');
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

// ─── Category Controller ────────────────────────────────────
const categoryController = {
  async createCategory(req, res) {
    try {
      const category = await categoryService.createCategory(req.body);
      res.status(201).json(category);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  async updateCategory(req, res) {
    try {
      const category = await categoryService.updateCategory(req.params.id, req.body);
      res.json(category);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  async deleteCategory(req, res) {
    try {
      const result = await categoryService.deleteCategory(req.params.id);
      res.json(result);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  },

  async getAllCategories(req, res) {
    try {
      const categories = await categoryService.getAllCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async getCategoryBySlug(req, res) {
    try {
      const category = await categoryService.getCategoryBySlug(req.params.slug);
      res.json(category);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }
};

module.exports = { authController, postController, categoryController };
