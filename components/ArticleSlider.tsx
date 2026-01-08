
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { type Article, type Category } from '../types';

interface ArticleSliderProps {
  articles: Article[];
  categories: Category[];
}

const ArticleSlider: React.FC<ArticleSliderProps> = ({ articles, categories }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex === articles.length - 1 ? 0 : prevIndex + 1));
  }, [articles.length]);

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? articles.length - 1 : prevIndex - 1));
  };
  
  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  useEffect(() => {
    if (articles.length > 1) {
      const slideInterval = setInterval(nextSlide, 5000); // Change slide every 5 seconds
      return () => clearInterval(slideInterval);
    }
  }, [nextSlide, articles.length]);
  
  if (!articles || articles.length === 0) {
    return null;
  }

  return (
    <div className="relative w-full aspect-video rounded-lg overflow-hidden shadow-lg border border-gray-200">
      {/* Slides */}
      <div className="w-full h-full relative">
        {articles.map((article, index) => (
           <div key={article.id} className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentIndex ? 'opacity-100 z-10' : 'opacity-0'}`}>
              <Link to={`/article/${article.slug}`} className="block w-full h-full">
                <img 
                    src={article._embedded?.['wp:featuredmedia']?.[0]?.source_url || `https://picsum.photos/seed/${article.id}/800/500`} 
                    alt={article.title.rendered} 
                    className="w-full h-full object-cover" 
                    loading={index === 0 ? "eager" : "lazy"}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-6 text-white">
                   {categories.find(c => c.id === article.categories[0]) && (
                     <span className="inline-block bg-brand-red text-white text-xs font-semibold px-2 py-1 rounded-md uppercase mb-2">
                       {categories.find(c => c.id === article.categories[0])?.name}
                     </span>
                   )}
                  <h2 className="text-2xl md:text-3xl font-extrabold leading-tight" dangerouslySetInnerHTML={{ __html: article.title.rendered }} />
                </div>
              </Link>
           </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      {articles.length > 1 && (
        <>
          <button onClick={prevSlide} aria-label="Previous slide" className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-black/40 text-white p-2 rounded-full hover:bg-black/60 transition-colors z-20">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <button onClick={nextSlide} aria-label="Next slide" className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-black/40 text-white p-2 rounded-full hover:bg-black/60 transition-colors z-20">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>

          {/* Dots */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
            {articles.map((_, index) => (
              <button key={index} onClick={() => goToSlide(index)} aria-label={`Go to slide ${index + 1}`} className={`w-3 h-3 rounded-full transition-colors ${currentIndex === index ? 'bg-white' : 'bg-white/50 hover:bg-white/75'}`}></button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ArticleSlider;