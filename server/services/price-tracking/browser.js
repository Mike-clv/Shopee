import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';

function getTimeoutMs() {
  const parsed = Number.parseInt(process.env.PRICE_TRACKING_TIMEOUT_MS || '45000', 10);
  return Number.isFinite(parsed) ? parsed : 45000;
}

function getLocalChromeCandidates() {
  const platform = os.platform();

  if (platform === 'win32') {
    return [
      process.env.PUPPETEER_EXECUTABLE_PATH,
      'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
      'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
      path.join(process.env.LOCALAPPDATA || '', 'Google\\Chrome\\Application\\chrome.exe'),
      'C:\\Program Files\\Chromium\\Application\\chrome.exe',
      'C:\\Program Files (x86)\\Chromium\\Application\\chrome.exe',
      path.join(process.env.LOCALAPPDATA || '', 'Chromium\\Application\\chrome.exe'),
    ];
  }

  if (platform === 'darwin') {
    return [
      process.env.PUPPETEER_EXECUTABLE_PATH,
      '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
      '/Applications/Chromium.app/Contents/MacOS/Chromium',
    ];
  }

  return [
    process.env.PUPPETEER_EXECUTABLE_PATH,
    '/usr/bin/google-chrome-stable',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium-browser',
    '/usr/bin/chromium',
  ];
}

export function resolveLocalChromeExecutablePath() {
  return getLocalChromeCandidates().find((candidate) => candidate && fs.existsSync(candidate)) || '';
}

export async function launchPriceTrackingBrowser() {
  const timeout = getTimeoutMs();
  const isDevelopment = process.env.NODE_ENV === 'development' && !process.env.VERCEL;

  if (isDevelopment) {
    const executablePath = resolveLocalChromeExecutablePath();
    if (!executablePath) {
      throw new Error(
        'Khong tim thay Chrome/Chromium local. Hay cau hinh PUPPETEER_EXECUTABLE_PATH trong .env de chay theo doi gia.',
      );
    }

    return puppeteer.launch({
      executablePath,
      headless: true,
      defaultViewport: { width: 1366, height: 900 },
      ignoreHTTPSErrors: true,
      protocolTimeout: timeout,
      timeout,
      args: [
        '--no-first-run',
        '--no-default-browser-check',
        '--disable-dev-shm-usage',
      ],
    });
  }

  const executablePath = await chromium.executablePath();
  return puppeteer.launch({
    executablePath,
    headless: chromium.headless,
    defaultViewport: chromium.defaultViewport,
    ignoreHTTPSErrors: true,
    protocolTimeout: timeout,
    timeout,
    args: [
      ...chromium.args,
      '--disable-dev-shm-usage',
      '--hide-scrollbars',
      '--disable-background-networking',
      '--disable-renderer-backgrounding',
    ],
  });
}

export function getPriceTrackingTimeoutMs() {
  return getTimeoutMs();
}
