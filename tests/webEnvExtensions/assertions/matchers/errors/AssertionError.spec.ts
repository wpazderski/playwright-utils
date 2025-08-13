import { expect, test } from "@playwright/test";
import { PageUtils } from "../../../../../src/PageUtils.ts";
import { setupWebEnvExtensions } from "../../../../../src/webEnvExtensions/setupWebEnvExtensions.ts";

test.describe("Web env", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/");
        PageUtils.pipeWebConsoleToStdout(page);
        await setupWebEnvExtensions(page);
    });

    test.describe("AssertionError", () => {
        test.describe("instance", () => {
            test("should be an instance of Error", async ({ page }) => {
                const isOk = await page.evaluate(() => {
                    const error = new window.playwrightUtils.assertions.matchers.errors.AssertionError("Test123", "toStrictEqual", { isNot: false });
                    return error instanceof Error;
                });
                expect(isOk).toBe(true);
            });

            test("should have message that includes the subject", async ({ page }) => {
                const isOk = await page.evaluate(() => {
                    const warning = new window.playwrightUtils.assertions.matchers.errors.AssertionError("Test123", "toStrictEqual", { isNot: false });
                    return warning.message.includes("Test123");
                });
                expect(isOk).toBe(true);
            });

            test("should have message that includes internalOptions.message", async ({ page }) => {
                const isOk = await page.evaluate(() => {
                    const warning = new window.playwrightUtils.assertions.matchers.errors.AssertionError("Test123", "toStrictEqual", { isNot: false, message: "Custom message" });
                    return warning.message.includes("Custom message");
                });
                expect(isOk).toBe(true);
            });
        });
    });
});
