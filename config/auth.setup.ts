    import { test as setup } from "@playwright/test";
    import * as fs from "fs";
    import * as path from "path";
    import { ENV } from "../config/env.config";
    import { LoginPage } from "../pages/LoginPage.PO";

    const AUTH_DIR = path.resolve(process.cwd(), ".auth");

    // setup("authenticate all users", async ({ browser }) => {
    //     fs.mkdirSync(AUTH_DIR, { recursive: true });

    //     await Promise.all(
    //         Object.values(ENV.USERS).map(async (credentials) => {
    //             const context = await browser.newContext({ baseURL: ENV.BASE_URL });
    //             const page = await context.newPage();
    //             const loginPage = new LoginPage(page);
    //             await loginPage.goto();
    //             await loginPage.loginAs(credentials.username, credentials.password);
    //             await context.storageState({ path: credentials.authFile });
    //             await context.close();
    //         })
    //     );
    // });

    //using this over promise.all implementation as this is more verbose in terms of which user is getting authenticated
    setup("authenticate all users", async ({ browser }) => {
    fs.mkdirSync(AUTH_DIR, { recursive: true });

    for (const [key, credentials] of Object.entries(ENV.USERS)) {
        console.log(`\n→ Authenticating: ${key}`);
        const context = await browser.newContext({ baseURL: ENV.BASE_URL });
        const page = await context.newPage();
        const loginPage = new LoginPage(page);
        await loginPage.goto();
        await loginPage.loginAs(credentials.username, credentials.password);
        await context.storageState({ path: credentials.authFile });
        await context.close();
        console.log(`✅ Done: ${key}`);
    }
});