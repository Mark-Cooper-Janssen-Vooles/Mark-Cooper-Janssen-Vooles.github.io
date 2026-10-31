import { chromium } from '@playwright/test';

const url = process.argv[2] ?? 'http://localhost:4173/';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.goto(url);
await page.waitForSelector('.stage[data-interactive="true"]');
await page.waitForTimeout(500);
await page.screenshot({ path: 'public/og.png' });
await browser.close();
console.log('public/og.png captured from', url);
