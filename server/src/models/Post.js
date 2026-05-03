const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    content: {
      type: String,
      required: true
    },

    excerpt: {
      type: String
    },

    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'draft'
    },

    coverImage: {
      type: String
    },

    tags: {
      type: [String],
      default: []
    },

    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true
    },

    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    originalAuthor: {
      type: String,
      default: null,
      trim: true
    },
    sourceUrl: {
      type: String,
      default: null,
      trim: true
    }
  },
  { timestamps: true }
);

// 🔥 fix overwrite model error
module.exports =
  mongoose.models.Post || mongoose.model('Post', postSchema);