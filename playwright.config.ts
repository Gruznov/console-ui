import { defineConfig } from "@playwright/test";

export default defineConfig({
  expect: {
    toHaveScreenshot: {
      animations: "disabled",
      maxDiffPixelRatio: 0.02,
      threshold: 0.25,
    },
  },
  fullyParallel: false,
  reporter: "list",
  retries: process.env.CI ? 1 : 0,
  snapshotPathTemplate: "{testDir}/__screenshots__/{arg}-{platform}{ext}",
  testDir: "./tests/visual",
  timeout: 30_000,
  use: {
    baseURL: "http://127.0.0.1:6106",
    colorScheme: "light",
    deviceScaleFactor: 1,
    locale: "en-US",
    reducedMotion: "reduce",
    timezoneId: "UTC",
  },
  webServer: {
    command: "npm run dev:visual --workspace @gruznov/storybook",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    url: "http://127.0.0.1:6106",
  },
  workers: 1,
});
