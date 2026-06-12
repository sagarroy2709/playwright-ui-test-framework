import { test as base, Browser, BrowserContext } from "@playwright/test";
import { ENV, UserKey } from "../config/env.config";

type AuthFixtures = {
    standardUserContext:          BrowserContext;
    lockedOutUserContext:         BrowserContext;
    problemUserContext:           BrowserContext;
    performanceGlitchUserContext: BrowserContext;
    errorUserContext:             BrowserContext;
    visualUserContext:            BrowserContext;
};

function createAuthContext(browser: Browser, userKey: UserKey) {
    return browser.newContext({
        storageState: ENV.USERS[userKey].authFile,
    });
}

export const authTest = base.extend<AuthFixtures>({
    standardUserContext: async ({ browser }, use) => {
        const context = await createAuthContext(browser, "standardUser");
        await use(context);
        await context.close();
    },
    lockedOutUserContext: async ({ browser }, use) => {
        const context = await createAuthContext(browser, "lockedOutUser");
        await use(context);
        await context.close();
    },
    problemUserContext: async ({ browser }, use) => {
        const context = await createAuthContext(browser, "problemUser");
        await use(context);
        await context.close();
    },
    performanceGlitchUserContext: async ({ browser }, use) => {
        const context = await createAuthContext(browser, "performanceGlitchUser");
        await use(context);
        await context.close();
    },
    errorUserContext: async ({ browser }, use) => {
        const context = await createAuthContext(browser, "errorUser");
        await use(context);
        await context.close();
    },
    visualUserContext: async ({ browser }, use) => {
        const context = await createAuthContext(browser, "visualUser");
        await use(context);
        await context.close();
    },
});