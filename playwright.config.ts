import { defineConfig } from "@playwright/test";

const baseURL = "http://127.0.0.1:3180";

export default defineConfig({
  testDir: "./tests/e2e",
  use: { baseURL },
  projects: [
    {
      name: "chromium",
      use: {
        browserName: "chromium",
        launchOptions: { args: ["--enable-unsafe-swiftshader"] },
      },
    },
    ...(["firefox", "webkit"] as const).map((browserName) => ({
      name: browserName,
      testMatch:
        /(?:editorial-navigation|studio-exploration|release-layout)\.spec\.ts$/,
      use: { browserName },
    })),
  ],
  webServer: {
    command: "npm run start -- --hostname 127.0.0.1 --port 3180",
    url: baseURL,
  },
  reporter: "list",
});
