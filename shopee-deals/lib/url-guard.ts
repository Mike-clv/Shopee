/**
 * Redirect-target guard for affiliate links (pure + unit-testable).
 *
 * The /go handler forwards coupon visitors to aff_link values that come from
 * external feeds and manual admin input, so every target must pass here
 * before Response.redirect. Goal: the visitor's browser is only ever sent to
 * a plausible public domain — never a javascript:-style scheme, never
 * something that resolves into their own machine (localhost / private
 * ranges in ANY common encoding), never an internal-network convention.
 */

/** Internal-tld conventions that never are public websites. */
const INTERNAL_TLD = /\.(local|internal|lan|dev)$/;

/** Wildcard-DNS providers that map IP-shaped subdomains to the visitor's own network. */
const WILD_DNS = /\.(nip\.io|sslip\.io|localtest\.me|lvh\.me)/;

export function isSafeRedirectTarget(raw: string): boolean {
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    return false;
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") return false;

  const host = url.hostname.toLowerCase();
  if (!host || host.length > 253) return false;
  // IPv6 literals in any bracket spelling — affiliate targets are domains.
  if (host.includes(":") || host.startsWith("[")) return false;

  // Machine-local / internal-convention names.
  if (host === "localhost" || host.endsWith(".localhost")) return false;
  if (INTERNAL_TLD.test(host)) return false;
  // 127.0.0.1.nip.io / 127-0-0-1.sslip.io style self-referencing hosts.
  if (WILD_DNS.test(host)) return false;

  // IP-shaped host encodings. A real affiliate destination is always a named
  // domain, so all numeric-host spellings are rejected outright, regardless
  // of whether the address itself is public:
  // - "2130706433" (integer IPv4 for 127.0.0.1)
  // - "127.0.0.1" / "1.2.3.4" (dotted decimal)
  // - "2130706433.nip.io" / "127.0.0.1.evil.io" (numeric first label)
  // - "127-0-0-1.sslip.io" (dashed form)
  // - "0x7f000001" / "0177.0.0.1" (hex/octal — also killed by the TLD shape
  //   check below, since a real TLD must start with a letter)
  if (/^[\d.]+$/.test(host)) return false;
  if (/^\d+\./.test(host)) return false;
  if (/^\d{1,3}(\.\d{1,3}){3}\./.test(host)) return false;
  if (/^\d{1,3}-\d{1,3}-\d{1,3}-\d{1,3}[.-]/.test(host)) return false;

  // A hostname must carry at least two labels and an alphabetic-start TLD —
  // which also neutralizes hex/octal IP spellings (they cannot start a TLD)
  // and bare single-label hosts.
  if (!host.includes(".")) return false;
  const tld = host.split(".").at(-1) ?? "";
  if (!/^[a-z][a-z0-9-]{1,62}$/.test(tld)) return false;

  return true;
}
