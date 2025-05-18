import { test, expect } from '@playwright/test';

test('can add and persist todos on full app page', async ({ page }) => {
  await page.goto('/');

  // Add todo
  const input = page.getByPlaceholder('Add a new todo...');
  const addBtn = page.getByRole('button', { name: /add/i });

  await input.fill('From full app test');
  await addBtn.click();

  // Confirm it exists
  await expect(page.getByText('From full app test')).toBeVisible();

  // Reload and confirm persistence
  await page.reload();
  await expect(page.getByText('From full app test')).toBeVisible();
});

