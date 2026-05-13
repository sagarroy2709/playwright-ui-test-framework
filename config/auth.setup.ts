import { test as setup } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";
import { ENV } from "../config/env.config";
import { LoginPage } from "../pages/LoginPage.PO";

const AUTH_DIR = path.resolve(process.cwd(), ".auth");

setup("authenticate all users", async ({ browser }) => {
    fs.mkdirSync(AUTH_DIR, { recursive: true });

    await Promise.all(
        Object.values(ENV.USERS).map(async (credentials) => {
            const context = await browser.newContext({ baseURL: ENV.BASE_URL });
            const page = await context.newPage();
            const loginPage = new LoginPage(page);
            await loginPage.goto();
            await loginPage.loginAs(credentials.username, credentials.password);
            await context.storageState({ path: credentials.authFile });
            await context.close();
        })
    );
});