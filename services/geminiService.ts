import { GoogleGenAI } from "@google/genai";
import { marked } from 'marked';

// The SDK will automatically pick up the API key from the environment.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Strips HTML tags from a string to get plain text.
 * @param html The HTML string.
 * @returns Plain text string.
 */
function stripHtml(html: string): string {
    return html.replace(/<[^>]*>?/gm, '').replace(/\[&hellip;\]/, '...');
}

/**
 * Generates a concise summary for a news article using the Gemini API.
 * @param articleContent The full HTML content of the article.
 * @returns A summary string, formatted as Markdown.
 */
export const generateArticleSummary = async (articleContent: string): Promise<string> => {
    try {
        const textContent = stripHtml(articleContent);

        // Limit content size to avoid overly large requests
        const maxContentLength = 15000;
        const truncatedContent = textContent.length > maxContentLength 
            ? textContent.substring(0, maxContentLength)
            : textContent;
        
        const prompt = `Summarize the following news article into three concise bullet points. Focus on the most important facts and outcomes. Format the output as Markdown:\n\n---\n\n${truncatedContent}`;
        
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
        });
        
        const summaryText = response.text;
        
        if (!summaryText) {
            throw new Error('Received an empty summary from the API.');
        }

        return summaryText;

    } catch (error) {
        console.error("Error generating article summary:", error);
        throw new Error("Failed to generate summary. The AI model may be temporarily unavailable.");
    }
};

/**
 * Converts a Markdown string to an HTML string.
 * @param markdown The Markdown string.
 * @returns An HTML string.
 */
export const convertMarkdownToHtml = (markdown: string): string => {
    // Using marked to parse markdown into HTML
    return marked(markdown) as string;
};
