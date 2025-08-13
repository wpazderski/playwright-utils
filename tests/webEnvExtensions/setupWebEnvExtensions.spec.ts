import { expect, test } from "@playwright/test";
import { DIM_COLOR } from "jest-matcher-utils";
import { PageUtils } from "../../src/PageUtils.ts";
import { setupWebEnvExtensions } from "../../src/webEnvExtensions/setupWebEnvExtensions.ts";

test.describe("Node.js env", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/");
        PageUtils.pipeWebConsoleToStdout(page);
    });

    test.describe("setupWebEnvExtensions()", () => {
        test("should set Chalk color support level", async ({ page }) => {
            await setupWebEnvExtensions(page);
            const isOk = await page.evaluate(
                ([level]) => {
                    return window.playwrightUtils.getChalkColorSupportLevel() === level;
                },
                [DIM_COLOR.level] as const,
            );
            expect(isOk).toBe(true);
        });

        test("should wait for window.playwrightUtils to be defined", async ({ page }) => {
            await setupWebEnvExtensions(page);
            const isOk = await page.evaluate(() => {
                // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                return typeof window.playwrightUtils === "object" && window.playwrightUtils !== null;
            });
            expect(isOk).toBe(true);
        });
    });
});
