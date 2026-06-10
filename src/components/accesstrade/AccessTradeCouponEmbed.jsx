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
      .atEQPOIVFSDFSDG-container-btncopy {
        display: flex !important;
        justify-content: flex-end !important;
        align-items: flex-end !important;
        align-self: end !important;
        width: auto !important;
        margin-left: auto !important;
        padding: 0 8px 0 0 !important;
        box-sizing: border-box !important;
      }
      .atEQPOIVFSDFSDG-container-btncopy .atEQPOIVFSDFSDG-dealact-copy {
        display: inline-flex !important;
        position: relative !important;
        align-items: center !important;
        justify-content: center !important;
        min-width: 86px !important;
        height: 30px !important;
        margin: 0 !important;
        padding: 6px 12px !important;
        border: none !important;
        border-radius: 4px !important;
        background: #6C5CE7 !important;
        box-sizing: border-box !important;
        float: none !important;
        inset: auto !important;
        transform: none !important;
        color: #fff !important;
        font-size: 13px !important;
        font-weight: 700 !important;
        line-height: 1 !important;
        white-space: nowrap !important;
        text-indent: 0 !important;
        overflow: visible !important;
        opacity: 1 !important;
        visibility: visible !important;
      }
      .atEQPOIVFSDFSDG-container-btncopy .atEQPOIVFSDFSDG-dealact-copy:empty::after {
        content: "Lấy link";
        color: #fff;
        font-size: 13px;
        font-weight: 700;
      }
      #myModalDesktop .atEQPOIVFSDFSDG-at-modal-content,
      #myModalNextCouponDesktop .atEQPOIVFSDFSDG-at-modal-content {
        width: min(460px, calc(100vw - 48px)) !important;
        max-width: 460px !important;
      }
      #myModalDesktop .atEQPOIVFSDFSDG-details-action,
      #myModalNextCouponDesktop .atEQPOIVFSDFSDG-details-action {
        display: flex !important;
        align-items: center !important;
        gap: 12px !important;
      }
      #myModalDesktop .atEQPOIVFSDFSDG-code-coupon,
      #myModalNextCouponDesktop .atEQPOIVFSDFSDG-code-coupon {
        flex: 1 1 auto !important;
        min-width: 0 !important;
        display: flex !important;
        align-items: center !important;
        overflow: hidden !important;
        white-space: nowrap !important;
        text-overflow: ellipsis !important;
        font-size: 12px !important;
        line-height: 1.2 !important;
      }
      #myModalDesktop .atEQPOIVFSDFSDG-details-dealact-copy,
      #myModalNextCouponDesktop .atEQPOIVFSDFSDG-details-dealact-copy {
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        flex: 0 0 auto !important;
        min-width: 132px !important;
        padding: 10px 16px !important;
        visibility: visible !important;
        opacity: 1 !important;
        white-space: nowrap !important;
        overflow: visible !important;
      }
      .at-fixed-link-btn {
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        flex: 0 0 auto !important;
        min-width: 132px !important;
        padding: 10px 16px !important;
        border-radius: 12px !important;
        background: #5b4fd4 !important;
        color: #fff !important;
        font-weight: 700 !important;
        text-decoration: none !important;
        white-space: nowrap !important;
        box-sizing: border-box !important;
      }
      #myModal .atEQPOIVFSDFSDG-details-action-content,
      #myModalNextCoupon .atEQPOIVFSDFSDG-details-action-content {
        display: flex !important;
        align-items: stretch !important;
        gap: 10px !important;
      }
      #myModal .atEQPOIVFSDFSDG-code-coupon-vmb,
      #myModalNextCoupon .atEQPOIVFSDFSDG-code-coupon-vmb {
        flex: 1 1 auto !important;
        min-width: 0 !important;
        display: flex !important;
        align-items: center !important;
        overflow: hidden !important;
        white-space: nowrap !important;
        text-overflow: ellipsis !important;
        font-size: 12px !important;
        line-height: 1.2 !important;
      }
      #myModal .atEQPOIVFSDFSDG-details-dealact-copy-vmb,
      #myModalNextCoupon .atEQPOIVFSDFSDG-details-dealact-copy-vmb {
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        flex: 0 0 auto !important;
        min-width: 118px !important;
        padding: 0 14px !important;
        white-space: nowrap !important;
      }
      #myModal .atEQPOIVFSDFSDG-details-dealact-copy-vmb a,
      #myModalNextCoupon .atEQPOIVFSDFSDG-details-dealact-copy-vmb a,
      #myModal .atEQPOIVFSDFSDG-details-copy-btn-large,
      #myModalNextCoupon .atEQPOIVFSDFSDG-details-copy-btn-large {
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        gap: 6px !important;
        white-space: nowrap !important;
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
            '.atEQPOIVFSDFSDG-coupon-pagination{padding-top:4px!important;padding-bottom:4px!important;}',
            '.atEQPOIVFSDFSDG-container-btncopy{display:flex!important;justify-content:flex-end!important;align-items:flex-end!important;align-self:end!important;width:auto!important;margin-left:auto!important;padding:0 8px 0 0!important;box-sizing:border-box!important;}',
            '.atEQPOIVFSDFSDG-container-btncopy .atEQPOIVFSDFSDG-dealact-copy{display:inline-flex!important;position:relative!important;align-items:center!important;justify-content:center!important;min-width:86px!important;height:30px!important;margin:0!important;padding:6px 12px!important;border:none!important;border-radius:4px!important;background:#6C5CE7!important;box-sizing:border-box!important;float:none!important;inset:auto!important;transform:none!important;color:#fff!important;font-size:13px!important;font-weight:700!important;line-height:1!important;white-space:nowrap!important;text-indent:0!important;overflow:visible!important;opacity:1!important;visibility:visible!important;}',
            '.atEQPOIVFSDFSDG-container-btncopy .atEQPOIVFSDFSDG-dealact-copy:empty::after{content:"Lấy link";color:#fff;font-size:13px;font-weight:700;}',
            '#myModalDesktop .atEQPOIVFSDFSDG-at-modal-content,#myModalNextCouponDesktop .atEQPOIVFSDFSDG-at-modal-content{width:min(460px,calc(100vw - 48px))!important;max-width:460px!important;}',
            '#myModalDesktop .atEQPOIVFSDFSDG-details-action,#myModalNextCouponDesktop .atEQPOIVFSDFSDG-details-action{display:flex!important;align-items:center!important;gap:12px!important;}',
            '#myModalDesktop .atEQPOIVFSDFSDG-code-coupon,#myModalNextCouponDesktop .atEQPOIVFSDFSDG-code-coupon{flex:1 1 auto!important;min-width:0!important;display:flex!important;align-items:center!important;overflow:hidden!important;white-space:nowrap!important;text-overflow:ellipsis!important;font-size:12px!important;line-height:1.2!important;}',
            '#myModalDesktop .atEQPOIVFSDFSDG-details-dealact-copy,#myModalNextCouponDesktop .atEQPOIVFSDFSDG-details-dealact-copy{display:inline-flex!important;align-items:center!important;justify-content:center!important;flex:0 0 auto!important;min-width:132px!important;padding:10px 16px!important;visibility:visible!important;opacity:1!important;white-space:nowrap!important;overflow:visible!important;}',
            '.at-fixed-link-btn{display:inline-flex!important;align-items:center!important;justify-content:center!important;flex:0 0 auto!important;min-width:132px!important;padding:10px 16px!important;border-radius:12px!important;background:#5b4fd4!important;color:#fff!important;font-weight:700!important;text-decoration:none!important;white-space:nowrap!important;box-sizing:border-box!important;}',
            '#myModal .atEQPOIVFSDFSDG-details-action-content,#myModalNextCoupon .atEQPOIVFSDFSDG-details-action-content{display:flex!important;align-items:stretch!important;gap:10px!important;}',
            '#myModal .atEQPOIVFSDFSDG-code-coupon-vmb,#myModalNextCoupon .atEQPOIVFSDFSDG-code-coupon-vmb{flex:1 1 auto!important;min-width:0!important;display:flex!important;align-items:center!important;overflow:hidden!important;white-space:nowrap!important;text-overflow:ellipsis!important;font-size:12px!important;line-height:1.2!important;}',
            '#myModal .atEQPOIVFSDFSDG-details-dealact-copy-vmb,#myModalNextCoupon .atEQPOIVFSDFSDG-details-dealact-copy-vmb{display:inline-flex!important;align-items:center!important;justify-content:center!important;flex:0 0 auto!important;min-width:118px!important;padding:0 14px!important;white-space:nowrap!important;}',
            '#myModal .atEQPOIVFSDFSDG-details-dealact-copy-vmb a,#myModalNextCoupon .atEQPOIVFSDFSDG-details-dealact-copy-vmb a,#myModal .atEQPOIVFSDFSDG-details-copy-btn-large,#myModalNextCoupon .atEQPOIVFSDFSDG-details-copy-btn-large{display:inline-flex!important;align-items:center!important;justify-content:center!important;gap:6px!important;white-space:nowrap!important;}',
            '#myModal .atEQPOIVFSDFSDG-code-coupon-vmb > *,#myModalNextCoupon .atEQPOIVFSDFSDG-code-coupon-vmb > *,#myModalDesktop .atEQPOIVFSDFSDG-code-coupon > *,#myModalNextCouponDesktop .atEQPOIVFSDFSDG-code-coupon > *{min-width:0!important;max-width:100%!important;overflow:hidden!important;text-overflow:ellipsis!important;white-space:nowrap!important;box-sizing:border-box!important;}'
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
        function patchDetailButtons() {
          var staleListFallbackButtons = document.querySelectorAll('.at-fixed-card-link-btn');
          for (var l = 0; l < staleListFallbackButtons.length; l += 1) {
            staleListFallbackButtons[l].remove();
          }

          var listButtons = document.querySelectorAll('.atEQPOIVFSDFSDG-container-btncopy .atEQPOIVFSDFSDG-dealact-copy');
          for (var k = 0; k < listButtons.length; k += 1) {
            var listButton = listButtons[k];
            listButton.textContent = 'L\\u1EA5y link';
            listButton.setAttribute('aria-label', 'L\\u1EA5y link');
            listButton.style.display = 'inline-flex';
            listButton.style.position = 'relative';
            listButton.style.alignItems = 'center';
            listButton.style.justifyContent = 'center';
            listButton.style.minWidth = '86px';
            listButton.style.height = '30px';
            listButton.style.margin = '0';
            listButton.style.padding = '6px 12px';
            listButton.style.border = 'none';
            listButton.style.borderRadius = '4px';
            listButton.style.background = '#6C5CE7';
            listButton.style.boxSizing = 'border-box';
            listButton.style.color = '#fff';
            listButton.style.fontSize = '13px';
            listButton.style.fontWeight = '700';
            listButton.style.lineHeight = '1';
            listButton.style.whiteSpace = 'nowrap';
            listButton.style.textIndent = '0';
            listButton.style.overflow = 'visible';
            listButton.style.opacity = '1';
            listButton.style.visibility = 'visible';
            listButton.style.float = 'none';
            listButton.style.inset = 'auto';
            listButton.style.transform = 'none';

            var listContainer = listButton.parentElement;
            if (!listContainer) continue;
            listContainer.style.display = 'flex';
            listContainer.style.justifyContent = 'flex-end';
            listContainer.style.alignItems = 'flex-end';
            listContainer.style.alignSelf = 'end';
            listContainer.style.width = 'auto';
            listContainer.style.marginLeft = 'auto';
            listContainer.style.paddingRight = '8px';
            listContainer.style.boxSizing = 'border-box';
          }

          function ensureDesktopButton(modalSelector) {
            var modal = document.querySelector(modalSelector);
            if (!modal) return;
            var action = modal.querySelector('.atEQPOIVFSDFSDG-details-action');
            if (!action) return;
            action.style.display = 'flex';
            action.style.alignItems = 'center';
            action.style.gap = '12px';

            var originalButton = action.querySelector('.atEQPOIVFSDFSDG-details-dealact-copy');
            var href = originalButton ? originalButton.getAttribute('href') : '';
            var code = originalButton ? originalButton.getAttribute('data-code') : '';
            var fallbackButton = action.querySelector('.at-fixed-link-btn');

            if (!fallbackButton) {
              fallbackButton = document.createElement('a');
              fallbackButton.className = 'at-fixed-link-btn atEQPOIVFSDFSDG-btnGoToLinkAff';
              fallbackButton.target = '_blank';
              action.appendChild(fallbackButton);
            }

            fallbackButton.textContent = 'L\\u1EA5y link';
            fallbackButton.setAttribute('aria-label', 'L\\u1EA5y link');
            fallbackButton.setAttribute('href', href || '#');
            fallbackButton.setAttribute('data-code', code || '');

            if (originalButton) {
              originalButton.textContent = 'L\\u1EA5y link';
              originalButton.setAttribute('aria-label', 'L\\u1EA5y link');
              originalButton.style.display = 'inline-flex';
              originalButton.style.alignItems = 'center';
              originalButton.style.justifyContent = 'center';
              originalButton.style.minWidth = '132px';
              originalButton.style.padding = '10px 16px';
              originalButton.style.opacity = '1';
              originalButton.style.visibility = 'visible';
            }
          }

          ensureDesktopButton('#myModalDesktop');
          ensureDesktopButton('#myModalNextCouponDesktop');

          var desktopButtons = document.querySelectorAll(
            '#myModalDesktop .atEQPOIVFSDFSDG-details-dealact-copy, #myModalNextCouponDesktop .atEQPOIVFSDFSDG-details-dealact-copy'
          );
          for (var i = 0; i < desktopButtons.length; i += 1) {
            var desktopButton = desktopButtons[i];
            desktopButton.textContent = 'L\\u1EA5y link';
            desktopButton.setAttribute('aria-label', 'L\\u1EA5y link');
          }

          var mobileButtons = document.querySelectorAll(
            '#myModal .atEQPOIVFSDFSDG-details-dealact-copy-vmb a, #myModalNextCoupon .atEQPOIVFSDFSDG-details-dealact-copy-vmb a, #myModal .atEQPOIVFSDFSDG-details-copy-btn-large, #myModalNextCoupon .atEQPOIVFSDFSDG-details-copy-btn-large'
          );
          for (var j = 0; j < mobileButtons.length; j += 1) {
            var mobileButton = mobileButtons[j];
            mobileButton.setAttribute('aria-label', 'L\\u1EA5y link');
            if (mobileButton.classList.contains('atEQPOIVFSDFSDG-details-copy-btn-large')) {
              mobileButton.textContent = 'L\\u1EA5y link';
              continue;
            }
            var image = mobileButton.querySelector('img');
            mobileButton.textContent = 'L\\u1EA5y link';
            if (image) {
              mobileButton.prepend(image);
            }
          }
        }
        fitLayout();
        labelSearchButton();
        patchDetailButtons();
        setInterval(function () {
          fitLayout();
          labelSearchButton();
          patchDetailButtons();
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
