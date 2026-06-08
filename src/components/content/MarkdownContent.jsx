import React from 'react';
import ReactMarkdown from 'react-markdown';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

const CTA_LINK_CLASSNAME =
  'not-prose my-3 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground no-underline shadow transition-opacity hover:opacity-90';

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

function isStandaloneCtaLink(child) {
  if (!React.isValidElement(child)) return false;
  if (!child.props?.href) return false;

  const label = normalizeText(child.props.children);
  return Boolean(label) && label.length <= 40;
}

function renderLink({ children, href, className = '', cta = false, ...props }) {
  if (cta) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(CTA_LINK_CLASSNAME, className)}
        {...props}
      >
        <span>{children}</span>
        <ArrowRight className="h-4 w-4" />
      </a>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn('font-medium text-primary underline underline-offset-4', className)}
      {...props}
    >
      <span>{children}</span>
      <ExternalLink className="ml-1 inline h-3.5 w-3.5 align-text-bottom" />
    </a>
  );
}

export default function MarkdownContent({ content = '', className = '' }) {
  return (
    <div className={cn('prose prose-sm max-w-none sm:prose', className)}>
      <ReactMarkdown
        components={{
          p: ({ children }) => {
            const items = React.Children.toArray(children).filter((child) => {
              if (typeof child === 'string') {
                return child.trim().length > 0;
              }
              return child !== null && child !== undefined;
            });

            if (items.length === 1 && isStandaloneCtaLink(items[0])) {
              const child = items[0];

              if (String(child.props.className || '').includes('bg-primary')) {
                return <div className="not-prose">{child}</div>;
              }

              return (
                <div className="not-prose">
                  {React.cloneElement(child, {
                    className: cn(CTA_LINK_CLASSNAME, child.props.className),
                    children: (
                      <>
                        <span>{child.props.children}</span>
                        <ArrowRight className="h-4 w-4" />
                      </>
                    ),
                  })}
                </div>
              );
            }

            return <p>{children}</p>;
          },
          a: ({ children, href, ...props }) => {
            const label = normalizeText(children);
            return renderLink({ children, href, cta: isCtaLabel(label), ...props });
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
