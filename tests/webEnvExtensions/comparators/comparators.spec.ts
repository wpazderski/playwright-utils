import { expect, test } from "@playwright/test";
import { PageUtils } from "../../../src/PageUtils.ts";
import { setupWebEnvExtensions } from "../../../src/webEnvExtensions/setupWebEnvExtensions.ts";

test.describe("Web env", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/");
        PageUtils.pipeWebConsoleToStdout(page);
        await setupWebEnvExtensions(page);
    });

    test.describe("comparators", () => {
        test.describe(".objectId", () => {
            test("should correctly compare objects with 'id' property", async ({ page }) => {
                const isOk = await page.evaluate(() => {
                    const obj = { abc: 123 };
                    const a = { id: "123" };
                    const b = { id: "123" };
                    const c = { id: "456" };
                    const d = { id: {}, extra: "data1" };
                    const e = { id: {}, extra: "data2" };
                    const f = { id: obj, extra: "data3" };
                    const g = { id: obj, extra: "data4" };
                    if (window.playwrightUtils.comparators.objectId(a, b) === false) {
                        return false;
                    }
                    if (window.playwrightUtils.comparators.objectId(a, c) === true) {
                        return false;
                    }
                    if (window.playwrightUtils.comparators.objectId(d, e) === true) {
                        return false;
                    }
                    if (window.playwrightUtils.comparators.objectId(f, g) === false) {
                        return false;
                    }
                    if (window.playwrightUtils.comparators.objectId(null, undefined) === true) {
                        return false;
                    }
                    return true;
                });
                expect(isOk).toBe(true);
            });
        });

        test.describe(".strictlyEqual", () => {
            test("should correctly compare values with strict equality", async ({ page }) => {
                const isOk = await page.evaluate(() => {
                    const a = 123;
                    const b = 123;
                    const c = "123";
                    const d = { id: "123" };
                    const e = { id: "123" };
                    if (window.playwrightUtils.comparators.strictlyEqual(a, b) === false) {
                        return false;
                    }
                    if (window.playwrightUtils.comparators.strictlyEqual(a, c) === true) {
                        return false;
                    }
                    if (window.playwrightUtils.comparators.strictlyEqual(d, e) === true) {
                        return false;
                    }
                    if (window.playwrightUtils.comparators.strictlyEqual(e, e) === false) {
                        return false;
                    }
                    if (window.playwrightUtils.comparators.strictlyEqual(null, undefined) === true) {
                        return false;
                    }
                    return true;
                });
                expect(isOk).toBe(true);
            });
        });

        test.describe(".looselyEqual", () => {
            test("should correctly compare values with loose equality", async ({ page }) => {
                const isOk = await page.evaluate(() => {
                    const a = 123;
                    const b = "123";
                    const c = { id: "123" };
                    const d = { id: "123" };
                    if (window.playwrightUtils.comparators.looselyEqual(a, b) === false) {
                        return false;
                    }
                    if (window.playwrightUtils.comparators.looselyEqual(c, d) === true) {
                        return false;
                    }
                    if (window.playwrightUtils.comparators.looselyEqual(c, c) === false) {
                        return false;
                    }
                    if (window.playwrightUtils.comparators.looselyEqual(null, undefined) === false) {
                        return false;
                    }
                    return true;
                });
                expect(isOk).toBe(true);
            });
        });
    });
});
