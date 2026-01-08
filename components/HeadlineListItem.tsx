
import React from 'react';
import { Link } from 'react-router-dom';
import { type Article } from '../types';

interface HeadlineListItemProps {
    article: Article;
}

const HeadlineListItem: React.FC<HeadlineListItemProps> = ({ article }) => {
    const imageUrl = article._embedded?.['wp:featuredmedia']?.[0]?.source_url || `https://picsum.photos/seed/${article.id}/150/150`;

    return (
        <Link 
            to={`/article/${article.slug}`} 
            className="group flex items-start gap-4 p-3 rounded-lg hover:bg-gray-100 transition-colors"
        >
            <img 
                src={imageUrl} 
                alt={article.title.rendered} 
                className="w-20 h-20 object-cover rounded-md flex-shrink-0"
                loading="lazy"
            />
            <div className="flex-grow">
                <h3 
                    className="text-base font-semibold text-text-primary group-hover:text-brand-blue transition-colors leading-tight"
                    dangerouslySetInnerHTML={{ __html: article.title.rendered }}
                />
            </div>
        </Link>
    );
};

export default HeadlineListItem;