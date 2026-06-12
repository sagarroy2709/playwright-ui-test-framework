import { Page, Locator, expect } from "@playwright/test"
import { BasePage } from "./BasePage";

export class LoginPage extends BasePage {
    
    protected readonly path = '/';
    private readonly usernameInput: Locator;
    private readonly passwordInput: Locator;
    private readonly signInButton: Locator;
    private readonly lockedOutLabel: Locator;

    constructor(page: Page) {
        super(page);
        this.usernameInput = page.getByRole('textbox', { name: 'Username' });
        this.passwordInput = page.getByRole('textbox', { name: 'Password' });
        this.signInButton = page.locator('[data-test="login-button"]');
        this.lockedOutLabel = page.getByRole('heading', { name: /Epic sadface: Sorry, this user has been locked out\./i });
    }

    private async fillUsername(username: string) {
        await this.fill(this.usernameInput, username);
    }

    private async fillPassword(password: string) {
        await this.fill(this.passwordInput, password);
    }

    private async submit() {
        await this.click(this.signInButton);
    }

    async loginAs(username: string, password: string) {
        await this.fillUsername(username);
        await this.fillPassword(password);
        await this.submit();
    }

    async verifyLockedoutMessageForLockedOutUser() {
        await expect(this.lockedOutLabel).toBeVisible();
        // await expect(this.lockedOutLabel).not.toBeVisible();
    }

    protected async waitForPageLoad(): Promise<void> {
        await this.usernameInput.waitFor({state: 'visible'});
    }

}