
import React from 'react';
import { Link } from 'react-router-dom';
import { type Article, type Category } from '../types';

interface MainFeaturedCardProps {
  article: Article;
  categories: Category[];
}

const MainFeaturedCard: React.FC<MainFeaturedCardProps> = ({ article, categories }) => {
  const imageUrl = article._embedded?.['wp:featuredmedia']?.[0]?.source_url || `https://picsum.photos/seed/${article.id}/800/600`;
  const category = categories.find(c => c.id === article.categories[0]);

  return (
    <section aria-labelledby={`article-title-${article.id}`}>
      <Link 
        to={`/article/${article.slug}`} 
        className="group block bg-light-surface rounded-lg overflow-hidden shadow-md hover:shadow-xl border border-gray-200 transition-shadow duration-300"
      >
        <div className="relative">
          <img className="w-full h-64 sm:h-80 object-cover" src={imageUrl} alt={article.title.rendered} loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          <div className="absolute bottom-0 left-0 p-6">
            {category && (
              <span className="inline-block bg-brand-blue text-white text-xs font-semibold px-2 py-1 rounded-md uppercase">
                {category.name}
              </span>
            )}
            <h2 
              id={`article-title-${article.id}`}
              className="text-2xl sm:text-3xl font-extrabold text-white mt-2 group-hover:underline leading-tight"
              dangerouslySetInnerHTML={{ __html: article.title.rendered }}
            />
          </div>
        </div>
        <div className="p-6 bg-light-surface">
           <div 
            className="text-text-secondary text-base"
            dangerouslySetInnerHTML={{ __html: article.excerpt.rendered }}
          />
        </div>
      </Link>
    </section>
  );
};

export default MainFeaturedCard;