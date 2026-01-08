
import React, { useState, useEffect } from 'react';
import { type Article, type Category } from '../types';
import ArticleCard from './ArticleCard';
import Pagination from './Pagination';

interface CategoryPageProps {
  category: Category;
  articles: Article[];
}

const ARTICLES_PER_PAGE = 12;

const CategoryPage: React.FC<CategoryPageProps> = ({ category, articles }) => {
  const [currentPage, setCurrentPage] = useState(1);

  // Reset to page 1 when category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [category]);
  
  if (!category) {
    return <div className="text-center p-8 text-xl">Category not found.</div>;
  }

  // Pagination logic
  const totalPages = Math.ceil(articles.length / ARTICLES_PER_PAGE);
  const paginatedArticles = articles.slice(
    (currentPage - 1) * ARTICLES_PER_PAGE,
    currentPage * ARTICLES_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0); // Scroll to top on page change
  };


  return (
    <div>
      <div className="mb-8 border-b-2 border-brand-blue pb-4">
        <h1 className="text-4xl font-extrabold text-text-primary">
          Category: <span className="text-brand-blue">{category.name}</span>
        </h1>
        <p className="text-text-secondary mt-1">{category.count} article(s) in this category.</p>
      </div>
      {articles.length > 0 ? (
        <>
          <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {paginatedArticles.map(article => (
              <ArticleCard key={article.id} article={article} categoryName={category.name} />
            ))}
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      ) : (
        <div className="text-center p-12 bg-light-surface rounded-lg border border-gray-200">
          <h2 className="text-2xl font-bold text-text-primary">No Articles Found</h2>
          <p className="text-text-secondary mt-2">There are no articles in this category yet. Post one from your WordPress dashboard!</p>
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
