import React, { useCallback, useEffect, useRef, useState } from 'react';

const accessTradeEmbedHtml = `<!doctype html>
<html lang="vi">
  <head>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.1/css/all.min.css" rel="stylesheet">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=yes" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
    <meta name="HandheldFriendly" content="true" />
    <meta name="apple-touch-fullscreen" content="yes"/>
    <meta name="description" content="Bảng mã giảm giá AccessTrade" />
    <meta name="robots" content="INDEX,FOLLOW" />
    <style>
      html, body { margin: 0; min-height: 0 !important; overflow: hidden; background: #e5ebed; font-family: Inter, Arial, sans-serif; }
      #layout-wrapper { min-height: 0 !important; padding: 0 !important; }
      .fa-3x { color: #f4511e; display: grid; place-items: center; min-height: 96px; }
      .atEQPOIVFSDFSDG-search button,
      .atEQPOIVFSDFSDG-search .btn,
      .atEQPOIVFSDFSDG-search input[type="button"],
      .atEQPOIVFSDFSDG-search input[type="submit"] {
        min-width: 128px !important;
        color: #fff !important;
        background: #f4511e !important;
        border-color: #f4511e !important;
        font-weight: 700 !important;
        opacity: 1 !important;
      }
      .atEQPOIVFSDFSDG-label-search {
        display: inline-flex !important;
        visibility: visible !important;
        opacity: 1 !important;
        color: #fff !important;
        white-space: nowrap !important;
        font-size: 14px !important;
        font-weight: 700 !important;
      }
      .atEQPOIVFSDFSDG-icon-search {
        display: inline-flex !important;
      }
      .atEQPOIVFSDFSDG-search button:empty::after,
      .atEQPOIVFSDFSDG-search .btn:empty::after {
        content: "Tìm kiếm";
        color: #fff;
        font-size: 14px;
        line-height: 1;
      }
      .atEQPOIVFSDFSDG-search input[type="text"],
      .atEQPOIVFSDFSDG-search input[type="search"] {
        color: #111827 !important;
      }
      .pagination,
      [class*="pagination"],
      [class*="paging"],
      [class*="page"] {
        color: #111827 !important;
        opacity: 1 !important;
      }
      .pagination a,
      .pagination span,
      [class*="pagination"] a,
      [class*="pagination"] span,
      [class*="paging"] a,
      [class*="paging"] span {
        color: #111827 !important;
        opacity: 1 !important;
      }
      .atEQPOIVFSDFSDG-voucher-main {
        min-height: 0 !important;
        padding: 8px 0 10px !important;
        box-sizing: border-box !important;
      }
      .atEQPOIVFSDFSDG-voucher-main .atEQPOIVFSDFSDG-container {
        padding-left: 12px !important;
        padding-right: 12px !important;
      }
      .atEQPOIVFSDFSDG-container {
        margin-top: 0 !important;
        padding-top: 0 !important;
        padding-bottom: 0 !important;
      }
      .atEQPOIVFSDFSDG-search-title {
        margin: 0 0 10px !important;
        padding-left: 0 !important;
      }
      .atEQPOIVFSDFSDG-first-block {
        margin-top: 0 !important;
        margin-bottom: 12px !important;
      }
      .atEQPOIVFSDFSDG-search {
        padding: 12px !important;
      }
      .atEQPOIVFSDFSDG-second-block {
        margin-top: 0 !important;
        margin-bottom: 0 !important;
      }
      .atEQPOIVFSDFSDG-dealpromo-body {
        padding-bottom: 8px !important;
      }
      .atEQPOIVFSDFSDG-coupon-pagination {
        padding-top: 4px !important;
        padding-bottom: 4px !important;
      }
      @media (max-width: 640px) {
        #layout-wrapper,
        .atEQPOIVFSDFSDG-voucher-main { min-height: 0 !important; }
        .atEQPOIVFSDFSDG-search button,
        .atEQPOIVFSDFSDG-search .btn,
        .atEQPOIVFSDFSDG-search input[type="button"],
        .atEQPOIVFSDFSDG-search input[type="submit"] {
          min-width: 118px !important;
          font-size: 13px !important;
          padding-left: 12px !important;
          padding-right: 12px !important;
        }
        .atEQPOIVFSDFSDG-label-search {
          display: inline-flex !important;
          font-size: 13px !important;
        }
      }
    </style>
  </head>
  <body>
    <div id="layout-wrapper">
      <main class="atEQPOIVFSDFSDG-voucher-main">
        <div class="fa-3x">
          <i class="fas fa-spinner fa-spin"></i>
        </div>
        <div class="atEQPOIVFSDFSDG-container" style="display: none">
          <div class="atEQPOIVFSDFSDG-first-block">
            <div class="atEQPOIVFSDFSDG-search"></div>
            <div class="atEQPOIVFSDFSDG-filter-keyword">
              <ul class="atEQPOIVFSDFSDG-tags"></ul>
            </div>
          </div>
          <div class="atEQPOIVFSDFSDG-second-block">
            <div class="atEQPOIVFSDFSDG-title-tabs"></div>
            <div class="atEQPOIVFSDFSDG-filters-and-delete-search"></div>
            <div class="atEQPOIVFSDFSDG-voucher-dealcoupon"></div>
          </div>
        </div>
      </main>
    </div>
    <script type="text/javascript" src="https://static.accesstrade.vn/coupon/v2/js/jquery-1.11.1.min.js"></script>
    <script type="text/javascript" src="https://static.accesstrade.vn/coupon/v2/js/popper.min.js"></script>
    <script type="text/javascript" src="https://static.accesstrade.vn/coupon/v2/js/bootstrap.min.js"></script>
    <script type="text/javascript" id="atScript6626"
      data-sub1=""
      data-sub2=""
      data-sub3=""
      data-sub4=""
      data-sub5=""
      data-utm-source=""
      data-utm-medium=""
      data-utm-campaign=""
      data-utm-content=""
      data-style-color="#fff"
      data-limit="10"
      data-row="2"
      data-filters='{"merchant":"4742147753565840242,4348611690224153209,","category":"E-COMMERCE,","campaign":"4751584435713464237,4348614231480407268,"}'
      data-accesskey="6041223145843920598"
      src="https://static.accesstrade.vn/coupon/v2/js/main_at_v3.js"></script>
    <script>
      (function patchAccessTradeSearchUi() {
        function appendFitStyle() {
          if (document.getElementById('at-fit-overrides')) return;
          var style = document.createElement('style');
          style.id = 'at-fit-overrides';
          style.textContent = [
            'html,body{min-height:0!important;overflow:hidden!important;background:#e5ebed!important;}',
            '#layout-wrapper{min-height:0!important;padding:0!important;}',
            '.fa-3x.at-loaded{display:none!important;height:0!important;min-height:0!important;margin:0!important;padding:0!important;}',
            '.atEQPOIVFSDFSDG-voucher-main{min-height:0!important;padding:8px 0 10px!important;}',
            '.atEQPOIVFSDFSDG-voucher-main .atEQPOIVFSDFSDG-container{padding-left:12px!important;padding-right:12px!important;}',
            '.atEQPOIVFSDFSDG-container{margin-top:0!important;padding-top:0!important;padding-bottom:0!important;}',
            '.atEQPOIVFSDFSDG-search-title{margin:0 0 10px!important;padding-left:0!important;}',
            '.atEQPOIVFSDFSDG-first-block{margin-top:0!important;margin-bottom:12px!important;}',
            '.atEQPOIVFSDFSDG-search{padding:12px!important;}',
            '.atEQPOIVFSDFSDG-btn-search{min-width:128px!important;color:#fff!important;background:#f4511e!important;border-color:#f4511e!important;font-weight:700!important;}',
            '.atEQPOIVFSDFSDG-label-search{display:inline-flex!important;visibility:visible!important;opacity:1!important;color:#fff!important;white-space:nowrap!important;font-size:14px!important;font-weight:700!important;}',
            '.atEQPOIVFSDFSDG-icon-search{display:inline-flex!important;}',
            '.atEQPOIVFSDFSDG-second-block{margin-top:0!important;margin-bottom:0!important;}',
            '.atEQPOIVFSDFSDG-coupon-pagination{padding-top:4px!important;padding-bottom:4px!important;}'
          ].join('');
          document.head.appendChild(style);
        }

        function reportHeight() {
          var selectors = [
            '.atEQPOIVFSDFSDG-coupon-pagination',
            '.atEQPOIVFSDFSDG-voucher-dealcoupon',
            '.atEQPOIVFSDFSDG-second-block',
            '.atEQPOIVFSDFSDG-container'
          ];
          var bottom = 0;
          for (var i = 0; i < selectors.length; i += 1) {
            var element = document.querySelector(selectors[i]);
            if (!element) continue;
            var rect = element.getBoundingClientRect();
            bottom = Math.max(bottom, rect.bottom + window.scrollY);
          }
          var height = Math.ceil(Math.max(760, bottom + 12));
          window.parent.postMessage({ source: 'at-coupon-embed', height: height }, '*');
        }

        function fitLayout() {
          appendFitStyle();
          var container = document.querySelector('.atEQPOIVFSDFSDG-container');
          var spinner = document.querySelector('.fa-3x');
          if (container && spinner && window.getComputedStyle(container).display !== 'none') {
            spinner.classList.add('at-loaded');
          }
          reportHeight();
        }

        function labelSearchButton() {
          var root = document.querySelector('.atEQPOIVFSDFSDG-search');
          if (!root) return;
          var controls = root.querySelectorAll('button, .btn, input[type="button"], input[type="submit"]');
          for (var i = 0; i < controls.length; i += 1) {
            var control = controls[i];
            if (control.tagName === 'INPUT') {
              if (!control.value || !control.value.trim()) control.value = 'Tìm kiếm';
            } else if (!control.textContent || !control.textContent.trim()) {
              control.textContent = 'Tìm kiếm';
            }
            control.setAttribute('aria-label', 'Tìm kiếm');
          }
        }
        fitLayout();
        labelSearchButton();
        setInterval(function () {
          fitLayout();
          labelSearchButton();
        }, 500);
      })();
    </script>
  </body>
</html>`;

export default function AccessTradeCouponEmbed({ showHeader = true }) {
  const iframeRef = useRef(null);
  const [height, setHeight] = useState(1180);

  const resizeIframe = useCallback(() => {
    const iframe = iframeRef.current;
    const doc = iframe?.contentDocument;
    if (!doc) return;

    const contentBottom = [
      '.atEQPOIVFSDFSDG-coupon-pagination',
      '.atEQPOIVFSDFSDG-voucher-dealcoupon',
      '.atEQPOIVFSDFSDG-second-block',
      '.atEQPOIVFSDFSDG-container',
    ].reduce((bottom, selector) => {
      const element = doc.querySelector(selector);
      if (!element) return bottom;
      const rect = element.getBoundingClientRect();
      return Math.max(bottom, rect.bottom + (doc.defaultView?.scrollY || 0));
    }, 0);

    const nextHeight = Math.max(
      760,
      contentBottom,
      doc.documentElement?.scrollHeight || 0,
      doc.body?.scrollHeight || 0
    );
    setHeight(Math.min(nextHeight + 16, 2200));
  }, []);

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.source !== iframeRef.current?.contentWindow) return;
      if (event.data?.source !== 'at-coupon-embed') return;
      const nextHeight = Number(event.data.height);
      if (!Number.isFinite(nextHeight)) return;
      setHeight(Math.min(Math.max(nextHeight, 760), 2200));
    };

    window.addEventListener('message', handleMessage);
    const timer = window.setInterval(resizeIframe, 700);
    const stopTimer = window.setTimeout(() => window.clearInterval(timer), 15000);
    return () => {
      window.removeEventListener('message', handleMessage);
      window.clearInterval(timer);
      window.clearTimeout(stopTimer);
    };
  }, [resizeIframe]);

  return (
    <section className={`${showHeader ? 'rounded-lg border border-border bg-card shadow-sm' : 'bg-transparent'} overflow-hidden`}>
      {showHeader && (
        <div className="px-4 sm:px-5 py-4 border-b border-border bg-secondary/50">
          <h2 className="text-lg sm:text-xl font-bold font-heading">Bảng mã giảm giá đầy đủ</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Dữ liệu voucher AccessTrade cho các chiến dịch thương mại điện tử đang hoạt động.
          </p>
        </div>
      )}
      <iframe
        ref={iframeRef}
        title="Bảng mã giảm giá AccessTrade"
        srcDoc={accessTradeEmbedHtml}
        className="w-full bg-white"
        style={{ height }}
        sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-forms"
        loading="lazy"
        scrolling="no"
        onLoad={resizeIframe}
      />
    </section>
  );
}
