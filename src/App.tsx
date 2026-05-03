import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import Home from './pages/Home';
import PostDetail from './pages/PostDetail';
import CategoryPosts from './pages/CategoryPosts';
import Search from './pages/Search';
import About from './pages/About';
import Contact from './pages/Contact';
import AdminLogin from './pages/admin/Login';
import AdminDashboard from './pages/admin/Dashboard';

export default function App() {
  return (
    <Routes>
      {/* Admin routes (no main layout) */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<AdminDashboard />} />

      {/* Public routes with layout */}
      <Route path="/" element={<Layout><Home /></Layout>} />
      <Route path="/post/:slug" element={<Layout><PostDetail /></Layout>} />
      <Route path="/category/:slug" element={<Layout><CategoryPosts /></Layout>} />
      <Route path="/search" element={<Layout><Search /></Layout>} />
      <Route path="/about" element={<Layout><About /></Layout>} />
      <Route path="/contact" element={<Layout><Contact /></Layout>} />

      {/* 404 fallback */}
      <Route path="*" element={
        <Layout>
          <div className="max-w-4xl mx-auto px-4 py-24 text-center">
            <h1 className="text-6xl font-bold text-gray-200 mb-4">404</h1>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Page Not Found</h2>
            <p className="text-gray-500 mb-8">The page you are looking for does not exist or has been moved.</p>
            <a href="/" className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors">
              Go Home
            </a>
          </div>
        </Layout>
      } />
    </Routes>
  );
}
