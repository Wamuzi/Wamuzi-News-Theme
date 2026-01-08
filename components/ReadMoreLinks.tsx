
import React from 'react';
import { Link } from 'react-router-dom';
import { type Article } from '../types';

interface ReadMoreLinksProps {
  articles: Article[];
}

const ReadMoreLinks: React.FC<ReadMoreLinksProps> = ({ articles }) => {
  if (articles.length === 0) {
    return null;
  }

  return (
    <aside className="my-8 p-6 bg-gray-100 border-l-4 border-brand-blue rounded-r-lg not-prose">
      <h3 className="text-lg font-bold text-text-primary mb-3">READ ALSO</h3>
      <ul className="space-y-2 list-none p-0 m-0">
        {articles.map(article => (
          <li key={article.id}>
            <Link
              to={`/article/${article.slug}`}
              className="text-brand-blue font-semibold hover:underline transition-colors text-base"
              dangerouslySetInnerHTML={{ __html: article.title.rendered }}
            />
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default ReadMoreLinks;