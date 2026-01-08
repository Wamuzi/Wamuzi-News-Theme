
import React, { useState, useCallback, useEffect } from 'react';
import { HashRouter, Routes, Route, useParams, useSearchParams, useLocation, Outlet } from 'react-router-dom';
import MainLayout from './components/MainLayout';
import HomePage from './components/HomePage';
import ArticleDetail from './components/ArticleDetail';
import CategoryPage from './components/CategoryPage';
import SearchPage from './components/SearchPage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import ProfilePage from './components/ProfilePage';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import AdminSidebar from './components/admin/AdminSidebar';
import AdminGeneral from './components/admin/sections/AdminGeneral';
import AdminHeader from './components/admin/sections/AdminHeader';
import AdminFooter from './components/admin/sections/AdminFooter';
import AdminUserManagement from './components/admin/sections/AdminUserManagement';
import AdminHomepage from './components/admin/sections/AdminHomepage';
import AdminStyling from './components/admin/sections/AdminStyling';
import { type Article, type Category, type Tag } from './types';
import { getArticles, getCategories, getTags } from './services/wordpressService';
import FullPageLoader from './components/FullPageLoader';
import { AuthProvider } from './context/AuthContext';
import { SettingsProvider } from './context/SettingsContext';
import CustomStyles from './components/CustomStyles';
import PageDisplay from './components/PageDisplay';

// Utility component to scroll to top on route change
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};


const App: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const [fetchedArticles, fetchedCategories, fetchedTags] = await Promise.all([
          getArticles(),
          getCategories(),
          getTags(),
        ]);
        setArticles(fetchedArticles);
        setCategories(fetchedCategories);
        setTags(fetchedTags);
      } catch (err) {
        setError('Failed to load content from WordPress. Please ensure your site is online and the REST API is accessible.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  // Find the breaking news category and its articles
  const breakingNewsCategory = categories.find(c => c.slug === 'breaking-news');
  const breakingNewsArticles = breakingNewsCategory 
    ? articles.filter(a => a.categories.includes(breakingNewsCategory.id)).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    : [];

  // Wrap ArticleDetail to use hooks
  const ArticleDetailPage: React.FC = () => {
    const { articleSlug } = useParams<{ articleSlug: string }>();
    return articleSlug ? <ArticleDetail articleSlug={articleSlug} articles={articles} categories={categories} tags={tags} /> : <div className="text-center p-8">Article not found.</div>;
  };

  // Wrap CategoryPage to use hooks
  const CategoryResultsPage: React.FC = () => {
    const { categorySlug } = useParams<{ categorySlug: string }>();
    const category = categories.find(c => c.slug === categorySlug);
    const categoryArticles = category ? articles.filter(a => a.categories.includes(category.id)) : [];
    return category ? <CategoryPage category={category} articles={categoryArticles} /> : <div className="text-center p-8">Category not found.</div>;
  };

  // Wrap SearchPage to use hooks
  const SearchResultsPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q') || '';
    const lowercasedQuery = query.toLowerCase();
    const searchResults = articles.filter(article =>
      article.title.rendered.toLowerCase().includes(lowercasedQuery) ||
      article.excerpt.rendered.toLowerCase().includes(lowercasedQuery) ||
      article.content.rendered.toLowerCase().includes(lowercasedQuery)
    );
    return <SearchPage query={query} results={searchResults} allCategories={categories} />;
  };
  
  if (isLoading) {
    return <FullPageLoader message="Connecting to your WordPress site..." />;
  }

  return (
    <AuthProvider>
      <SettingsProvider>
        <HashRouter>
          <CustomStyles />
          <ScrollToTop />
          <Routes>
            {/* Main Site Layout */}
            <Route element={
              <MainLayout 
                articles={articles} 
                categories={categories} 
                breakingNews={breakingNewsArticles.length > 0 ? breakingNewsArticles[0] : null}
                error={error}
              />
            }>
              <Route path="/" element={<HomePage articles={articles} categories={categories} />} />
              <Route path="/article/:articleSlug" element={<ArticleDetailPage />} />
              <Route path="/category/:categorySlug" element={<CategoryResultsPage />} />
              <Route path="/search" element={<SearchResultsPage />} />
              <Route path="/about-us" element={<PageDisplay pageSlug="about-us" />} />
              <Route path="/contact-us" element={<PageDisplay pageSlug="contact-us" />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              } />
            </Route>
            
            {/* Admin Panel Layout */}
            <Route path="/admin" element={
              <AdminRoute>
                <div className="min-h-screen bg-gray-100 flex">
                  <AdminSidebar />
                  <main className="flex-1 p-6 sm:p-8 lg:p-10">
                    <div className="max-w-7xl mx-auto">
                      <Outlet />
                    </div>
                  </main>
                </div>
              </AdminRoute>
            }>
              <Route index element={<AdminGeneral />} />
              <Route path="general" element={<AdminGeneral />} />
              <Route path="header" element={<AdminHeader />} />
              <Route path="footer" element={<AdminFooter />} />
              <Route path="homepage" element={<AdminHomepage />} />
              <Route path="styling" element={<AdminStyling />} />
              <Route path="users" element={<AdminUserManagement />} />
            </Route>

          </Routes>
        </HashRouter>
      </SettingsProvider>
    </AuthProvider>
  );
};

export default App;
