// @ts-check
const { test, expect } = require('@playwright/test');

// ── Login Tests ──────────────────────────────────────────────────────────────

test.describe('Login Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should show login form on first load', async ({ page }) => {
    await expect(page.locator('#loginSection')).toBeVisible();
    await expect(page.locator('#appSection')).toBeHidden();
    await expect(page.locator('#usernameInput')).toBeVisible();
    await expect(page.locator('#passwordInput')).toBeVisible();
    await expect(page.locator('#loginBtn')).toBeVisible();
  });

  test('should reject invalid credentials', async ({ page }) => {
    await page.fill('#usernameInput', 'wrong');
    await page.fill('#passwordInput', 'wrong');
    await page.click('#loginBtn');
    await expect(page.locator('#loginError')).toBeVisible();
  });

  test('should login with valid credentials', async ({ page }) => {
    await page.fill('#usernameInput', 'test');
    await page.fill('#passwordInput', 'test');
    await page.click('#loginBtn');
    await expect(page.locator('#appSection')).toBeVisible();
    await expect(page.locator('#loginSection')).toBeHidden();
  });
});

// ── Notes CRUD Tests ─────────────────────────────────────────────────────────

test.describe('Notes App', () => {
  test.beforeEach(async ({ page }) => {
    // Login first
    await page.goto('/');
    await page.fill('#usernameInput', 'test');
    await page.fill('#passwordInput', 'test');
    await page.click('#loginBtn');
    await expect(page.locator('#appSection')).toBeVisible();
  });

  test('should create a new note', async ({ page }) => {
    const countBefore = await page.locator('.note-card').count();
    await page.fill('#title', 'PW Test Note');
    await page.fill('#content', 'Created by Playwright automation.');
    await page.click('#addBtn');
    // New note should appear at the top (reverse order)
    await expect(page.locator('.note-card')).toHaveCount(countBefore + 1);
    await expect(page.locator('.note-card').first().locator('h3')).toContainText('PW Test Note');
  });

  test('should show alert when title is empty', async ({ page }) => {
    let dialogMsg = '';
    page.on('dialog', async (dialog) => {
      dialogMsg = dialog.message();
      await dialog.accept();
    });
    await page.fill('#content', 'Content only');
    await page.click('#addBtn');
    await page.waitForTimeout(500);
    expect(dialogMsg).toContain('fill in both');
  });

  test('should show alert when content is empty', async ({ page }) => {
    let dialogMsg = '';
    page.on('dialog', async (dialog) => {
      dialogMsg = dialog.message();
      await dialog.accept();
    });
    await page.fill('#title', 'Title only');
    await page.click('#addBtn');
    await page.waitForTimeout(500);
    expect(dialogMsg).toContain('fill in both');
  });

  test('should display multiple notes in reverse order', async ({ page }) => {
    const countBefore = await page.locator('.note-card').count();

    // Create first note
    await page.fill('#title', 'Older Note');
    await page.fill('#content', 'Older content');
    await page.click('#addBtn');
    await expect(page.locator('.note-card')).toHaveCount(countBefore + 1);

    // Create second note
    await page.fill('#title', 'Newer Note');
    await page.fill('#content', 'Newer content');
    await page.click('#addBtn');
    await expect(page.locator('.note-card')).toHaveCount(countBefore + 2);

    // Most recent note should appear first
    await expect(page.locator('.note-card').first().locator('h3')).toContainText('Newer Note');
  });
});
