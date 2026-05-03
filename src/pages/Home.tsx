import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { postsApi, categoriesApi } from '../api/client';
import { FeaturedHero, PostCard, TrendingCard, CategoryBadge, SectionHeader } from '../components/BlogComponents';
import { samplePosts, sampleCategories } from '../data/sample';
import type { Post, Category } from '../types';

export default function Home() {
  const [posts, setPosts] = useState<Post[]>(samplePosts);
  const [categories, setCategories] = useState<Category[]>(sampleCategories);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      postsApi.getPublished({ limit: 10 }).catch(() => ({ posts: samplePosts })),
      categoriesApi.getAll().catch(() => sampleCategories),
    ]).then(([postsData, catsData]) => {
      if (postsData.posts && postsData.posts.length > 0) setPosts(postsData.posts);
      if (Array.isArray(catsData) && catsData.length > 0) setCategories(catsData);
    }).finally(() => setLoading(false));
  }, []);

  const featured = posts[0];
  const trending = posts.slice(1, 5);
  const recent = posts.slice(1);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="animate-pulse space-y-8">
          <div className="h-96 bg-gray-200 rounded-2xl" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 bg-gray-200 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4">
        {featured && <FeaturedHero post={featured} />}
      </section>

      {/* Trending + Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Trending */}
          <div className="lg:col-span-2">
            <SectionHeader title="Trending" subtitle="Most popular articles this week" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {trending.map((post, i) => (
                <TrendingCard key={post._id} post={post} rank={i + 1} />
              ))}
            </div>
          </div>

          {/* Categories Sidebar */}
          <div>
            <SectionHeader title="Categories" />
            <div className="space-y-3">
              {categories.map((cat) => (
                <CategoryBadge key={cat._id} category={cat} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Recent Posts */}
      <section className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader title="Recent Articles" subtitle="Stay up to date with the latest content" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recent.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-indigo-600 rounded-2xl p-8 sm:p-12 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Want to contribute?
          </h2>
          <p className="text-indigo-100 mb-8 max-w-lg mx-auto">
            We are always looking for talented writers and developers to share their knowledge with our community.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center px-6 py-3 bg-white text-indigo-600 font-semibold rounded-lg hover:bg-indigo-50 transition-colors"
          >
            Get in Touch
          </Link>
        </div>
      </section>
    </div>
  );
}
