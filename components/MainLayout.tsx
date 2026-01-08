
import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { type Article, type Category } from '../types';

interface MainLayoutProps {
  articles: Article[];
  categories: Category[];
  breakingNews: Article | null;
  error: string | null;
}

const MainLayout: React.FC<MainLayoutProps> = ({ articles, categories, breakingNews, error }) => {
  return (
    <div className="min-h-screen flex flex-col bg-light-bg">
      <Header articles={articles} categories={categories} breakingNews={breakingNews} />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md relative mb-6" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
