
import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { type Article } from '../types';

interface ArticleSidebarProps {
  articles: Article[];
  currentArticleId: number;
}

const ArticleSidebar: React.FC<ArticleSidebarProps> = ({ articles, currentArticleId }) => {

  const popularArticles = useMemo(() => {
    const twentyFourHoursAgo = new Date();
    twentyFourHoursAgo.setDate(twentyFourHoursAgo.getDate() - 1);
    
    return articles
      .filter(a => a.id !== currentArticleId && a.lastViewed && new Date(a.lastViewed) > twentyFourHoursAgo)
      .sort((a, b) => (b.views || 0) - (a.views || 0))
      .slice(0, 5);
  }, [articles, currentArticleId]);

  const trendingArticles = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return articles
      .filter(a => a.id !== currentArticleId && new Date(a.date) >= today)
      .sort((a, b) => (b.views || 0) - (a.views || 0))
      .slice(0, 5);
  }, [articles, currentArticleId]);

  return (
    <div className="sticky top-24 space-y-8">
      {/* Popular News Section */}
      {popularArticles.length > 0 && (
        <div className="bg-light-surface p-4 rounded-lg shadow-md border border-gray-200">
          <h3 className="text-xl font-bold text-text-primary mb-4 border-b-2 border-brand-blue pb-2">
            Popular News
          </h3>
          <ol className="space-y-4">
            {popularArticles.map((article, index) => (
              <li key={article.id} className="flex items-start gap-3">
                <span className="text-2xl font-bold text-brand-blue/50 leading-none mt-1">{index + 1}</span>
                <Link 
                  to={`/article/${article.slug}`} 
                  className="text-base font-semibold text-text-primary hover:text-brand-blue hover:underline transition-colors leading-tight"
                  dangerouslySetInnerHTML={{ __html: article.title.rendered }}
                />
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Trending Now Section */}
      {trendingArticles.length > 0 && (
        <div className="bg-light-surface p-4 rounded-lg shadow-md border border-gray-200">
          <h3 className="text-xl font-bold text-text-primary mb-4 border-b-2 border-brand-red pb-2">
            Trending Now
          </h3>
          <ol className="space-y-4">
            {trendingArticles.map((article, index) => (
              <li key={article.id} className="flex items-start gap-3">
                <span className="text-2xl font-bold text-brand-red/50 leading-none mt-1">{index + 1}</span>
                <Link 
                  to={`/article/${article.slug}`} 
                  className="text-base font-semibold text-text-primary hover:text-brand-red hover:underline transition-colors leading-tight"
                  dangerouslySetInnerHTML={{ __html: article.title.rendered }}
                />
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
};

export default ArticleSidebar;