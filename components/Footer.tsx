
import React from 'react';
import { Link } from 'react-router-dom';
import SocialIcons from './SocialIcons';
import { useSettings } from '../context/SettingsContext';

const Footer: React.FC = () => {
  const { settings } = useSettings();
  const currentYear = new Date().getFullYear();
  const copyrightText = settings.footer.copyrightText.replace('{year}', currentYear.toString());

  return (
    <footer className="bg-light-surface border-t border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          
          {/* Copyright Info */}
          <div className="text-center md:text-left">
            <p className="text-text-secondary">{copyrightText}</p>
          </div>
          
          {/* Footer Nav */}
          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2" aria-label="Footer">
            <Link to="/contact-us" className="text-sm text-text-secondary hover:text-brand-blue hover:underline transition-colors">
              Contact Us
            </Link>
            <Link to="/about-us" className="text-sm text-text-secondary hover:text-brand-blue hover:underline transition-colors">
              About Us
            </Link>
            {/* You can add other static links here if needed */}
          </nav>
          
          {/* Social Icons */}
          <div className="flex justify-center md:justify-end">
             <SocialIcons links={settings.header.socialLinks} />
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;
