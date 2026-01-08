
import React from 'react';

interface ShareButtonsProps {
  title: string;
  url: string;
}

const ShareButtons: React.FC<ShareButtonsProps> = ({ title, url }) => {
  const encodedTitle = encodeURIComponent(title);
  const encodedUrl = encodeURIComponent(url);

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    whatsapp: `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`,
  };

  return (
    <div className="flex items-center space-x-4 mt-6">
      <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider">Share:</h3>
      <a
        href={shareLinks.twitter}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on Twitter"
        className="text-gray-400 hover:text-[#1DA1F2] transition-colors"
      >
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.223.085c.645 1.956 2.523 3.379 4.75 3.419a9.89 9.89 0 01-6.115 2.107c-.398 0-.79-.023-1.175-.068a13.963 13.963 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
        </svg>
      </a>
      <a
        href={shareLinks.facebook}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on Facebook"
        className="text-gray-400 hover:text-[#1877F2] transition-colors"
      >
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
        </svg>
      </a>
      <a
        href={shareLinks.whatsapp}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on WhatsApp"
        className="text-gray-400 hover:text-[#25D366] transition-colors"
      >
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12.04 2.012c-5.523 0-10 4.477-10 10s4.477 10 10 10a9.96 9.96 0 006.404-2.224l3.353.94a.5.5 0 00.59-.59l-.94-3.353A9.96 9.96 0 0022.04 12.01c0-5.522-4.477-9.998-10-9.998zm0 1.5c4.687 0 8.5 3.813 8.5 8.5s-3.813 8.5-8.5 8.5a8.44 8.44 0 01-4.33-1.18l-.24-.14-3.2 1 1-3.2-.14-.24a8.44 8.44 0 01-1.18-4.33c0-4.687 3.813-8.5 8.5-8.5zm3.62 10.23c-.19-.1-.95-.47-1.1-.52s-.26-.08-.37.08-.41.52-.51.62-.19.12-.36.04-.68-.25-1.3-.8c-.48-.43-.81-.96-.9-1.12s0-.24.07-.32c.07-.07.16-.18.24-.27.08-.09.11-.15.17-.25.06-.1.03-.19-.01-.27-.05-.08-.37-.88-.51-1.2s-.27-.28-.37-.28-.2-.01-.29-.01c-.1 0-.25.04-.38.18s-.52.5-.63 1.22c-.12.72.1 1.43.23 1.63.13.2.98 1.57 2.4 2.2.35.16.63.25.84.32.32.1.61.08.83-.04.25-.13.75-.31.85-.61s.1-.56.07-.61l-.01-.01z" />
        </svg>
      </a>
    </div>
  );
};

export default ShareButtons;
