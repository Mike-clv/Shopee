function parseJson(value) {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

export function normalizePrice(value) {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : null;
  }

  const text = String(value || '').trim();
  if (!text) return null;

  const cleaned = text.replace(/[^\d.,-]/g, '');
  if (!cleaned) return null;

  const lastComma = cleaned.lastIndexOf(',');
  const lastDot = cleaned.lastIndexOf('.');

  let normalized = cleaned;
  if (lastComma >= 0 && lastDot >= 0) {
    if (lastComma > lastDot) {
      normalized = cleaned.replace(/\./g, '').replace(',', '.');
    } else {
      normalized = cleaned.replace(/,/g, '');
    }
  } else if (lastComma >= 0) {
    const commaParts = cleaned.split(',');
    if (commaParts.length === 2 && commaParts[1].length <= 2) {
      normalized = cleaned.replace(',', '.');
    } else {
      normalized = cleaned.replace(/,/g, '');
    }
  } else if (lastDot >= 0) {
    const dotParts = cleaned.split('.');
    if (!(dotParts.length === 2 && dotParts[1].length <= 2)) {
      normalized = cleaned.replace(/\./g, '');
    }
  }

  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}

function extractPriceFromOffer(offerNode) {
  if (!offerNode) return null;

  if (Array.isArray(offerNode)) {
    for (const item of offerNode) {
      const result = extractPriceFromOffer(item);
      if (result) return result;
    }
    return null;
  }

  if (typeof offerNode === 'object') {
    if (offerNode.price !== undefined) {
      const normalizedPrice = normalizePrice(offerNode.price);
      if (normalizedPrice !== null) {
        return {
          price: normalizedPrice,
          priceText: String(offerNode.price),
          source: 'jsonld',
        };
      }
    }

    if (offerNode.offers) {
      return extractPriceFromOffer(offerNode.offers);
    }
  }

  return null;
}

function findPriceInJsonLdNode(node) {
  if (!node) return null;

  if (Array.isArray(node)) {
    for (const item of node) {
      const result = findPriceInJsonLdNode(item);
      if (result) return result;
    }
    return null;
  }

  if (typeof node !== 'object') {
    return null;
  }

  const directOffer = extractPriceFromOffer(node.offers);
  if (directOffer) return directOffer;

  const mainEntityOffer = extractPriceFromOffer(node.mainEntity?.offers);
  if (mainEntityOffer) return mainEntityOffer;

  if (Array.isArray(node['@graph'])) {
    const graphMatch = findPriceInJsonLdNode(node['@graph']);
    if (graphMatch) return graphMatch;
  }

  for (const value of Object.values(node)) {
    const nestedMatch = findPriceInJsonLdNode(value);
    if (nestedMatch) return nestedMatch;
  }

  return null;
}

export function extractPriceFromJsonLdScripts(scripts = []) {
  for (const scriptText of scripts) {
    const parsed = parseJson(scriptText);
    if (!parsed) continue;

    const result = findPriceInJsonLdNode(parsed);
    if (result) {
      return result;
    }
  }

  return null;
}

export async function extractPriceFromPage(page, { priceSelector = '' } = {}) {
  const jsonLdScripts = await page.$$eval(
    'script[type="application/ld+json"]',
    (nodes) => nodes.map((node) => node.textContent || '').filter(Boolean),
  );

  const jsonLdResult = extractPriceFromJsonLdScripts(jsonLdScripts);
  if (jsonLdResult) {
    return jsonLdResult;
  }

  if (!priceSelector) {
    return null;
  }

  try {
    await page.waitForSelector(priceSelector, { timeout: 4000 });
    const rawPriceText = await page.$eval(
      priceSelector,
      (node) => node.textContent || node.getAttribute('content') || '',
    );
    const normalizedPrice = normalizePrice(rawPriceText);
    if (normalizedPrice === null) {
      return null;
    }

    return {
      price: normalizedPrice,
      priceText: String(rawPriceText).trim(),
      source: 'selector',
    };
  } catch {
    return null;
  }
}
