import { type WindowEx, testMatcher } from "../testMatcher.testUtils.ts";

// eslint-disable-next-line playwright/require-hook
testMatcher("anything", {
    beforeEach: async (page) => {
        await page.evaluate(() => {
            (window as unknown as WindowEx).testCases = {
                pass: [
                    {
                        name: "string",
                        value: "test123",
                        matcherArgs: [window.playwrightUtils.expect.anything()],
                    },
                    {
                        name: "number",
                        value: 123456,
                        matcherArgs: [window.playwrightUtils.expect.anything()],
                    },
                    {
                        name: "bigint",
                        value: 1234567890123456789012345678901234567890n,
                        matcherArgs: [window.playwrightUtils.expect.anything()],
                    },
                    {
                        name: "boolean",
                        value: true,
                        matcherArgs: [window.playwrightUtils.expect.anything()],
                    },
                    {
                        name: "function",
                        value: () => {},
                        matcherArgs: [window.playwrightUtils.expect.anything()],
                    },
                    {
                        name: "symbol",
                        value: Symbol("test"),
                        matcherArgs: [window.playwrightUtils.expect.anything()],
                    },
                    {
                        name: "object",
                        value: { id: "123" },
                        matcherArgs: [window.playwrightUtils.expect.anything()],
                    },
                    {
                        name: "array",
                        value: [1, 2, 3],
                        matcherArgs: [window.playwrightUtils.expect.anything()],
                    },
                ],
                fail: [
                    {
                        name: "null",
                        value: null,
                        matcherArgs: [window.playwrightUtils.expect.anything()],
                    },
                    {
                        name: "undefined",
                        value: undefined,
                        matcherArgs: [window.playwrightUtils.expect.anything()],
                    },
                ],
            };
        });
    },
});
