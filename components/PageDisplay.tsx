
import React, { useState, useEffect } from 'react';
import { getPage } from '../services/wordpressService';
import { type Page } from '../types';
import FullPageLoader from './FullPageLoader';

interface PageDisplayProps {
  pageSlug: string;
}

const PageDisplay: React.FC<PageDisplayProps> = ({ pageSlug }) => {
  const [page, setPage] = useState<Page | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPage = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const fetchedPage = await getPage(pageSlug);
        if (fetchedPage) {
          setPage(fetchedPage);
        } else {
          setError(`The page with slug "${pageSlug}" was not found. Please ensure it has been created in your WordPress dashboard.`);
        }
      } catch (err) {
        setError("Failed to load page content.");
      } finally {
        setIsLoading(false);
      }
    };
    loadPage();
  }, [pageSlug]);

  if (isLoading) {
    return <FullPageLoader message={`Loading page...`} />;
  }

  if (error || !page) {
    return <div className="text-center p-8 text-xl text-brand-red bg-red-50 rounded-lg">{error || "Could not load the page."}</div>;
  }

  return (
    <div className="bg-light-surface p-6 sm:p-8 lg:p-12 rounded-lg shadow-lg border border-gray-200">
      <header className="mb-8 border-b border-gray-200 pb-6">
        <h1 
          className="text-4xl md:text-5xl font-extrabold text-text-primary"
          dangerouslySetInnerHTML={{ __html: page.title.rendered }}
         />
      </header>
      <article 
        className="prose prose-lg max-w-none text-text-primary prose-headings:text-text-primary prose-a:text-brand-blue prose-strong:text-text-primary"
        dangerouslySetInnerHTML={{ __html: page.content.rendered }} 
      />
    </div>
  );
};

export default PageDisplay;
