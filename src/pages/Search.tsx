import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { postsApi } from '../api/client';
import { PostCard, SectionHeader } from '../components/BlogComponents';
import { samplePosts } from '../data/sample';
import type { Post } from '../types';

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [inputValue, setInputValue] = useState(query);
  const [results, setResults] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (!query) {
      setResults([]);
      setSearched(false);
      return;
    }

    setLoading(true);
    setSearched(true);
    setInputValue(query);

    postsApi.search(query)
      .then((data) => {
        setResults(data);
      })
      .catch(() => {
        const q = query.toLowerCase();
        const filtered = samplePosts.filter(
          (p) =>
            p.title.toLowerCase().includes(q) ||
            p.tags.some((t) => t.toLowerCase().includes(q)) ||
            p.content.toLowerCase().includes(q)
        );
        setResults(filtered);
      })
      .finally(() => setLoading(false));
  }, [query]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      setSearchParams({ q: inputValue.trim() });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Search Header */}
      <div className="max-w-2xl mx-auto text-center mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">Search Articles</h1>
        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Search by title, tag, or keyword..."
            className="w-full px-5 py-4 pr-14 text-gray-900 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-lg placeholder-gray-400"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 p-3 text-gray-500 hover:text-indigo-600 transition-colors"
            aria-label="Search"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </form>

        {/* Popular tags */}
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {['javascript', 'design', 'nodejs', 'startup', 'productivity'].map((tag) => (
            <button
              key={tag}
              onClick={() => { setInputValue(tag); setSearchParams({ q: tag }); }}
              className="text-xs text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
            >
              #{tag}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <div className="animate-pulse grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 bg-gray-200 rounded-xl" />
          ))}
        </div>
      ) : searched ? (
        <>
          <SectionHeader
            title={results.length > 0 ? `Results for "${query}"` : 'No results found'}
            subtitle={
              results.length > 0
                ? `Found ${results.length} article${results.length !== 1 ? 's' : ''}`
                : 'Try different keywords or browse categories'
            }
          />
          {results.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Link to="/" className="text-indigo-600 font-medium hover:text-indigo-700">
                ← Back to Home
              </Link>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">Enter a search term to find articles</p>
        </div>
      )}
    </div>
  );
}
