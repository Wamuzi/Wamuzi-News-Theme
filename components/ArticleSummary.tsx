import React, { useState, useEffect } from 'react';
import { generateArticleSummary, convertMarkdownToHtml } from '../services/geminiService';

interface ArticleSummaryProps {
    articleContent: string;
    articleId: number;
}

const ArticleSummary: React.FC<ArticleSummaryProps> = ({ articleContent, articleId }) => {
    const [summary, setSummary] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const sessionKey = `summary_${articleId}`;

    useEffect(() => {
        const cachedSummary = sessionStorage.getItem(sessionKey);
        if (cachedSummary) {
            setSummary(cachedSummary);
        }
    }, [sessionKey]);

    const handleGenerateSummary = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const generatedSummary = await generateArticleSummary(articleContent);
            const htmlSummary = convertMarkdownToHtml(generatedSummary);
            setSummary(htmlSummary);
            sessionStorage.setItem(sessionKey, htmlSummary);
        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    if (summary) {
        return (
            <div className="my-8 p-6 bg-blue-50 border-l-4 border-brand-blue rounded-r-lg">
                <h3 className="text-lg font-bold text-text-primary mb-3">Key Takeaways</h3>
                <div
                    className="prose prose-sm max-w-none text-text-secondary prose-ul:list-disc prose-ul:pl-5 prose-li:my-1"
                    dangerouslySetInnerHTML={{ __html: summary }}
                />
            </div>
        );
    }
    
    if (isLoading) {
        return (
            <div className="my-8 flex items-center justify-center p-6 bg-gray-100 rounded-lg">
                <svg className="animate-spin h-6 w-6 text-brand-blue" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="ml-3 text-text-secondary font-semibold">Generating summary...</span>
            </div>
        );
    }
    
    if (error) {
         return (
            <div className="my-8 p-4 bg-red-50 text-red-700 border border-red-200 rounded-md text-sm">
                <strong>AI Summary Error:</strong> {error}
            </div>
        );
    }

    return (
        <div className="my-8">
            <button
                onClick={handleGenerateSummary}
                className="inline-flex items-center gap-x-2 rounded-md bg-brand-blue px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z"></path>
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM3 10a.75.75 0 01.75-.75h10.5a.75.75 0 010 1.5H3.75A.75.75 0 013 10z" clipRule="evenodd"></path>
                  <path d="M10 3a.75.75 0 01.75.75v10.5a.75.75 0 01-1.5 0V3.75A.75.75 0 0110 3z"></path>
                  <path d="M3.75 2.25a.75.75 0 000 1.5h12.5a.75.75 0 000-1.5H3.75z"></path>
                  <path fillRule="evenodd" d="M9.44 12.06a.75.75 0 01.06-1.06l3-3a.75.75 0 111.06 1.06l-3 3a.75.75 0 01-1.12 0zm-3-3a.75.75 0 011.06 0l3 3a.75.75 0 11-1.06 1.06l-3-3a.75.75 0 010-1.06z" clipRule="evenodd"></path>
                  <path d="M12.5 5.5a.75.75 0 00-1.5 0v5a.75.75 0 001.5 0v-5z"></path>
                  <path d="M7.5 10.5a.75.75 0 00-1.5 0v2a.75.75 0 001.5 0v-2z"></path>
                </svg>
                Generate AI Summary
            </button>
        </div>
    );
};

export default ArticleSummary;
