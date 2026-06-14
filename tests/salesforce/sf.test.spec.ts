import {test, expect} from "fixtures/index.fixture"
import { ENV } from "config/env.config";

// ─── Test ─────────────────────────────────────────────────────────────────────
test('Salesforce login bypass via session cookie', async ({ salesforceContext }) => {

    const page = await salesforceContext.newPage();

    await page.goto("/lightning/setup/SetupOneHome/home");  // instanceUrl is already the baseURL

    // Wait for Setup Quick Find — only visible when Setup has fully loaded
    await page.getByRole('searchbox', { name: 'Quick Find' }).waitFor({ state: 'visible', timeout: 30000 });

    // Then assert
    await expect(page.getByRole('heading', { name: 'Welcome, Sagar' })).toBeVisible();

    console.log('Login bypassed successfully via session cookie!');

});