
// Represents a WordPress Category
export interface Category {
  id: number;
  name: string;
  slug: string;
  count: number;
}

// Represents a WordPress Tag
export interface Tag {
  id: number;
  name: string;
  slug: string;
  count: number;
}

// Represents a WordPress Post (Article)
export interface Article {
  id: number;
  slug: string;
  date: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  excerpt: {
    rendered: string;
  };
  categories: number[]; // Array of category IDs
  tags: number[]; // Array of tag IDs
  views?: number; // Simulated view count for trending/popular sections
  lastViewed?: string; // ISO date string to simulate recency of views
  _embedded: {
    'wp:featuredmedia'?: {
      source_url: string;
    }[];
    'author'?: {
      name: string;
    }[];
     'wp:term'?: (Category[] | Tag[])[];
  };
}

// Represents a WordPress Page
export interface Page {
  id: number;
  slug: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
}

// Represents a WordPress Comment
export interface Comment {
  id: number;
  post: number;
  parent: number;
  author_name: string;
  date: string;
  content: {
    rendered: string;
  };
}

// Represents a User for authentication
export interface User {
    id: number;
    username: string;
    email: string;
    role: 'user' | 'admin';
    password?: string; // Should not be stored in frontend state in a real app
}

// Represents a social media link
export interface SocialLink {
    id: number;
    name: 'Facebook' | 'Twitter' | 'Instagram' | 'YouTube' | 'LinkedIn';
    url: string;
}

// Theme settings interfaces
export interface HeaderSettings {
  showTopBar: boolean;
  awardText: string;
  socialLinks: SocialLink[];
}

export interface FooterSettings {
  copyrightText: string;
}

export interface GeneralSettings {
  siteTitle: string;
  tagline: string;
  logoUrl: string; // Will store data URL for simulation
}

export interface HomepageSettings {
  sliderArticlesCount: number;
  trendingArticlesCount: number;
  latestArticlesCount: number;
}

export interface StylingSettings {
    primaryColor: string;
    breakingColor: string;
}

export interface ThemeSettings {
  general: GeneralSettings;
  header: HeaderSettings;
  footer: FooterSettings;
  homepage: HomepageSettings;
  styling: StylingSettings;
}
