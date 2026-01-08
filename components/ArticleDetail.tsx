
import React, { useState, useEffect } from 'react';
import { type Article, type Category, type Tag } from '../types';
import { Link } from 'react-router-dom';
import ShareButtons from './ShareButtons';
import CommentSection from './CommentSection';
import { getArticle } from '../services/wordpressService';
import FullPageLoader from './FullPageLoader';
import AuthorSection from './AuthorSection';
import ArticleSidebar from './ArticleSidebar';
import ReadMoreLinks from './ReadMoreLinks';
import ArticleSummary from './ArticleSummary';

interface ArticleDetailProps {
  articleSlug: string;
  articles: Article[]; // For related articles & author articles
  categories: Category[];
  tags: Tag[];
}

const ArticleDetail: React.FC<ArticleDetailProps> = ({ articleSlug, articles, categories, tags }) => {
  const [article, setArticle] = useState<Article | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadArticle = async () => {
      // --- Performance Optimization ---
      // First, try to find the article in the pre-loaded list from the homepage.
      // This makes internal navigation feel instantaneous.
      const preloadedArticle = articles.find(a => a.slug === articleSlug);

      if (preloadedArticle) {
        // If found, display it immediately without a network request.
        setArticle(preloadedArticle);
        setIsLoading(false);
        setError(null);
      } else {
        // If not found (e.g., a direct link to an old article), then fetch from the network.
        setIsLoading(true);
        setError(null);
        try {
          const fetchedArticle = await getArticle(articleSlug);
          if (fetchedArticle) {
            setArticle(fetchedArticle);
          } else {
            setError("Article not found.");
          }
        } catch (err) {
          setError("Failed to load article.");
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadArticle();
  }, [articleSlug, articles]);

  const primaryCategoryId = article?.categories[0];
  const primaryCategory = categories.find(c => c.id === primaryCategoryId);
  const breakingNewsCategory = categories.find(c => c.slug === 'breaking-news');
  const isBreakingNews = breakingNewsCategory && article ? article.categories.includes(breakingNewsCategory.id) : false;
  
  const articleTags = article ? article.tags.map(tagId => tags.find(t => t.id === tagId)).filter(Boolean) as Tag[] : [];
  
  const formattedDate = article ? new Date(article.date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }) : '';
  
  const authorName = article?._embedded?.author?.[0]?.name || 'Wamuzi News Staff';
  const imageUrl = article?._embedded?.['wp:featuredmedia']?.[0]?.source_url || 'https://picsum.photos/1200/800';

  // Effect to update meta tags for SEO
  useEffect(() => {
    if (!article) return;

    // Helper to strip HTML for meta descriptions
    const cleanHtml = (htmlString: string) => {
        return htmlString.replace(/<[^>]*>?/gm, '').replace(/\[&hellip;\]/, '...').trim();
    };

    // Store original values to restore on unmount
    const originalTitle = document.title;
    const originalMetas: { selector: string; content: string | null }[] = [];
    document.querySelectorAll('meta[name], meta[property]').forEach(tag => {
        const selector = tag.getAttribute('name') ? `meta[name="${tag.getAttribute('name')}"]` : `meta[property="${tag.getAttribute('property')}"]`;
        originalMetas.push({ selector, content: tag.getAttribute('content') });
    });

    // Helper function to find and update a meta tag
    const setMeta = (selector: string, content: string) => {
        const element = document.querySelector<HTMLMetaElement>(selector);
        if (element) {
            element.setAttribute('content', content);
        }
    };
    
    const articleTitle = cleanHtml(article.title.rendered);
    const articleDescription = cleanHtml(article.excerpt.rendered);
    const articleKeywords = articleTags.map(t => t.name).join(', ');
    const articleImage = imageUrl;
    const articleUrl = window.location.href;

    // Update the DOM with article-specific info
    document.title = articleTitle;
    setMeta('meta[name="description"]', articleDescription);
    if(articleKeywords) setMeta('meta[name="keywords"]', articleKeywords);
    
    // Open Graph
    setMeta('meta[property="og:title"]', articleTitle);
    setMeta('meta[property="og:description"]', articleDescription);
    setMeta('meta[property="og:image"]', articleImage);
    setMeta('meta[property="og:url"]', articleUrl);
    setMeta('meta[property="og:type"]', 'article');
    
    // Twitter Card
    setMeta('meta[property="twitter:title"]', articleTitle);
    setMeta('meta[property="twitter:description"]', articleDescription);
    setMeta('meta[property="twitter:image"]', articleImage);
    setMeta('meta[property="twitter:url"]', articleUrl);

    // Cleanup function to restore original values
    return () => {
      document.title = originalTitle;
      originalMetas.forEach(meta => {
          if (meta.content) {
            setMeta(meta.selector, meta.content);
          }
      });
    };
  }, [article, articleTags, imageUrl]);


  if (isLoading) {
    return <FullPageLoader message="Loading article..." />;
  }

  if (error || !article) {
    return <div className="text-center p-8 text-xl text-brand-red">{error || "Could not load the article."}</div>;
  }
  
  // Find related articles for the bottom section
  const relatedArticles = articles
    .filter(a => a.categories.includes(primaryCategoryId) && a.id !== article.id)
    .slice(0, 3);

  // Find a different set of related articles for the "Read More" section
  const readMoreArticles = articles
    .filter(a => a.id !== article.id && !relatedArticles.some(ra => ra.id === a.id))
    .sort((a,b) => (b.views || 0) - (a.views || 0))
    .slice(0, 3);
    
  const currentUrl = window.location.href;

  // Split content to inject the "Read More" component
  const contentParts = article.content.rendered.split('</p>');
  const injectionPoint = 3; // Inject after the 3rd paragraph
  const firstHalf = contentParts.slice(0, injectionPoint).join('</p>') + (contentParts.length > injectionPoint ? '</p>' : '');
  const secondHalf = contentParts.slice(injectionPoint).join('</p>');

  return (
    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
      {/* Main Article Content */}
      <div className="lg:col-span-2">
        <div className="bg-light-surface p-6 sm:p-8 lg:p-12 rounded-lg shadow-lg border border-gray-200">
          <header className="mb-8 border-b border-gray-200 pb-6">
            {primaryCategory && !isBreakingNews && (
              <Link to={`/category/${primaryCategory.slug}`} className="text-brand-blue hover:underline font-semibold uppercase tracking-wider text-sm">
                {primaryCategory.name}
              </Link>
            )}
            <h1 
              className="text-4xl md:text-5xl font-extrabold text-text-primary mt-2"
              dangerouslySetInnerHTML={{ __html: article.title.rendered }}
             />
             {isBreakingNews && (
              <div className="mt-4">
                <span className="inline-block bg-brand-red text-white font-extrabold text-sm uppercase tracking-wider px-3 py-1.5 rounded-md animate-pulse">
                  Breaking News
                </span>
              </div>
             )}
            <p className="text-text-secondary mt-4">
              By {authorName} on <time dateTime={article.date}>{formattedDate}</time>
            </p>
            <ShareButtons title={article.title.rendered} url={currentUrl} />
          </header>

          <ArticleSummary articleId={article.id} articleContent={article.content.rendered} />
          
          <figure className="my-8">
            <img className="w-full h-auto object-cover rounded-lg shadow-md" src={imageUrl} alt={article.title.rendered} loading="lazy" />
          </figure>

          <article className="prose prose-lg max-w-none text-text-primary prose-headings:text-text-primary prose-a:text-brand-blue prose-strong:text-text-primary prose-p:text-justify prose-p:my-4">
            <div dangerouslySetInnerHTML={{ __html: firstHalf }} />
            
            {readMoreArticles.length > 0 && <ReadMoreLinks articles={readMoreArticles} />}

            <div dangerouslySetInnerHTML={{ __html: secondHalf }} />
          </article>

          {/* Tags Section */}
          {articleTags.length > 0 && (
            <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-3">Tags:</h3>
                <div className="flex flex-wrap gap-2">
                    {articleTags.map(tag => (
                        <Link key={tag.id} to={`#`} className="inline-block bg-gray-100 text-text-secondary text-sm font-medium px-3 py-1.5 rounded-full hover:bg-gray-200 hover:text-text-primary transition-colors">
                            #{tag.name}
                        </Link>
                    ))}
                </div>
            </div>
          )}
        </div>

        {relatedArticles.length > 0 && (
          <section className="mt-12" aria-labelledby="related-stories-heading">
            <h2 id="related-stories-heading" className="text-2xl font-bold text-text-primary mb-4 border-b-2 border-brand-blue pb-2">Related Stories</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedArticles.map(related => (
                <Link key={related.id} to={`/article/${related.slug}`} className="group block bg-light-surface rounded-lg overflow-hidden shadow-md hover:shadow-xl border border-gray-200 transition-all duration-300 hover:-translate-y-1">
                  <img className="w-full h-36 object-cover" src={related._embedded?.['wp:featuredmedia']?.[0]?.source_url} alt={related.title.rendered} loading="lazy" />
                  <div className="p-4">
                    <h3 
                      className="text-md font-bold text-text-primary group-hover:text-brand-blue transition-colors leading-tight"
                      dangerouslySetInnerHTML={{ __html: related.title.rendered }}
                    />
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        <AuthorSection 
          authorName={authorName} 
          allArticles={articles} 
          currentArticleId={article.id} 
        />

        <CommentSection articleId={article.id} />
      </div>

      {/* Sidebar */}
      <aside className="lg:col-span-1">
        <ArticleSidebar articles={articles} currentArticleId={article.id} />
      </aside>
    </div>
  );
};

export default ArticleDetail;
