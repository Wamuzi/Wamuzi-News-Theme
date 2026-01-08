
import React from 'react';
import { type Article, type Category } from '../types';
import ArticleCard from './ArticleCard';

interface SearchPageProps {
  query: string;
  results: Article[];
  allCategories: Category[];
}

const SearchPage: React.FC<SearchPageProps> = ({ query, results, allCategories }) => {

  const getCategoryName = (categoryId: number) => {
    return allCategories.find(c => c.id === categoryId)?.name || 'Uncategorized';
  };

  return (
    <div>
      <div className="mb-8 border-b-2 border-brand-blue pb-4">
        <h1 className="text-3xl font-extrabold text-text-primary">
          Search Results for: <span className="text-brand-blue">"{query}"</span>
        </h1>
        <p className="text-text-secondary mt-1">{results.length} article(s) found.</p>
      </div>
      {results.length > 0 ? (
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {results.map(article => (
            <ArticleCard key={article.id} article={article} categoryName={getCategoryName(article.categories[0])}/>
          ))}
        </div>
      ) : (
        <div className="text-center p-12 bg-light-surface rounded-lg border border-gray-200 mt-8">
          <h2 className="text-2xl font-bold text-text-primary">No Articles Found</h2>
          <p className="text-text-secondary mt-2">
            Sorry, we couldn't find any articles matching your search. Please try different keywords.
          </p>
        </div>
      )}
    </div>
  );
};

export default SearchPage;
