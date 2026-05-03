import { Link } from 'react-router-dom';
import type { Post, Category } from '../types';

// ─── Post Card ──────────────────────────────────────────────
export function PostCard({ post }: { post: Post }) {
  const category = typeof post.categoryId === 'object' ? post.categoryId : null;
  const author = typeof post.authorId === 'object' && 'name' in post.authorId ? post.authorId : null;
  const excerpt = post.content.replace(/<[^>]*>/g, '').substring(0, 120) + '...';

  return (
    <article className="group bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <Link to={`/post/${post.slug}`}>
        <div className="aspect-video bg-gray-100 overflow-hidden">
          {post.coverImage ? (
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
        </div>
      </Link>
      <div className="p-5">
        <div className="flex items-center gap-2 mb-3">
          {category && (
            <Link
              to={`/category/${category.slug}`}
              className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full hover:bg-indigo-100 transition-colors"
            >
              {category.name}
            </Link>
          )}
          <span className="text-xs text-gray-400">
            {new Date(post.createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </span>
        </div>
        <Link to={`/post/${post.slug}`}>
          <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-2 mb-2">
            {post.title}
          </h3>
        </Link>
        <p className="text-sm text-gray-500 line-clamp-2 mb-4">{excerpt}</p>
        <div className="flex items-center justify-between">
          {author && (
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 bg-indigo-100 rounded-full flex items-center justify-center">
                <span className="text-xs font-semibold text-indigo-600">
                  {author.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <span className="text-sm text-gray-600">{author.name}</span>
            </div>
          )}
          <Link
            to={`/post/${post.slug}`}
            className="text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
          >
            Read more →
          </Link>
        </div>
      </div>
    </article>
  );
}

// ─── Featured Hero ──────────────────────────────────────────
export function FeaturedHero({ post }: { post: Post }) {
  const category = typeof post.categoryId === 'object' ? post.categoryId : null;

  return (
    <article className="relative rounded-2xl overflow-hidden bg-gray-900 group">
      <div className="absolute inset-0">
        {post.coverImage ? (
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-indigo-800 to-purple-900" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent" />
      </div>
      <div className="relative p-8 sm:p-12 md:p-16 min-h-[400px] flex flex-col justify-end">
        <div className="max-w-2xl">
          <div className="flex items-center gap-3 mb-4">
            {category && (
              <Link
                to={`/category/${category.slug}`}
                className="text-xs font-semibold text-white bg-indigo-600 px-3 py-1 rounded-full hover:bg-indigo-500 transition-colors"
              >
                {category.name}
              </Link>
            )}
            <span className="text-sm text-gray-300">
              {new Date(post.createdAt).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
          </div>
          <Link to={`/post/${post.slug}`}>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 group-hover:text-indigo-200 transition-colors">
              {post.title}
            </h2>
          </Link>
          <p className="text-gray-300 text-sm sm:text-base line-clamp-2 mb-6">
            {post.content.replace(/<[^>]*>/g, '').substring(0, 200)}...
          </p>
          <Link
            to={`/post/${post.slug}`}
            className="inline-flex items-center space-x-2 text-white font-medium hover:text-indigo-200 transition-colors"
          >
            <span>Read Article</span>
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </article>
  );
}

// ─── Trending Card ──────────────────────────────────────────
export function TrendingCard({ post, rank }: { post: Post; rank: number }) {
  const category = typeof post.categoryId === 'object' ? post.categoryId : null;

  return (
    <article className="group flex gap-4 items-start">
      <span className="text-3xl font-bold text-gray-200 group-hover:text-indigo-200 transition-colors shrink-0 w-10">
        {String(rank).padStart(2, '0')}
      </span>
      <div className="flex-1 min-w-0">
        {category && (
          <Link
            to={`/category/${category.slug}`}
            className="text-xs font-medium text-indigo-600 hover:text-indigo-700"
          >
            {category.name}
          </Link>
        )}
        <Link to={`/post/${post.slug}`}>
          <h3 className="text-sm font-bold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-2 mt-1">
            {post.title}
          </h3>
        </Link>
        <p className="text-xs text-gray-400 mt-1">
          {new Date(post.createdAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          })}
        </p>
      </div>
    </article>
  );
}

// ─── Category Badge ─────────────────────────────────────────
export function CategoryBadge({ category }: { category: Category }) {
  return (
    <Link
      to={`/category/${category.slug}`}
      className="inline-flex items-center space-x-2 px-4 py-2 bg-gray-50 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 transition-colors group"
    >
      <span className="font-medium text-sm text-gray-700 group-hover:text-indigo-600">
        {category.name}
      </span>
    </Link>
  );
}

// ─── Section Header ─────────────────────────────────────────
export function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-8">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">{title}</h2>
      {subtitle && <p className="text-gray-500 mt-2">{subtitle}</p>}
    </div>
  );
}
