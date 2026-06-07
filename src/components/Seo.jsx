import { useEffect } from 'react';
import { DEFAULT_DESCRIPTION, DEFAULT_IMAGE, SITE_NAME, absoluteUrl, truncateText } from '@/lib/site';

function upsertMeta(selector, attributes) {
  let element = document.head.querySelector(selector);
  if (!element) {
    element = document.createElement('meta');
    document.head.appendChild(element);
  }

  Object.entries(attributes).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') {
      element.removeAttribute(key);
      return;
    }

    element.setAttribute(key, value);
  });
}

function upsertLink(selector, attributes) {
  let element = document.head.querySelector(selector);
  if (!element) {
    element = document.createElement('link');
    document.head.appendChild(element);
  }

  Object.entries(attributes).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') {
      element.removeAttribute(key);
      return;
    }

    element.setAttribute(key, value);
  });
}

export default function Seo({
  title,
  description = DEFAULT_DESCRIPTION,
  path = '/',
  image = DEFAULT_IMAGE,
  type = 'website',
  noindex = false,
  keywords = '',
  jsonLd,
}) {
  useEffect(() => {
    const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
    const finalDescription = truncateText(description || DEFAULT_DESCRIPTION, 160);
    const canonicalUrl = absoluteUrl(path);
    const imageUrl = absoluteUrl(image || DEFAULT_IMAGE);
    const robotsContent = noindex ? 'noindex,nofollow' : 'index,follow,max-image-preview:large';

    document.title = fullTitle;

    upsertMeta('meta[name="description"]', {
      name: 'description',
      content: finalDescription,
    });
    upsertMeta('meta[name="robots"]', {
      name: 'robots',
      content: robotsContent,
    });
    upsertMeta('meta[name="googlebot"]', {
      name: 'googlebot',
      content: robotsContent,
    });
    upsertMeta('meta[name="keywords"]', {
      name: 'keywords',
      content: keywords,
    });
    upsertMeta('meta[property="og:type"]', {
      property: 'og:type',
      content: type,
    });
    upsertMeta('meta[property="og:title"]', {
      property: 'og:title',
      content: fullTitle,
    });
    upsertMeta('meta[property="og:description"]', {
      property: 'og:description',
      content: finalDescription,
    });
    upsertMeta('meta[property="og:url"]', {
      property: 'og:url',
      content: canonicalUrl,
    });
    upsertMeta('meta[property="og:site_name"]', {
      property: 'og:site_name',
      content: SITE_NAME,
    });
    upsertMeta('meta[property="og:image"]', {
      property: 'og:image',
      content: imageUrl,
    });
    upsertMeta('meta[name="twitter:card"]', {
      name: 'twitter:card',
      content: 'summary_large_image',
    });
    upsertMeta('meta[name="twitter:title"]', {
      name: 'twitter:title',
      content: fullTitle,
    });
    upsertMeta('meta[name="twitter:description"]', {
      name: 'twitter:description',
      content: finalDescription,
    });
    upsertMeta('meta[name="twitter:image"]', {
      name: 'twitter:image',
      content: imageUrl,
    });
    upsertLink('link[rel="canonical"]', {
      rel: 'canonical',
      href: canonicalUrl,
    });

    const scriptId = 'seo-jsonld';
    let script = document.getElementById(scriptId);

    if (jsonLd) {
      if (!script) {
        script = document.createElement('script');
        script.id = scriptId;
        script.type = 'application/ld+json';
        document.head.appendChild(script);
      }

      script.textContent = JSON.stringify(jsonLd);
    } else if (script) {
      script.remove();
    }
  }, [description, image, jsonLd, keywords, noindex, path, title, type]);

  return null;
}
