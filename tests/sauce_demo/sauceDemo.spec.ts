import { test, expect } from "../fixtures/index.fixture"
import { InventoryPage } from "../pages/InventoryPage.PO";
import { LoginPage } from "../pages/LoginPage.PO";
import { ENV } from "../config/env.config";

test('Standard User Inventory Loads', async ({ standardUserContext, logger }) => {

    const page = await standardUserContext.newPage();
    const inventoryPage = new InventoryPage(page);

    await logger.step(`Navigate to Inventory page for ${ENV.SAUCE_DEMO.USERS.standardUser.username}`, async () => {
        await inventoryPage.goto();
    });
    await inventoryPage.assertInventoryPageLoaded();
});

test('Locked Out User Inventory Loads', async ({ lockedOutUserContext, logger }) => {

    const page = await lockedOutUserContext.newPage();
    const loginPage = new LoginPage(page);
    await logger.step(`Navigate to Login page for ${ENV.SAUCE_DEMO.USERS.lockedOutUser.username}`, async () => {
        await page.goto(ENV.SAUCE_DEMO.BASE_URL);
    });
    await loginPage.loginAs(
        ENV.SAUCE_DEMO.USERS.lockedOutUser.username,
        ENV.SAUCE_DEMO.USERS.lockedOutUser.password
    );
    await loginPage.verifyLockedoutMessageForLockedOutUser();
});

test('Problem User Inventory Loads', async ({ problemUserContext, logger }) => {

    const page = await problemUserContext.newPage();
    const inventoryPage = new InventoryPage(page);
    await logger.step(`Navigate to Inventory page for ${ENV.SAUCE_DEMO.USERS.problemUser.username}`, async () => {
        await inventoryPage.goto();
    });
    await inventoryPage.assertInventoryPageLoaded();
});



test('Performance Glitch User Page Inventory Loads', async ({ performanceGlitchUserContext, logger }) => {

    const page = await performanceGlitchUserContext.newPage();
    const inventoryPage = new InventoryPage(page);
    await logger.step(`Navigate to Inventory page for ${ENV.SAUCE_DEMO.USERS.performanceGlitchUser.username}`, async () => {
        await inventoryPage.goto();
    });
    await inventoryPage.assertInventoryPageLoaded();

});

test('Error User Page Inventory Loads', async ({ errorUserContext, logger }) => {

    const page = await errorUserContext.newPage();
    const inventoryPage = new InventoryPage(page);
    await logger.step(`Navigate to Inventory page for ${ENV.SAUCE_DEMO.USERS.errorUser.username}`, async () => {
        await inventoryPage.goto();
    });
    await inventoryPage.assertInventoryPageLoaded();

});

test('Visual User Page Inventory Loads', async ({ visualUserContext, logger }) => {

    const page = await visualUserContext.newPage();
    const inventoryPage = new InventoryPage(page);
    await logger.step(`Navigate to Inventory page for ${ENV.SAUCE_DEMO.USERS.visualUser.username}`, async () => {
        await inventoryPage.goto();
    });
    await inventoryPage.assertInventoryPageLoaded();

});