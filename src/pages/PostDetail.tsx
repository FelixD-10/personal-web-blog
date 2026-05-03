import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { postsApi } from '../api/client';
import { PostCard, SectionHeader } from '../components/BlogComponents';
import { samplePosts } from '../data/sample';
import type { Post } from '../types';

export default function PostDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [related, setRelated] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setError('');

    postsApi.getBySlug(slug)
      .then((data) => {
        setPost(data);
        // Fetch related posts from same category
        const cat = typeof data.categoryId === 'object' ? data.categoryId : null;
        if (cat) {
          postsApi.getByCategory(cat.slug)
            .then((res) => setRelated(res.posts.filter((p) => p.slug !== slug).slice(0, 3)))
            .catch(() => {
              setRelated(samplePosts.filter((p) => p.slug !== slug).slice(0, 3));
            });
        }
      })
      .catch(() => {
        // Fallback to sample data
        const found = samplePosts.find((p) => p.slug === slug);
        if (found) {
          setPost(found);
          const cat = typeof found.categoryId === 'object' ? found.categoryId : null;
          if (cat) {
            setRelated(
              samplePosts.filter((p) => {
                const pCat = typeof p.categoryId === 'object' ? p.categoryId : null;
                return pCat?._id === cat._id && p.slug !== slug;
              }).slice(0, 3)
            );
          }
        } else {
          setError('Post not found');
        }
      })
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-3/4" />
          <div className="h-96 bg-gray-200 rounded-xl" />
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-4 bg-gray-200 rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">{error || 'Post not found'}</h1>
        <p className="text-gray-500 mb-6">The post you are looking for does not exist or has been removed.</p>
        <Link to="/" className="text-indigo-600 font-medium hover:text-indigo-700">
          ← Back to Home
        </Link>
      </div>
    );
  }

  const category = typeof post.categoryId === 'object' ? post.categoryId : null;
  const author = typeof post.authorId === 'object' && 'name' in post.authorId ? post.authorId : null;

  return (
    <article>
      {/* Cover Image */}
      <div className="relative h-64 sm:h-80 md:h-96 bg-gray-900">
        {post.coverImage ? (
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover opacity-80"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-indigo-800 to-purple-900" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 md:p-12">
          <div className="max-w-4xl mx-auto">
            {category && (
              <Link
                to={`/category/${category.slug}`}
                className="inline-block text-xs font-semibold text-white bg-indigo-600 px-3 py-1 rounded-full mb-4 hover:bg-indigo-500 transition-colors"
              >
                {category.name}
              </Link>
            )}
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
              {post.title}
            </h1>
          </div>
        </div>
      </div>

      {/* Meta */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 py-6 border-b border-gray-100">
          {author && (
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-semibold text-indigo-600">
                  {author.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{author.name}</p>
                <p className="text-xs text-gray-500">
                  {new Date(post.createdAt).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </p>
              </div>
            </div>
          )}
          <div className="ml-auto flex items-center gap-2">
            {post.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div
          className="prose prose-lg prose-gray max-w-none prose-headings:font-bold prose-headings:text-gray-900 prose-a:text-indigo-600 prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="mt-10 pt-6 border-t border-gray-100">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Link
                  key={tag}
                  to={`/search?q=${encodeURIComponent(tag)}`}
                  className="text-sm text-gray-600 bg-gray-100 px-3 py-1.5 rounded-full hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Related Posts */}
      {related.length > 0 && (
        <section className="bg-gray-50 py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeader title="Related Articles" />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {related.map((p) => (
                <PostCard key={p._id} post={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </article>
  );
}
