import React, { useEffect, useMemo, useState } from 'react';
import { getBrandInitial, getBrandLogoCandidates } from '@/lib/branding';

export default function BrandLogo({
  brand,
  alt,
  className = '',
  fallbackClassName = '',
  imgClassName = '',
  loading = 'lazy',
  decoding = 'async',
  fetchPriority = 'auto',
}) {
  const candidates = useMemo(() => getBrandLogoCandidates(brand), [brand]);
  const [candidateIndex, setCandidateIndex] = useState(0);

  useEffect(() => {
    setCandidateIndex(0);
  }, [candidates.join('|')]);

  const currentSource = candidates[candidateIndex];

  if (currentSource) {
    return (
      <img
        src={currentSource}
        alt={alt || brand?.name || brand?.brand_name || 'Brand logo'}
        className={`${className} ${imgClassName}`.trim()}
        loading={loading}
        decoding={decoding}
        fetchPriority={fetchPriority}
        onError={() => {
          setCandidateIndex((value) => value + 1);
        }}
      />
    );
  }

  return (
    <span className={`${className} ${fallbackClassName}`.trim()}>
      {getBrandInitial(brand)}
    </span>
  );
}
