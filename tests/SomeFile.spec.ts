import { test, expect } from "../fixtures/index.fixture"
import { InventoryPage } from "../pages/InventoryPage.PO";
import { LoginPage } from "../pages/loginPage.PO";
import { ENV } from "../config/env.config";

test('Standard User Inventory Loads', async ({ standardUserContext }) => {

    const page = await standardUserContext.newPage();
    const inventoryPage = new InventoryPage(page);
    await inventoryPage.goto();
    await inventoryPage.assertInventoryPageLoaded();
});

test('Locked Out User Inventory Loads', async ({ lockedOutUserContext }) => {

    const page = await lockedOutUserContext.newPage();
    const loginPage = new LoginPage(page);
    loginPage.goto(ENV.BASE_URL);
    await loginPage.loginAs(
        ENV.USERS.lockedOutUser.username,
        ENV.USERS.lockedOutUser.password
    );
    await loginPage.verifyLockedoutMessageForLockedOutUser();
});

test('Problem User Inventory Loads', async ({ problemUserContext }) => {

    const page = await problemUserContext.newPage();
    const inventoryPage = new InventoryPage(page);
    await inventoryPage.goto();
    await inventoryPage.assertInventoryPageLoaded();
});



test('Performance Glitch User Page Inventory Loads', async ({ performanceGlitchUserContext }) => {

    const page = await performanceGlitchUserContext.newPage();
    const inventoryPage = new InventoryPage(page);
    await inventoryPage.goto();
    await inventoryPage.assertInventoryPageLoaded();

});

test('Error User Page Inventory Loads', async ({ errorUserContext }) => {

    const page = await errorUserContext.newPage();
    const inventoryPage = new InventoryPage(page);
    await inventoryPage.goto();
    await inventoryPage.assertInventoryPageLoaded();

});

test('Visual User Page Inventory Loads', async ({ visualUserContext }) => {

    const page = await visualUserContext.newPage();
    const inventoryPage = new InventoryPage(page);
    await inventoryPage.goto();
    await inventoryPage.assertInventoryPageLoaded();

});