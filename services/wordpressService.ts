
import { type Article, type Category, type Comment, type Tag, type Page } from '../types';

// This is the URL for your WordPress REST API.
// Change this if your site URL or API endpoint is different.
const WORDPRESS_API_URL = 'https://wamuzinews.co.ke/wp-json/wp/v2';

// --- MOCK DATA for Comments ---
// Comment submission cannot be done securely from the frontend without complex authentication.
// Therefore, we will simulate comment posting and fetching using the browser's localStorage.
const getMockComments = (): Comment[] => {
    const comments = localStorage.getItem('mockComments');
    return comments ? JSON.parse(comments) : [];
};

const setMockComments = (comments: Comment[]) => {
    localStorage.setItem('mockComments', JSON.stringify(comments));
};


// --- API FUNCTIONS ---
const handleResponse = async (response: Response) => {
    if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
    }
    return response.json();
};

/**
 * Fetches all articles (posts) from WordPress with embedded data.
 */
export const getArticles = async (): Promise<Article[]> => {
    console.log('Fetching live articles...');
    const response = await fetch(`${WORDPRESS_API_URL}/posts?_embed&per_page=100`);
    const articles = await handleResponse(response);
    // Simulate views and lastViewed for trending logic, as this isn't in standard WP API
    return articles.map((article: Article) => ({
        ...article,
        views: Math.floor(Math.random() * 20000) + 100,
        lastViewed: new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 48).toISOString()
    }));
};

/**
 * Fetches a single article by its slug with embedded data.
 */
export const getArticle = async (slug: string): Promise<Article | null> => {
    console.log(`Fetching live article with slug: ${slug}`);
    const response = await fetch(`${WORDPRESS_API_URL}/posts?slug=${slug}&_embed`);
    const articles = await handleResponse(response);
    if (articles.length > 0) {
        return articles[0];
    }
    return null;
}

/**
 * Fetches a single page by its slug.
 */
export const getPage = async (slug: string): Promise<Page | null> => {
    console.log(`Fetching live page with slug: ${slug}`);
    const response = await fetch(`${WORDPRESS_API_URL}/pages?slug=${slug}`);
    const pages = await handleResponse(response);
    if (pages.length > 0) {
        return pages[0];
    }
    return null;
}


/**
 * Fetches all categories from WordPress.
 */
export const getCategories = async (): Promise<Category[]> => {
  console.log('Fetching live categories...');
  const response = await fetch(`${WORDPRESS_API_URL}/categories?per_page=100`);
  return handleResponse(response);
};

/**
 * Fetches all tags from WordPress.
 */
export const getTags = async (): Promise<Tag[]> => {
    console.log('Fetching live tags...');
    const response = await fetch(`${WORDPRESS_API_URL}/tags?per_page=100`);
    return handleResponse(response);
}

/**
 * Fetches all comments for a specific post ID from localStorage.
 */
export const getComments = async (postId: number): Promise<Comment[]> => {
    console.log(`Fetching comments for post ID from localStorage: ${postId}`);
    await new Promise(res => setTimeout(res, 400)); // Simulate delay
    const allComments = getMockComments();
    return allComments.filter(c => c.post === postId);
};

/**
 * Submits a new comment to localStorage.
 */
export const postComment = async (
    postId: number,
    authorName: string,
    content: string,
    parentId: number = 0
): Promise<Comment> => {
    console.log(`Posting comment to post ID in localStorage: ${postId}`);
    await new Promise(res => setTimeout(res, 600)); // Simulate delay

    const newComment: Comment = {
        id: Date.now(),
        post: postId,
        parent: parentId,
        author_name: authorName,
        date: new Date().toISOString(),
        content: { rendered: `<p>${content.replace(/\n/g, '<br>')}</p>` },
    };
    
    const allComments = getMockComments();
    allComments.push(newComment);
    setMockComments(allComments);

    return newComment;
};
