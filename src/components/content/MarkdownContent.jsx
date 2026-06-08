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

function hasImageChild(children) {
  return React.Children.toArray(children).some((child) => {
    if (!React.isValidElement(child)) return false;
    if (child.type === 'img') return true;
    if (child.props?.children) return hasImageChild(child.props.children);
    return false;
  });
}

function renderLink({ children, href, className = '', cta = false, ...props }) {
  if (hasImageChild(children)) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={cn('not-prose group my-4 block overflow-hidden rounded-2xl', className)}
        {...props}
      >
        <div className="relative">
          {children}
          <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black/60 via-black/20 to-transparent px-4 py-3 text-white opacity-90 transition-opacity group-hover:opacity-100">
            <span className="text-sm font-medium">Bấm vào ảnh để xem ưu đãi</span>
            <ExternalLink className="h-4 w-4" />
          </div>
        </div>
      </a>
    );
  }

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
          img: ({ src, alt }) => (
            <img
              src={src}
              alt={alt || ''}
              className="my-0 w-full rounded-2xl object-cover"
              loading="lazy"
              decoding="async"
            />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
