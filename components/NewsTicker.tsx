
import React from 'react';
import { Link } from 'react-router-dom';
import { Article } from '../types';

interface NewsTickerProps {
  articles: Article[];
}

const NewsTicker: React.FC<NewsTickerProps> = ({ articles }) => {
  // Use the most recent 10 articles for the ticker
  const tickerArticles = articles.slice(0, 10);

  if (tickerArticles.length === 0) {
    return null;
  }

  return (
    <div className="bg-gray-100 border-b border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center h-10">
        <span className="bg-brand-red text-white text-xs font-bold px-3 py-1.5 rounded-sm flex-shrink-0 mr-4">
          LATEST NEWS
        </span>
        <div className="overflow-hidden flex-grow h-full relative">
          <div className="absolute inset-0 flex items-center whitespace-nowrap animate-scroll">
            {/* Render list twice for a seamless loop */}
            {[...tickerArticles, ...tickerArticles].map((article, index) => (
              <React.Fragment key={`${article.id}-${index}`}>
                <Link
                  to={`/article/${article.slug}`}
                  className="text-sm text-text-secondary hover:text-brand-blue hover:underline px-6"
                  dangerouslySetInnerHTML={{ __html: article.title.rendered }}
                />
                <span className="text-gray-300">&#9679;</span>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsTicker;
