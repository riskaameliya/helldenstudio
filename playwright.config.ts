import { defineConfig } from "@playwright/test";

const baseURL = "http://127.0.0.1:3180";

export default defineConfig({
  testDir: "./tests/e2e",
  use: {
    baseURL,
    browserName: "chromium",
    launchOptions: { args: ["--enable-unsafe-swiftshader"] },
  },
  webServer: {
    command: "npm run start -- --hostname 127.0.0.1 --port 3180",
    url: baseURL,
  },
  reporter: "list",
});
