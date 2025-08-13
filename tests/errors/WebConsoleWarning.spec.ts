import { type ConsoleMessage, expect, test } from "@playwright/test";
import { WebConsoleWarning } from "../../src/errors/WebConsoleWarning.ts";

test.describe("Node.js env", () => {
    test.describe("WebConsoleWarning", () => {
        test.describe("instance", () => {
            test("should be an instance of Error", () => {
                const msg: ConsoleMessage = {
                    args: () => [],
                    location: () => ({ url: "", lineNumber: 0, columnNumber: 0 }),
                    page: () => null,
                    text: () => "Test 123",
                    type: () => "warning",
                };
                const warning = new WebConsoleWarning(msg);
                expect(warning).toBeInstanceOf(Error);
            });

            test("should have message that includes the subject", () => {
                const msg: ConsoleMessage = {
                    args: () => [],
                    location: () => ({ url: "", lineNumber: 0, columnNumber: 0 }),
                    page: () => null,
                    text: () => "Test 123",
                    type: () => "warning",
                };
                const warning = new WebConsoleWarning(msg);
                expect(warning.message).toContain("Test 123");
            });
        });
    });
});
