
import React from 'react';
import { Link } from 'react-router-dom';
import { type Article, type Category } from '../types';
import ArticleCard from './ArticleCard';
import HeadlineListItem from './HeadlineListItem';

interface CategoryNewsBlockProps {
  category: Category;
  articles: Article[];
}

const CategoryNewsBlock: React.FC<CategoryNewsBlockProps> = ({ category, articles }) => {
  if (articles.length === 0) {
    return null;
  }

  const mainArticle = articles[0];
  const otherArticles = articles.slice(1, 5); // Show up to 4 other articles

  return (
    <section aria-labelledby={`category-title-${category.slug}`}>
      <div className="flex justify-between items-center mb-4 border-b-2 border-brand-blue pb-2">
        <h2 id={`category-title-${category.slug}`} className="text-2xl font-bold text-text-primary">
          {category.name}
        </h2>
        <Link to={`/category/${category.slug}`} className="text-sm font-semibold text-brand-blue hover:underline">
          View all &rarr;
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mainArticle && (
            <div className="md:col-span-1">
                <ArticleCard article={mainArticle} categoryName={category.name} />
            </div>
        )}
        {otherArticles.length > 0 && (
            <div className="space-y-4 md:col-span-1">
                {otherArticles.map(article => (
                    <HeadlineListItem key={article.id} article={article} />
                ))}
            </div>
        )}
      </div>
    </section>
  );
};

export default CategoryNewsBlock;
