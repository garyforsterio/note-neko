import { marked } from 'marked';

// Configure marked options
marked.setOptions({
  gfm: true, // GitHub Flavored Markdown
  breaks: true, // Convert line breaks to <br>
  headerIds: false, // Don't add IDs to headers
  mangle: false, // Don't mangle email addresses
});

export const renderMarkdown = (content: string): string => {
  return marked(content);
};
