
import React from 'react';
import { Link } from 'react-router-dom';
import { type Article } from '../types';

interface AuthorSectionProps {
  authorName: string;
  allArticles: Article[];
  currentArticleId: number;
}

const AuthorSection: React.FC<AuthorSectionProps> = ({ authorName, allArticles, currentArticleId }) => {
  // Find other articles by the same author
  const articlesByAuthor = allArticles
    .filter(article => 
      article._embedded?.author?.[0]?.name === authorName && article.id !== currentArticleId
    )
    .slice(0, 3); // Limit to 3 articles

  return (
    <section className="mt-12" aria-labelledby="author-heading">
      <div className="bg-light-surface p-6 sm:p-8 rounded-lg shadow-lg border border-gray-200">
        <h2 id="author-heading" className="text-2xl font-bold text-text-primary mb-6 border-b-2 border-brand-blue pb-2">
          About the Author
        </h2>
        <div className="flex flex-col sm:flex-row items-start gap-6">
          <div className="flex-shrink-0">
            {/* Placeholder for author avatar */}
            <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          <div className="flex-grow">
            <h3 className="text-xl font-bold text-text-primary">{authorName}</h3>
            {/* Placeholder for author bio */}
            <p className="mt-2 text-text-secondary">
              Staff writer at Wamuzi News KE, covering a wide range of topics from politics to technology. Further author details can be fetched from the WordPress user profile in a full implementation.
            </p>
            {articlesByAuthor.length > 0 && (
              <div className="mt-4">
                <h4 className="font-semibold text-text-primary">More from {authorName}:</h4>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  {articlesByAuthor.map(article => (
                    <li key={article.id}>
                      <Link 
                        to={`/article/${article.slug}`} 
                        className="text-brand-blue hover:underline"
                        dangerouslySetInnerHTML={{ __html: article.title.rendered }}
                      />
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AuthorSection;
