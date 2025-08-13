import { expect, test } from "@playwright/test";
import { PageUtils } from "../../src/PageUtils.ts";
import { setupWebEnvExtensions } from "../../src/webEnvExtensions/setupWebEnvExtensions.ts";

test.describe("Web env", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/");
        PageUtils.pipeWebConsoleToStdout(page);
        await setupWebEnvExtensions(page);
    });

    test.describe("web", () => {
        test("should set window.playwrightUtils", async ({ page }) => {
            const isOk = await page.evaluate(() => {
                if (typeof window.playwrightUtils !== "object") {
                    throw new Error("window.playwrightUtils is not an object");
                }
                if (typeof window.playwrightUtils.setChalkColorSupportLevel !== "function") {
                    throw new Error("window.playwrightUtils.setChalkColorSupportLevel is not a function");
                }
                if (typeof window.playwrightUtils.assertions !== "object") {
                    throw new Error("window.playwrightUtils.assertions is not a object");
                }
                if (typeof window.playwrightUtils.expect !== "function") {
                    throw new Error("window.playwrightUtils.expect is not a function");
                }
                if (typeof window.playwrightUtils.comparators !== "object") {
                    throw new Error("window.playwrightUtils.comparators is not an object");
                }
                if (typeof window.playwrightUtils.convertDataFromSerializable !== "function") {
                    throw new Error("window.playwrightUtils.convertDataFromSerializable is not a function");
                }
                if (typeof window.playwrightUtils.convertDataToSerializable !== "function") {
                    throw new Error("window.playwrightUtils.convertDataToSerializable is not a function");
                }
                return true;
            });
            expect(isOk).toBe(true);
        });
    });
});
