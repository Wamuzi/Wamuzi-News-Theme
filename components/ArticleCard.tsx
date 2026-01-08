
import React from 'react';
import { type Article } from '../types';
import { Link } from 'react-router-dom';

interface ArticleCardProps {
  article: Article;
  categoryName: string;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article, categoryName }) => {
  const imageUrl = article._embedded?.['wp:featuredmedia']?.[0]?.source_url || `https://picsum.photos/seed/${article.id}/400/300`;

  return (
    <Link 
      to={`/article/${article.slug}`} 
      className="group flex flex-col bg-light-surface rounded-lg overflow-hidden shadow-md hover:shadow-xl border border-gray-200 transition-all duration-300 hover:-translate-y-1"
    >
      <div className="relative">
        <img className="w-full h-48 object-cover" src={imageUrl} alt={article.title.rendered} loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
         <span className="absolute top-3 left-3 inline-block bg-brand-blue text-white text-xs font-semibold px-2 py-1 rounded-full uppercase">
          {categoryName}
        </span>
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 
            className="text-lg font-bold text-text-primary group-hover:text-brand-blue transition-colors leading-tight mb-2 h-14 overflow-hidden"
            dangerouslySetInnerHTML={{ __html: article.title.rendered }}
        />
        <div 
            className="text-text-secondary text-sm h-20 overflow-hidden mb-2"
            dangerouslySetInnerHTML={{ __html: article.excerpt.rendered }}
        />
        <div className="mt-auto">
          <span className="text-sm font-bold text-brand-blue group-hover:underline">
            Read More...
          </span>
        </div>
      </div>
    </Link>
  );
};

export default ArticleCard;