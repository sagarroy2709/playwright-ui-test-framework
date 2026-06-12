import { Page, Locator, expect } from '@playwright/test';

export abstract class BasePage {

    protected readonly page: Page;
    protected abstract readonly path: string;
    protected abstract waitForPageLoad(): Promise<void>;

    constructor(page: Page) {
        this.page = page;
    }


    //Most of the methods in this class are passthroughs
    //The reason for keeping them here is to enforce consistency and maintainability

    // ─────────────────────────────────────────────────────────────────────────
    // Navigation
    // ─────────────────────────────────────────────────────────────────────────

    async goto(): Promise<void> {
        await this.page.goto(this.path);
        await this.waitForPageLoad();
    }

    async reload(): Promise<void> {
        await this.page.reload();
        await this.waitForPageLoad();
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Interactions
     // ─────────────────────────────────────────────────────────────────────────

    async click(locator: Locator, timeout?: number): Promise<void> {
        await locator.click({ timeout });
    }

    async fill(locator: Locator, value: string, timeout?: number): Promise<void> {
        await locator.clear({ timeout });
        await locator.fill(value, { timeout });
    }

    async check(locator: Locator, timeout?: number): Promise<void> {
        await locator.check({ timeout });
    }

    async uncheck(locator: Locator, timeout?: number): Promise<void> {
        await locator.uncheck({ timeout });
    }

    async selectOption(locator: Locator, value: string, timeout?: number): Promise<void> {
        await locator.selectOption({ label: value }, { timeout });
    }

    async hover(locator: Locator, timeout?: number): Promise<void> {
        await locator.hover({ timeout });
    }

    async pressKey(locator: Locator, key: string, timeout?: number): Promise<void> {
        await locator.press(key, { timeout });
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Assertions
    // ─────────────────────────────────────────────────────────────────────────

    async assertVisible(locator: Locator, timeout?: number): Promise<void> {
        await expect(locator).toBeVisible({ timeout });
    }

    async assertHidden(locator: Locator, timeout?: number): Promise<void> {
        await expect(locator).toBeHidden({ timeout });
    }

    async assertText(locator: Locator, text: string | RegExp, timeout?: number): Promise<void> {
        await expect(locator).toHaveText(text, { timeout });
    }

    async assertContainsText(locator: Locator, text: string | RegExp, timeout?: number): Promise<void> {
        await expect(locator).toContainText(text, { timeout });
    }

    async assertInputValue(locator: Locator, value: string, timeout?: number): Promise<void> {
        await expect(locator).toHaveValue(value, { timeout });
    }

    async assertEnabled(locator: Locator, timeout?: number): Promise<void> {
        await expect(locator).toBeEnabled({ timeout });
    }

    async assertDisabled(locator: Locator, timeout?: number): Promise<void> {
        await expect(locator).toBeDisabled({ timeout });
    }

    async assertURL(pattern: string | RegExp, timeout?: number): Promise<void> {
        await expect(this.page).toHaveURL(pattern, { timeout });
    }

    async assertTitle(title: string | RegExp, timeout?: number): Promise<void> {
        await expect(this.page).toHaveTitle(title, { timeout });
    }

    async assertCount(locator: Locator, count: number, timeout?: number): Promise<void> {
        await expect(locator).toHaveCount(count, { timeout });
    }

    // ─────────────────────────────────────────────────────────────────────────
    // State queries
    // Conditional logic only — not assertions.
    // ─────────────────────────────────────────────────────────────────────────

    async isVisible(locator: Locator): Promise<boolean> {
        return locator.isVisible();
    }

    async isEnabled(locator: Locator): Promise<boolean> {
        return locator.isEnabled();
    }

    async isChecked(locator: Locator): Promise<boolean> {
        return locator.isChecked();
    }

    async getText(locator: Locator): Promise<string> {
        return (await locator.textContent()) ?? '';
    }

    async getInputValue(locator: Locator): Promise<string> {
        return locator.inputValue();
    }
}