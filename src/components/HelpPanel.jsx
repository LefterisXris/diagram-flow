import { X, BookOpen, Search } from 'lucide-react';
import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

/**
 * HelpPanel Component
 *
 * Modal panel that displays user documentation with markdown rendering.
 * Includes search functionality and table of contents navigation.
 */
const HelpPanel = ({ isOpen, onClose }) => {
  const [markdownContent, setMarkdownContent] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Load markdown content
  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      fetch('/docs/user-guide.md')
        .then((response) => {
          if (!response.ok) {
            throw new Error('Failed to load user guide');
          }
          return response.text();
        })
        .then((text) => {
          setMarkdownContent(text);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error('Error loading user guide:', error);
          setMarkdownContent('# Error\n\nFailed to load user guide. Please try again.');
          setIsLoading(false);
        });
    }
  }, [isOpen]);

  // Handle Escape key to close
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => {
        document.removeEventListener('keydown', handleEscape);
      };
    }
  }, [isOpen, onClose]);

  // Filter content based on search
  const filteredContent = searchQuery
    ? markdownContent
        .split('\n')
        .filter((line) => line.toLowerCase().includes(searchQuery.toLowerCase()))
        .join('\n')
    : markdownContent;

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-4xl h-[85vh] rounded-xl shadow-2xl flex flex-col"
        style={{ backgroundColor: 'var(--bg-elevated)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between p-6 border-b"
          style={{ borderColor: 'var(--border-primary)' }}
        >
          <div className="flex items-center gap-3">
            <div
              className="p-2 rounded-lg"
              style={{ backgroundColor: 'var(--accent-blue)' }}
            >
              <BookOpen className="w-5 h-5" style={{ color: '#ffffff' }} />
            </div>
            <div>
              <h2
                className="text-xl font-semibold"
                style={{ color: 'var(--text-primary)' }}
              >
                DiagramFlow User Guide
              </h2>
              <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
                Complete documentation and tutorials
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-opacity-10 transition-colors"
            style={{ color: 'var(--text-secondary)' }}
            title="Close (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b" style={{ borderColor: 'var(--border-primary)' }}>
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
              style={{ color: 'var(--text-muted)' }}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search documentation..."
              className="w-full pl-10 pr-4 py-2 rounded-lg text-sm border outline-none transition-colors"
              style={{
                backgroundColor: 'var(--bg-tertiary)',
                borderColor: searchQuery ? 'var(--accent-blue)' : 'var(--border-primary)',
                color: 'var(--text-primary)',
              }}
            />
          </div>
        </div>

        {/* Content */}
        <div
          className="flex-1 overflow-y-auto p-6"
          style={{ backgroundColor: 'var(--bg-secondary)' }}
        >
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div
                  className="inline-block w-8 h-8 border-4 border-t-transparent rounded-full animate-spin mb-3"
                  style={{ borderColor: 'var(--accent-blue)', borderTopColor: 'transparent' }}
                />
                <p style={{ color: 'var(--text-secondary)' }}>Loading documentation...</p>
              </div>
            </div>
          ) : (
            <div
              className="prose prose-sm max-w-none markdown-content"
              style={{ color: 'var(--text-primary)' }}
            >
              <ReactMarkdown
                components={{
                  // Customize markdown rendering for theme compatibility
                  h1: ({ node, ...props }) => (
                    <h1
                      {...props}
                      className="text-3xl font-bold mb-4 pb-2 border-b"
                      style={{ color: 'var(--text-primary)', borderColor: 'var(--border-primary)' }}
                    />
                  ),
                  h2: ({ node, ...props }) => (
                    <h2
                      {...props}
                      className="text-2xl font-semibold mt-8 mb-4"
                      style={{ color: 'var(--text-primary)' }}
                    />
                  ),
                  h3: ({ node, ...props }) => (
                    <h3
                      {...props}
                      className="text-xl font-semibold mt-6 mb-3"
                      style={{ color: 'var(--text-primary)' }}
                    />
                  ),
                  h4: ({ node, ...props }) => (
                    <h4
                      {...props}
                      className="text-lg font-semibold mt-4 mb-2"
                      style={{ color: 'var(--text-primary)' }}
                    />
                  ),
                  p: ({ node, ...props }) => (
                    <p
                      {...props}
                      className="mb-4 leading-relaxed"
                      style={{ color: 'var(--text-secondary)' }}
                    />
                  ),
                  a: ({ node, ...props }) => (
                    <a
                      {...props}
                      className="underline hover:no-underline"
                      style={{ color: 'var(--accent-blue)' }}
                      target="_blank"
                      rel="noopener noreferrer"
                    />
                  ),
                  code: ({ node, inline, ...props }) =>
                    inline ? (
                      <code
                        {...props}
                        className="px-1.5 py-0.5 rounded text-sm font-mono"
                        style={{
                          backgroundColor: 'var(--bg-tertiary)',
                          color: 'var(--accent-blue)',
                        }}
                      />
                    ) : (
                      <code
                        {...props}
                        className="block p-4 rounded-lg text-sm font-mono overflow-x-auto"
                        style={{
                          backgroundColor: 'var(--bg-tertiary)',
                          color: 'var(--text-primary)',
                        }}
                      />
                    ),
                  pre: ({ node, ...props }) => (
                    <pre
                      {...props}
                      className="mb-4 rounded-lg overflow-hidden"
                      style={{ backgroundColor: 'var(--bg-tertiary)' }}
                    />
                  ),
                  ul: ({ node, ...props }) => (
                    <ul
                      {...props}
                      className="list-disc list-inside mb-4 space-y-1"
                      style={{ color: 'var(--text-secondary)' }}
                    />
                  ),
                  ol: ({ node, ...props }) => (
                    <ol
                      {...props}
                      className="list-decimal list-inside mb-4 space-y-1"
                      style={{ color: 'var(--text-secondary)' }}
                    />
                  ),
                  li: ({ node, ...props }) => (
                    <li
                      {...props}
                      className="mb-1"
                      style={{ color: 'var(--text-secondary)' }}
                    />
                  ),
                  blockquote: ({ node, ...props }) => (
                    <blockquote
                      {...props}
                      className="border-l-4 pl-4 italic my-4"
                      style={{
                        borderColor: 'var(--accent-blue)',
                        color: 'var(--text-muted)',
                      }}
                    />
                  ),
                  table: ({ node, ...props }) => (
                    <div className="overflow-x-auto mb-4">
                      <table
                        {...props}
                        className="min-w-full border rounded-lg"
                        style={{ borderColor: 'var(--border-primary)' }}
                      />
                    </div>
                  ),
                  thead: ({ node, ...props }) => (
                    <thead
                      {...props}
                      style={{ backgroundColor: 'var(--bg-tertiary)' }}
                    />
                  ),
                  th: ({ node, ...props }) => (
                    <th
                      {...props}
                      className="px-4 py-2 text-left font-semibold border"
                      style={{
                        borderColor: 'var(--border-primary)',
                        color: 'var(--text-primary)',
                      }}
                    />
                  ),
                  td: ({ node, ...props }) => (
                    <td
                      {...props}
                      className="px-4 py-2 border"
                      style={{
                        borderColor: 'var(--border-primary)',
                        color: 'var(--text-secondary)',
                      }}
                    />
                  ),
                  hr: ({ node, ...props }) => (
                    <hr
                      {...props}
                      className="my-8 border-t"
                      style={{ borderColor: 'var(--border-primary)' }}
                    />
                  ),
                }}
              >
                {filteredContent}
              </ReactMarkdown>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-between p-4 border-t"
          style={{ borderColor: 'var(--border-primary)' }}
        >
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            Press <kbd className="px-2 py-0.5 rounded text-xs font-mono" style={{ backgroundColor: 'var(--bg-tertiary)' }}>Esc</kbd> to close
          </p>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg font-medium transition-colors"
            style={{
              backgroundColor: 'var(--accent-blue)',
              color: '#ffffff',
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default HelpPanel;
