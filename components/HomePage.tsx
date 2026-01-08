
import React from 'react';
import { type Article, type Category } from '../types';
import ArticleSlider from './ArticleSlider';
import SecondaryArticleCard from './SecondaryArticleCard';
import Sidebar from './Sidebar';
import CategoryNewsBlock from './CategoryNewsBlock';
import LeftSidebar from './LeftSidebar';
import { useSettings } from '../context/SettingsContext';

interface HomePageProps {
  articles: Article[];
  categories: Category[];
}

const HomePage: React.FC<HomePageProps> = ({ articles, categories }) => {
  const { settings } = useSettings();

  if (articles.length === 0) {
    return (
       <div className="text-center p-12 bg-light-surface rounded-lg border border-gray-200">
          <h2 className="text-2xl font-bold text-text-primary">No Articles Available</h2>
          <p className="text-text-secondary mt-2">Content is managed via WordPress. Please add new posts to see them here.</p>
        </div>
    );
  }

  // Slicing articles for different layout sections based on theme settings
  const { sliderArticlesCount, latestArticlesCount, trendingArticlesCount } = settings.homepage;

  const sliderArticles = articles.slice(0, sliderArticlesCount);
  const secondaryFeatured = articles.slice(sliderArticlesCount, sliderArticlesCount + 2);
  const leftSidebarArticles = articles.slice(sliderArticlesCount + 2, sliderArticlesCount + 2 + latestArticlesCount);
  const rightSidebarArticles = articles.slice(sliderArticlesCount + 2 + latestArticlesCount, sliderArticlesCount + 2 + latestArticlesCount + trendingArticlesCount);

  // Group remaining articles by category for the news blocks
  const remainingArticles = articles.slice(sliderArticlesCount + 2);
  const articlesByCategory = categories.map(category => ({
    ...category,
    articles: remainingArticles.filter(a => a.categories.includes(category.id)),
  })).filter(category => category.articles.length > 0 && category.slug !== 'breaking-news');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Left Sidebar Column */}
      <aside className="hidden lg:block lg:col-span-1">
        <LeftSidebar categories={categories} articles={leftSidebarArticles} />
      </aside>

      {/* Main Content Column */}
      <div className="lg:col-span-2 space-y-8">
        {sliderArticles.length > 0 && (
          <ArticleSlider articles={sliderArticles} categories={categories} />
        )}
        
        {secondaryFeatured.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {secondaryFeatured.map(article => (
              <SecondaryArticleCard key={article.id} article={article} categories={categories} />
            ))}
          </div>
        )}

        {/* Category Blocks */}
        {articlesByCategory.map(categoryData => (
          <CategoryNewsBlock 
            key={categoryData.id}
            category={categoryData}
            articles={categoryData.articles}
          />
        ))}

      </div>

      {/* Right Sidebar Column */}
      <aside className="lg:col-span-1">
        <Sidebar articles={rightSidebarArticles} categories={categories} />
      </aside>
    </div>
  );
};

export default HomePage;
