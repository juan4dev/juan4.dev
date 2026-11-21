import { test, expect } from '@playwright/test';

test('home loads its assets and the project navigation works', async ({ page, baseURL }) => {
  const failures = [];
  page.on('pageerror', error => failures.push(error.message));
  page.on('response', response => {
    if (new URL(response.url()).origin === new URL(baseURL).origin && response.status() >= 400) {
      failures.push(`${response.status()} ${response.url()}`);
    }
  });

  const response = await page.goto('/');
  expect(response.status()).toBe(200);
  await expect(page.locator('main h1')).toBeVisible();
  await page.locator('header a[href="/#projects"]').click();
  await expect(page).toHaveURL(/#projects$/);
  const projectImage = page.locator('#projects img').first();
  await expect(projectImage).toBeInViewport();
  await expect.poll(() => projectImage.evaluate(image => image.complete && image.naturalWidth > 0)).toBe(true);
  expect(failures).toEqual([]);
});

test('theme can be selected with the keyboard and survives a reload', async ({ page }) => {
  await page.goto('/');
  const toggle = page.getByRole('button', { name: 'Choose color theme' });
  await toggle.focus();
  await page.keyboard.press('Enter');
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await page.getByRole('button', { name: 'Dark', exact: true }).focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('html')).toHaveClass(/dark/);
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(toggle).toBeFocused();
  await page.reload();
  await expect(page.locator('html')).toHaveClass(/dark/);
  await toggle.click();
  await page.getByRole('button', { name: 'Light', exact: true }).click();
  await expect(page.locator('html')).not.toHaveClass(/dark/);
});
