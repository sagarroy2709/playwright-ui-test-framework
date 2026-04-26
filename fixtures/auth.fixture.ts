import { test as base, Browser, BrowserContext} from "@playwright/test";
import { ENV } from "../config/env.config";

type AuthFixtures = {
    standardUserContext: BrowserContext;
    lockedOutUserContext: BrowserContext;
    problemUserContext: BrowserContext;
    performanceGlitchUserContext: BrowserContext;
    errorUserContext: BrowserContext;
    visualUserContext: BrowserContext;
};
// 
async function createAuthContext(browser: Browser, authFile: string): Promise<BrowserContext> {
    const context = await browser.newContext({ storageState: authFile });
    return context;
}

export const authTest = base.extend<AuthFixtures>({

    standardUserContext: async ({ browser }, use) => {
        const context = await createAuthContext(browser, ENV.USERS.standardUser.authFile);
        await use(context);
        await context.close();
    },

    lockedOutUserContext: async ({ browser }, use) => {
        const context = await createAuthContext(browser, ENV.USERS.lockedOutUser.authFile);
        await use(context);
        await context.close();
    },

    problemUserContext: async ({ browser }, use) => {
        const context = await createAuthContext(browser, ENV.USERS.problemUser.authFile);
        await use(context);
        await context.close();
    },

    performanceGlitchUserContext: async ({ browser }, use) => {
        const context = await createAuthContext(browser, ENV.USERS.performanceGlitchUser.authFile);
        await use(context);
        await context.close();
    },

    errorUserContext: async ({ browser }, use) => {
        const context = await createAuthContext(browser, ENV.USERS.errorUser.authFile);
        await use(context);
        await context.close();
    },

    visualUserContext: async ({ browser }, use) => {
        const context = await createAuthContext(browser, ENV.USERS.visualUser.authFile);
        await use(context);
        await context.close();
    },
});