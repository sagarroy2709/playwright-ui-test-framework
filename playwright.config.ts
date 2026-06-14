import { defineConfig, devices } from '@playwright/test';
import './config/env.config';  // ← triggers env.config.ts to run
//   dotenv loads the correct .env file
//   process.env.BASE_URL is now populated

export default defineConfig({

  retries: process.env.CI ? 2 : 1,
  testDir: './tests',
  // /* Run tests in files in parallel */
  fullyParallel: true,
  reporter: [
    ['html', { open: 'never' }]
    //enable below and install allure-playwright to generate allure report
    // ,
    // ...(process.env.ALLURE === 'true'
    //   ? [['allure-playwright', { outputFolder: 'allure-results', suiteTitle: false }] as const]
    //   : []),
  ],
  timeout: 60000,
  expect: {
    timeout: 10000,
  },
  use: {
    baseURL: process.env.BASE_URL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'on-first-retry',
    headless: process.env.HEADED !== 'true',
    actionTimeout: 10000,
    navigationTimeout: 8000
  },

  // all projects always defined — --project flag filters at run time through --projects CLI flag
  projects: [
    // Runs once — logs in all 6 users, writes flat auth files to .auth/
    { name: "sauce_demo_auth_setup", testDir: "./config", testMatch: /sauce_demo_auth\.setup\.ts/ },
    { name: "salesforce_auth_setup", testDir: "./config", testMatch: /salesforce_auth\.setup\.ts/ },

    // ── SauceDemo test projects ───────────────────────────────────────
    // All three depend on the single setup — setup never runs more than once
    { name: "chromium", use: { ...devices["Desktop Chrome"] }, dependencies: ["sauce_demo_auth_setup"], testMatch: "**/sauce_demo/**/*.spec.ts", },
    { name: "firefox", use: { ...devices["Desktop Firefox"] }, dependencies: ["sauce_demo_auth_setup"], testMatch: "**/sauce_demo/**/*.spec.ts", },
    { name: "webkit", use: { ...devices["Desktop Safari"] }, dependencies: ["sauce_demo_auth_setup"], testMatch: "**/sauce_demo/**/*.spec.ts", },

    // ── Salesforce test projects ──────────────────────────────────────
    { name: "sf_chromium", use: { ...devices["Desktop Chrome"] }, dependencies: ["salesforce_auth_setup"], testMatch: "**/salesforce/**/*.spec.ts", },
  ],

});
