import { test as base, Browser, BrowserContext } from "@playwright/test";
import { ENV, SauceDemoUserKey } from "../config/env.config";
import * as fs from "fs";

type AuthFixtures = {
    standardUserContext: BrowserContext;
    lockedOutUserContext: BrowserContext;
    problemUserContext: BrowserContext;
    performanceGlitchUserContext: BrowserContext;
    errorUserContext: BrowserContext;
    visualUserContext: BrowserContext;
    salesforceContext: BrowserContext;
};

function createSauceDemoContext(browser: Browser, userKey: SauceDemoUserKey) {
    return browser.newContext({
        storageState: ENV.SAUCE_DEMO.USERS[userKey].authFile,
    });
}

// Salesforce — reads saved sessionId and injects as sid cookie
async function createSalesforceContext(browser: Browser) {
    const { sessionId, instanceUrl } = JSON.parse(
        fs.readFileSync(ENV.SALESFORCE.USER.authFile, "utf-8")
    );
    const context = await browser.newContext({ baseURL: instanceUrl });
    await context.addCookies([{
        name: "sid",
        value: sessionId,
        domain: new URL(instanceUrl).hostname,
        path: "/",
        secure: true,
        httpOnly: true,
    }]);
    return context;
}

export const authTest = base.extend<AuthFixtures>({
    standardUserContext: async ({ browser }, use) => {
        const context = await createSauceDemoContext(browser, "standardUser");
        await use(context);
        await context.close();
    },
    lockedOutUserContext: async ({ browser }, use) => {
        const context = await createSauceDemoContext(browser, "lockedOutUser");
        await use(context);
        await context.close();
    },
    problemUserContext: async ({ browser }, use) => {
        const context = await createSauceDemoContext(browser, "problemUser");
        await use(context);
        await context.close();
    },
    performanceGlitchUserContext: async ({ browser }, use) => {
        const context = await createSauceDemoContext(browser, "performanceGlitchUser");
        await use(context);
        await context.close();
    },
    errorUserContext: async ({ browser }, use) => {
        const context = await createSauceDemoContext(browser, "errorUser");
        await use(context);
        await context.close();
    },
    visualUserContext: async ({ browser }, use) => {
        const context = await createSauceDemoContext(browser, "visualUser");
        await use(context);
        await context.close();
    },
    salesforceContext: async ({ browser }, use) => {
        const context = await createSalesforceContext(browser);
        await use(context);
        await context.close();
    },
});