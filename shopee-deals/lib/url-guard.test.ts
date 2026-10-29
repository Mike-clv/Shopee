import { describe, expect, it } from "vitest";
import { isSafeRedirectTarget } from "./url-guard";

describe("isSafeRedirectTarget", () => {
  it("allows normal public affiliate targets", () => {
    const safe = [
      "https://shopee.vn/voucher-abc",
      "http://img.lazcdn.com/p/x.jpg",
      "https://tiki.vn/deal?utm_source=a",
      "https://gate.accesstrade.vn/forward?t=trusted",
      "https://xn--mnchen-3ya.com/x", // valid punycode domain is fine
      "https://9gag.com/shop", // first label starts with a digit but has letters
    ];
    for (const url of safe) {
      expect(isSafeRedirectTarget(url), url).toBe(true);
    }
  });

  it("rejects non-http schemes", () => {
    expect(isSafeRedirectTarget("javascript:alert(1)")).toBe(false);
    expect(isSafeRedirectTarget("data:text/html,<b>x</b>")).toBe(false);
    expect(isSafeRedirectTarget("file:///etc/passwd")).toBe(false);
    expect(isSafeRedirectTarget("ftp://mirror.io/x")).toBe(false);
    expect(isSafeRedirectTarget("not a url :: at all")).toBe(false);
  });

  it("rejects localhost and internal conventions", () => {
    expect(isSafeRedirectTarget("https://localhost/")).toBe(false);
    expect(isSafeRedirectTarget("https://sub.localhost/")).toBe(false);
    expect(isSafeRedirectTarget("https://app.local/")).toBe(false);
    expect(isSafeRedirectTarget("https://svc.internal/")).toBe(false);
    expect(isSafeRedirectTarget("https://nas.lan/")).toBe(false);
    expect(isSafeRedirectTarget("https://stage.dev/")).toBe(false);
  });

  it("rejects IP literals in every common encoding", () => {
    expect(isSafeRedirectTarget("https://127.0.0.1/")).toBe(false);
    expect(isSafeRedirectTarget("https://10.1.2.3/")).toBe(false);
    expect(isSafeRedirectTarget("https://192.168.0.9/")).toBe(false);
    expect(isSafeRedirectTarget("https://169.254.1.1/")).toBe(false);
    expect(isSafeRedirectTarget("https://1.1.1.1/")).toBe(false); // even public plain IPs
    expect(isSafeRedirectTarget("https://2130706433/")).toBe(false); // integer → 127.0.0.1
    expect(isSafeRedirectTarget("https://2130706433.nip.io/")).toBe(false);
    expect(isSafeRedirectTarget("https://0x7f000001/")).toBe(false); // hex
    expect(isSafeRedirectTarget("https://0177.0.0.1/")).toBe(false); // octal
    expect(isSafeRedirectTarget("http://[::1]/")).toBe(false); // IPv6 loopback
    expect(isSafeRedirectTarget("http://[fd00::1]:80/")).toBe(false);
  });

  it("rejects wildcard-DNS and numeric-first-label bypasses", () => {
    expect(isSafeRedirectTarget("https://127.0.0.1.nip.io/")).toBe(false);
    expect(isSafeRedirectTarget("https://127-0-0-1.sslip.io/")).toBe(false);
    expect(isSafeRedirectTarget("https://10.0.0.1.localtest.me/")).toBe(false);
    expect(isSafeRedirectTarget("https://127.0.0.1.evil-probe.tld/")).toBe(false);
  });

  it("requires a plausible domain shape", () => {
    expect(isSafeRedirectTarget("https://shopee/")).toBe(false); // single label
    expect(isSafeRedirectTarget("https://shopee.vn./x")).toBe(false); // trailing dot
    expect(isSafeRedirectTarget("https://evil_host.com/")).toBe(true); // label charset open to URL parser
  });
});
