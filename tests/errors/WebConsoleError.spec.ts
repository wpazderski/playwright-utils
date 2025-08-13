import { type ConsoleMessage, expect, test } from "@playwright/test";
import { WebConsoleError } from "../../src/errors/WebConsoleError.ts";

test.describe("Node.js env", () => {
    test.describe("WebConsoleError", () => {
        test.describe("instance", () => {
            test("should be an instance of Error", () => {
                const msg: ConsoleMessage = {
                    args: () => [],
                    location: () => ({ url: "", lineNumber: 0, columnNumber: 0 }),
                    page: () => null,
                    text: () => "Test 123",
                    type: () => "error",
                };
                const error = new WebConsoleError(msg);
                expect(error).toBeInstanceOf(Error);
            });

            test("should have message that includes the subject", () => {
                const msg: ConsoleMessage = {
                    args: () => [],
                    location: () => ({ url: "", lineNumber: 0, columnNumber: 0 }),
                    page: () => null,
                    text: () => "Test 123",
                    type: () => "error",
                };
                const error = new WebConsoleError(msg);
                expect(error.message).toContain("Test 123");
            });
        });
    });
});
