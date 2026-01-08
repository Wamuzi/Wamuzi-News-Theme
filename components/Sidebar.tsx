
import React from 'react';
import { type Article, type Category } from '../types';
import HeadlineListItem from './HeadlineListItem';

interface SidebarProps {
  articles: Article[];
  categories: Category[];
}

const Sidebar: React.FC<SidebarProps> = ({ articles }) => {
  return (
    <div className="sticky top-24 space-y-8">
      {/* Trending Section */}
      {articles.length > 0 && (
        <div className="bg-light-surface p-4 rounded-lg shadow-md border border-gray-200">
          <h3 className="text-xl font-bold text-text-primary mb-4 border-b-2 border-brand-red pb-2">
            Trending
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

export default Sidebar;