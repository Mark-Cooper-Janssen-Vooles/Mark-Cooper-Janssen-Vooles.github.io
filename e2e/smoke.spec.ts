import { devices, expect, test, type Page } from '@playwright/test';

function collectErrors(page: Page) {
  const errors: string[] = [];
  page.on('console', (msg) => msg.type() === 'error' && errors.push(msg.text()));
  page.on('pageerror', (err) => errors.push(err.message));
  return errors;
}

test('renders the artwork, name and links without errors', async ({ page }) => {
  const errors = collectErrors(page);
  await page.goto('/');

  await expect(page.locator('.stage canvas')).toBeVisible();
  await expect(page.locator('.stage')).toHaveAttribute('data-interactive', 'true');
  await expect(page.getByRole('heading', { level: 1, name: 'Mark Janssen-Vooles' })).toBeVisible();
  await expect(page.getByTestId('name-strip')).toHaveText('MARK JANSSEN-VOOLES');
  const tagline = await page.getByText('FULL STACK SOFTWARE ENGINEER').boundingBox();
  const linkedInBox = await page.getByRole('link', { name: 'LinkedIn' }).boundingBox();
  expect(tagline!.x + tagline!.width).toBeLessThanOrEqual(linkedInBox!.x);
  expect(tagline!.x).toBeGreaterThan(page.viewportSize()!.width / 2);
  expect(Math.abs(tagline!.y + tagline!.height / 2 - (linkedInBox!.y + linkedInBox!.height / 2))).toBeLessThan(2);

  const scrolls = await page.evaluate(() => document.documentElement.scrollHeight > window.innerHeight);
  expect(scrolls).toBe(false);

  const linkedIn = page.getByRole('link', { name: 'LinkedIn' });
  const gitHub = page.getByRole('link', { name: 'GitHub' });
  await expect(linkedIn).toHaveAttribute('href', 'https://www.linkedin.com/in/mark-janssen-vooles-312a77187/');
  await expect(gitHub).toHaveAttribute('href', 'https://github.com/Mark-Cooper-Janssen-Vooles/');
  for (const link of [linkedIn, gitHub]) await expect(link).toHaveAttribute('target', '_blank');

  expect(errors).toEqual([]);
});

test('keeps the artwork cursor over the name', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.stage')).toHaveAttribute('data-interactive', 'true');
  const cursor = (selector: string) => page.locator(selector).first().evaluate((el) => getComputedStyle(el).cursor);
  expect(await cursor('.letter')).toBe(await cursor('.stage'));
});

test.describe('in a very wide window', () => {
  test.use({ viewport: { width: 2560, height: 1080 } });

  test('caps the name at 84px capitals, left-aligned', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => document.fonts.ready);
    const { capHeight, left, right } = await page.getByTestId('name-strip').evaluate((el) => {
      const style = getComputedStyle(el);
      const ctx = document.createElement('canvas').getContext('2d')!;
      ctx.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
      const rect = el.getBoundingClientRect();
      return { capHeight: ctx.measureText('H').actualBoundingBoxAscent, left: rect.left, right: rect.right };
    });
    expect(capHeight).toBeLessThanOrEqual(85);
    expect(capHeight).toBeGreaterThan(81);
    expect(left).toBe(20);
    expect(right).toBeLessThan(2560 - 100);
  });
});

test('flips a hovered letter', async ({ page }) => {
  await page.goto('/');
  const letter = page.locator('.letter').first();
  await letter.hover();
  await expect(letter).toHaveClass(/letter--flipping/);
});

test.describe('with reduced motion', () => {
  test.use({ reducedMotion: 'reduce' });

  test('does not flip a hovered letter', async ({ page }) => {
    await page.goto('/');
    const letter = page.locator('.letter').first();
    await letter.hover();
    await page.waitForTimeout(100);
    await expect(letter).not.toHaveClass(/letter--flipping/);
  });
});

test.describe('on a touch device', () => {
  const { defaultBrowserType, ...pixel } = devices['Pixel 7'];
  test.use(pixel);

  test('scratches with a touch drag', async ({ page }) => {
    await page.goto('/');
    const stage = page.locator('.stage');
    await expect(stage).toHaveAttribute('data-interactive', 'true');
    await expect(page.getByRole('link', { name: 'GitHub' })).toBeVisible();

    const box = (await stage.boundingBox())!;
    const cdp = await page.context().newCDPSession(page);
    const touch = (type: 'touchStart' | 'touchMove' | 'touchEnd', x = 0, y = 0) =>
      cdp.send('Input.dispatchTouchEvent', { type, touchPoints: type === 'touchEnd' ? [] : [{ x, y }] });

    await touch('touchStart', box.x + 100, box.y + 200);
    await expect(stage).toHaveAttribute('data-scratching', 'true');
    await touch('touchMove', box.x + 200, box.y + 260);
    await touch('touchEnd');
    await expect(stage).toHaveAttribute('data-scratching', 'false');
    expect(await page.evaluate(() => window.scrollY)).toBe(0);
  });
});
