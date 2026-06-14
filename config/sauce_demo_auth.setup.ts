import { test as setup } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";
import { ENV } from "../config/env.config";
import { LoginPage } from "../pages/LoginPage.PO";

const AUTH_DIR = path.resolve(process.cwd(), ".auth");

// setup("authenticate all sauce demo users", async ({ browser }) => {
//     fs.mkdirSync(AUTH_DIR, { recursive: true });

//     await Promise.all(
//         Object.values(ENV.SAUCE_DEMO_USERS).map(async (credentials) => {
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
setup("authenticate all sauce demo users", async ({ browser }) => {
    fs.mkdirSync(AUTH_DIR, { recursive: true });

    for (const [key, credentials_sauce_demo] of Object.entries(ENV.SAUCE_DEMO.USERS)) {
        console.log(`\n→ Authenticating SauceDemo User : ${key}`);
        const context = await browser.newContext({ baseURL: ENV.SAUCE_DEMO.BASE_URL });
        const page = await context.newPage();
        const loginPage = new LoginPage(page);
        await loginPage.goto();
        await loginPage.loginAs(credentials_sauce_demo.username, credentials_sauce_demo.password);
        await context.storageState({ path: credentials_sauce_demo.authFile });
        await context.close();
        console.log(`✅ Done: ${key}`);
    }
});