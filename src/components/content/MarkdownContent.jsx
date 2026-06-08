import React from 'react';
import ReactMarkdown from 'react-markdown';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

function normalizeText(children) {
  return React.Children.toArray(children)
    .map((child) => {
      if (typeof child === 'string') return child;
      if (typeof child === 'number') return String(child);
      if (React.isValidElement(child) && child.props?.children) {
        return normalizeText(child.props.children);
      }
      return '';
    })
    .join('')
    .trim();
}

function isCtaLabel(text) {
  const normalized = String(text || '').trim().toUpperCase();
  return normalized === 'MUA NGAY';
}

export default function MarkdownContent({ content = '', className = '' }) {
  return (
    <div className={cn('prose prose-sm max-w-none sm:prose', className)}>
      <ReactMarkdown
        components={{
          a: ({ children, href, ...props }) => {
            const label = normalizeText(children);
            const cta = isCtaLabel(label);

            if (cta) {
              return (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="not-prose my-3 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground no-underline shadow transition-opacity hover:opacity-90"
                  {...props}
                >
                  <span>{label}</span>
                  <ArrowRight className="h-4 w-4" />
                </a>
              );
            }

            return (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-primary underline underline-offset-4"
                {...props}
              >
                <span>{children}</span>
                <ExternalLink className="ml-1 inline h-3.5 w-3.5 align-text-bottom" />
              </a>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
