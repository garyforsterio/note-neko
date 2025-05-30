import { marked } from 'marked';

// Configure marked options
marked.setOptions({
  gfm: true, // GitHub Flavored Markdown
  breaks: true, // Convert line breaks to <br>
});

export const renderMarkdown = async (content: string): Promise<string> => {
  return marked(content);
};
