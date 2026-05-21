import { expect, test } from '@playwright/test';
import { TOKEN_STORAGE_KEY, signinViaApi } from './helpers';

/**
 * Organizer manager visits the dashboard. The seed plants
 * manager@livenation.ng (Password123!) as a MANAGER on the
 * livenation-ng org — same fixture used by the a11y suite.
 */

test('manager dashboard lists organizer events with status', async ({ page }) => {
  const token = await signinViaApi('manager@livenation.ng', 'Password123!');
  await page.addInitScript(
    ({ key, value }) => window.localStorage.setItem(key, value),
    { key: TOKEN_STORAGE_KEY, value: token },
  );
  await page.goto('/dashboard');
  // The dashboard pages show "Loading…" until the api.me() / overview
  // fetch resolves — networkidle settles before that React useEffect
  // fires the request, so we wait for the loading text to disappear
  // before asserting.
  await expect(page.getByText('Loading…')).toBeHidden({ timeout: 30_000 });
  await expect(page.getByText(/LiveNation/i).first()).toBeVisible();

  await page.goto('/dashboard/o/livenation-ng');
  await expect(page.getByText('Loading…')).toBeHidden({ timeout: 30_000 });
  await expect(page.getByText(/Davido/i).first()).toBeVisible();
});

test('manager can view analytics with all sections rendered', async ({ page }) => {
  const token = await signinViaApi('manager@livenation.ng', 'Password123!');
  await page.addInitScript(
    ({ key, value }) => window.localStorage.setItem(key, value),
    { key: TOKEN_STORAGE_KEY, value: token },
  );
  await page.goto('/dashboard/o/livenation-ng/analytics');
  await expect(page.getByText('Loading…')).toBeHidden({ timeout: 30_000 });
  // Stat cards
  await expect(page.getByText(/Gross revenue/i)).toBeVisible();
  await expect(page.getByText(/Avg\. order value/i)).toBeVisible();
  // Sections
  await expect(page.getByRole('heading', { name: /Revenue by day/i })).toBeVisible();
  await expect(page.getByRole('heading', { name: /Orders by hour/i })).toBeVisible();
  await expect(page.getByRole('heading', { name: /Top events/i })).toBeVisible();
  // Range toggle works — clicking 7d re-fetches; same Loading flicker.
  await page.getByRole('tab', { name: '7d' }).click();
  await expect(page.getByText('Loading…')).toBeHidden({ timeout: 30_000 });
  await expect(page.getByText(/Last 7 days/i)).toBeVisible();
});

test('admin can view the audit log', async ({ page }) => {
  const token = await signinViaApi('admin@computicket.ng', 'AdminPass123!');
  await page.addInitScript(
    ({ key, value }) => window.localStorage.setItem(key, value),
    { key: TOKEN_STORAGE_KEY, value: token },
  );
  await page.goto('/admin/audit-log');
  await page.waitForLoadState('networkidle');
  // The action-filter input is the most stable selector — Filter
  // button next to it could match other surfaces.
  await expect(page.getByPlaceholder(/Filter by action/i)).toBeVisible();
});
