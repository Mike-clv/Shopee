import React from 'react';

export const defaultShopeeBanners = [
  {
    id: 'shopee-66',
    title: 'Shopee 6.6',
    image_url: '/uploads/66.jpg',
    target_url: 'https://go.isclix.com/deep_link/v6/6041223145843920598/4751584435713464237?utm_source=Google&utm_medium=Banner&utm_campaign=Ctrinh66&utm_content=Shopee66&sub4=oneatweb&url_enc=aHR0cHM6Ly9zaG9wZWUudm4vbS82LTY%3D',
  },
  {
    id: 'shopee-661',
    title: 'Shopee 6.6',
    image_url: '/uploads/661.png',
    target_url: 'https://go.isclix.com/deep_link/v6/6041223145843920598/4751584435713464237?utm_source=Google&utm_medium=Banner&utm_campaign=Ctrinh66&utm_content=Shopee66&sub4=oneatweb&url_enc=aHR0cHM6Ly9zaG9wZWUudm4vbS82LTY%3D',
  },
];

export default function PromoBannerGrid({ banners = [], className = '' }) {
  const imageBanners = banners.filter((banner) => banner?.image_url);
  const visibleBanners = imageBanners.length ? imageBanners : defaultShopeeBanners;

  return (
    <div className={`promo-banner-stage grid gap-4 ${visibleBanners.length > 1 ? 'md:grid-cols-2' : ''} ${className}`}>
      {visibleBanners.map((banner, index) => {
        const image = (
          <img
            src={banner.image_url}
            alt={banner.title}
            className="w-full h-auto object-contain block promo-banner-image"
            loading={index === 0 ? 'eager' : 'lazy'}
            decoding="async"
            fetchPriority={index === 0 ? 'high' : 'auto'}
          />
        );

        return (
          <div
            key={banner.id || banner.image_url}
            className="promo-banner-card promo-banner-glow overflow-hidden rounded-lg border border-border bg-card shadow-sm"
            style={{ animationDelay: `${index * 0.45}s` }}
          >
            <span className="promo-banner-badge">Æ¯u Ä‘Ã£i ná»•i báº­t</span>
            {banner.target_url ? (
              <a href={banner.target_url} target="_blank" rel="noopener noreferrer" aria-label={banner.title}>
                {image}
              </a>
            ) : image}
          </div>
        );
      })}
    </div>
  );
}
