
import React from 'react';
import { NavLink } from 'react-router-dom';
import { type Article, type Category } from '../types';
import HeadlineListItem from './HeadlineListItem';

interface LeftSidebarProps {
  categories: Category[];
  articles: Article[];
}

const LeftSidebar: React.FC<LeftSidebarProps> = ({ categories, articles }) => {
  return (
    <div className="sticky top-24 space-y-8">
      {/* Categories Section */}
      <div className="bg-light-surface p-4 rounded-lg shadow-md border border-gray-200">
        <h3 className="text-xl font-bold text-text-primary mb-4 border-b-2 border-brand-blue pb-2">
          Categories
        </h3>
        <nav className="space-y-1">
          {categories.map(category => (
            <NavLink
              key={category.id}
              to={`/category/${category.slug}`}
              className={({ isActive }) => 
                `block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive 
                    ? 'bg-brand-blue text-white' 
                    : 'text-text-secondary hover:bg-gray-100 hover:text-brand-blue'
                }`
              }
            >
              {category.name}
            </NavLink>
          ))}
        </nav>
      </div>
      
      {/* Latest Posts Section */}
      {articles.length > 0 && (
        <div className="bg-light-surface p-4 rounded-lg shadow-md border border-gray-200">
          <h3 className="text-xl font-bold text-text-primary mb-4 border-b-2 border-brand-red pb-2">
            Latest
          </h3>
          <div className="space-y-2">
            {articles.map(article => (
              <HeadlineListItem key={article.id} article={article} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LeftSidebar;
