import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { postsApi } from '../api/client';
import { PostCard, SectionHeader } from '../components/BlogComponents';
import { samplePosts, sampleCategories } from '../data/sample';
import type { Post, Category } from '../types';

export default function CategoryPosts() {
  const { slug } = useParams<{ slug: string }>();
  const [category, setCategory] = useState<Category | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);

    postsApi.getByCategory(slug)
      .then((data) => {
        setCategory(data.category);
        setPosts(data.posts);
      })
      .catch(() => {
        const found = sampleCategories.find((c) => c.slug === slug);
        if (found) {
          setCategory(found);
          setPosts(
            samplePosts.filter((p) => {
              const cat = typeof p.categoryId === 'object' ? p.categoryId : null;
              return cat?.slug === slug;
            })
          );
        }
      })
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="animate-pulse space-y-8">
          <div className="h-10 bg-gray-200 rounded w-1/4" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 bg-gray-200 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb */}
      <nav className="mb-6">
        <ol className="flex items-center space-x-2 text-sm text-gray-500">
          <li>
            <Link to="/" className="hover:text-gray-700 transition-colors">Home</Link>
          </li>
          <li>/</li>
          <li className="text-gray-900 font-medium">{category?.name || slug}</li>
        </ol>
      </nav>

      <SectionHeader
        title={category?.name || slug || 'Category'}
        subtitle={posts.length > 0 ? `${posts.length} article${posts.length !== 1 ? 's' : ''} in this category` : 'No articles found'}
      />

      {posts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-gray-500 text-lg">No articles found in this category.</p>
          <Link to="/" className="text-indigo-600 font-medium hover:text-indigo-700 mt-4 inline-block">
            ← Back to Home
          </Link>
        </div>
      )}
    </div>
  );
}
