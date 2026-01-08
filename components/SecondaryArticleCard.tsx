
import React from 'react';
import { Link } from 'react-router-dom';
import { type Article, type Category } from '../types';

interface SecondaryArticleCardProps {
  article: Article;
  categories: Category[];
}

const SecondaryArticleCard: React.FC<SecondaryArticleCardProps> = ({ article, categories }) => {
  const imageUrl = article._embedded?.['wp:featuredmedia']?.[0]?.source_url || `https://picsum.photos/seed/${article.id}/400/300`;
  const category = categories.find(c => c.id === article.categories[0]);

  return (
    <Link 
      to={`/article/${article.slug}`} 
      className="group flex flex-col bg-light-surface rounded-lg overflow-hidden shadow-md hover:shadow-xl border border-gray-200 transition-all duration-300 hover:-translate-y-1"
    >
      <div className="relative">
        <img className="w-full h-48 object-cover" src={imageUrl} alt={article.title.rendered} loading="lazy" />
      </div>
      <div className="p-4 flex flex-col flex-grow">
        {category && (
            <span className="text-xs font-bold text-brand-blue uppercase mb-2">
                {category.name}
            </span>
        )}
        <h3 
            className="text-lg font-bold text-text-primary group-hover:text-brand-blue transition-colors leading-tight mb-2"
            dangerouslySetInnerHTML={{ __html: article.title.rendered }}
        />
        <div 
            className="text-text-secondary text-sm line-clamp-3"
            dangerouslySetInnerHTML={{ __html: article.excerpt.rendered }}
        />
      </div>
    </Link>
  );
};

export default SecondaryArticleCard;