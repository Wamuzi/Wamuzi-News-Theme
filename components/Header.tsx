
import React, { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import NewsTicker from './NewsTicker';
import { Article, Category } from '../types';
import SocialIcons from './SocialIcons';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';

interface HeaderProps {
  articles: Article[];
  categories: Category[];
  breakingNews: Article | null;
}

const UserMenu: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
    navigate('/');
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!currentUser) return null;

  return (
    <div className="relative ml-4" ref={dropdownRef}>
      <button 
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center justify-center h-10 w-10 rounded-full bg-gray-200 text-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:ring-offset-2"
        aria-haspopup="true"
        aria-expanded={isDropdownOpen}
      >
        <span className="sr-only">Open user menu</span>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
        </svg>
      </button>

      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-light-surface rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 z-20">
          <div className="px-4 py-2 border-b border-gray-200">
            <p className="text-sm text-text-secondary">Signed in as</p>
            <p className="text-sm font-medium text-text-primary truncate">{currentUser.username}</p>
          </div>
          <Link
            to="/profile"
            onClick={() => setIsDropdownOpen(false)}
            className="block px-4 py-2 text-sm text-text-secondary hover:bg-gray-100 hover:text-text-primary"
          >
            My Profile
          </Link>
          {currentUser.role === 'admin' && (
             <Link
                to="/admin"
                onClick={() => setIsDropdownOpen(false)}
                className="block px-4 py-2 text-sm text-brand-blue font-semibold hover:bg-gray-100"
              >
                Theme Options
              </Link>
          )}
          <button
            onClick={handleLogout}
            className="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700"
          >
            Log Out
          </button>
        </div>
      )}
    </div>
  )
}

const SearchForm: React.FC<{isMobile?: boolean}> = ({ isMobile = false }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearchSubmit = (e: React.FormEvent, closeMenu?: () => void) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery(''); // Clear input after search
      if (closeMenu) closeMenu();
    }
  };

  return (
     <form onSubmit={(e) => handleSearchSubmit(e)} className="relative w-full md:w-auto">
      <input
        type="search"
        placeholder="Search articles..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className={`w-full pl-4 pr-10 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent transition-colors ${ isMobile ? 'text-sm' : 'text-sm'}`}
      />
      <button type="submit" aria-label="Search" className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-brand-blue">
        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </button>
    </form>
  )
}

const Header: React.FC<HeaderProps> = ({ articles, categories, breakingNews }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { currentUser } = useAuth();
  const { settings } = useSettings();
  
  useEffect(() => {
    document.title = `${settings.general.siteTitle} - ${settings.general.tagline}`;
  }, [settings.general.siteTitle, settings.general.tagline]);

  const MobileSearchForm = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();
  
    const handleSearchSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (searchQuery.trim()) {
        navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
        setSearchQuery('');
        setIsMenuOpen(false);
      }
    };

    return (
       <form onSubmit={handleSearchSubmit} className="relative w-full">
         <input type="search" placeholder="Search articles..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-4 pr-10 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent transition-colors text-sm"
        />
        <button type="submit" aria-label="Search" className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-brand-blue">
          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </button>
      </form>
    )
  }

  return (
    <header className="bg-light-surface/80 backdrop-blur-md sticky top-0 z-50 shadow-md">
       {/* Top Bar */}
      {settings.header.showTopBar && (
        <div className="bg-gray-100 border-b border-gray-200">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-10">
            <span className="hidden md:block text-xs text-text-secondary font-medium">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
            <div className="flex-grow flex justify-center md:justify-end items-center space-x-4 md:space-x-6">
              {/* Award Badge */}
              <div className="flex items-center text-xs text-amber-600 font-semibold">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-500 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M17 2H3a1 1 0 00-1 1v2a1 1 0 001 1h1v8a2 2 0 002 2h8a2 2 0 002-2V6h1a1 1 0 001-1V3a1 1 0 00-1-1zM5 4h10v1H5V4zm8 11a1 1 0 01-1 1H8a1 1 0 01-1-1v-1h6v1zM4 6v8h2v-2a1 1 0 011-1h6a1 1 0 011 1v2h2V6H4z" />
                </svg>
                <span className="hidden sm:inline">{settings.header.awardText}</span>
                 <span className="sm:hidden">Award Winner</span>
              </div>
              <SocialIcons links={settings.header.socialLinks} />
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Site Branding */}
          <div className="flex-shrink-0">
            <Link to="/">
              <img src={settings.general.logoUrl} alt={`${settings.general.siteTitle} Logo`} className="h-10 w-auto" />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-2 lg:space-x-4">
            {categories.filter(c => c.slug !== 'breaking-news').map((category) => (
              <NavLink key={category.slug} to={`/category/${category.slug}`} className={({ isActive }) => `px-3 py-2 rounded-md text-sm font-semibold transition-colors ${ isActive ? 'bg-brand-blue text-white' : 'text-text-secondary hover:bg-gray-100 hover:text-brand-blue' }`}>
                {category.name}
              </NavLink>
            ))}
          </nav>
          
          {/* Auth Links / User Menu */}
          <div className="hidden md:flex items-center ml-4">
            <SearchForm />
            {currentUser ? (
              <UserMenu />
            ) : (
              <div className="flex items-center space-x-2 ml-4">
                <Link to="/login" className="px-4 py-2 rounded-md text-sm font-semibold text-brand-blue hover:bg-blue-50 transition-colors">Log In</Link>
                <Link to="/register" className="px-4 py-2 rounded-md text-sm font-semibold text-white bg-brand-blue hover:bg-blue-700 transition-colors shadow-sm">Sign Up</Link>
              </div>
            )}
          </div>
          
          {/* Mobile Menu Toggle */}
          <div className="flex items-center md:hidden">
             {currentUser && <UserMenu />}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-brand-blue hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-brand-blue"
              aria-controls="mobile-menu"
              aria-expanded={isMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" /></svg>
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Breaking News Bar */}
      {breakingNews && (
        <div className="bg-brand-red text-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <Link to={`/article/${breakingNews.slug}`} className="flex items-center h-12 group">
              <span className="font-extrabold text-sm uppercase tracking-wider animate-pulse flex-shrink-0">BREAKING</span>
              <span className="hidden sm:inline-block mx-4 h-4 w-px bg-red-300"></span>
              <p className="text-sm font-semibold truncate group-hover:underline" dangerouslySetInnerHTML={{ __html: breakingNews.title.rendered }} />
            </Link>
          </div>
        </div>
      )}

      {/* News Ticker */}
      <NewsTicker articles={articles} />

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
             <div className="p-1 mb-2">
              <MobileSearchForm />
            </div>
            {categories.filter(c => c.slug !== 'breaking-news').map((category) => (
              <NavLink
                key={category.slug}
                to={`/category/${category.slug}`}
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) => `block px-3 py-2 rounded-md text-base font-medium transition-colors ${ isActive ? 'bg-brand-blue text-white' : 'text-text-secondary hover:bg-gray-200 hover:text-text-primary' }`}
              >
                {category.name}
              </NavLink>
            ))}
             {!currentUser && (
                <div className="border-t border-gray-200 mt-4 pt-4 flex items-center justify-center space-x-2">
                   <Link to="/login" onClick={() => setIsMenuOpen(false)} className="flex-1 text-center px-4 py-2 rounded-md text-sm font-semibold text-brand-blue bg-blue-50 hover:bg-blue-100 transition-colors">Log In</Link>
                   <Link to="/register" onClick={() => setIsMenuOpen(false)} className="flex-1 text-center px-4 py-2 rounded-md text-sm font-semibold text-white bg-brand-blue hover:bg-blue-700 transition-colors shadow-sm">Sign Up</Link>
                </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
