import { type WindowEx, testMatcher } from "./testMatcher.testUtils.ts";

// eslint-disable-next-line playwright/require-hook
testMatcher("toContain", {
    beforeEach: async (page) => {
        await page.evaluate(() => {
            (window as unknown as WindowEx).testCases = {
                pass: [
                    {
                        name: "string contains substring",
                        value: "lorem ipsum",
                        matcherArgs: ["em ip"],
                    },
                    {
                        name: "array contains value",
                        value: [1, 2, 3],
                        matcherArgs: [2],
                    },
                    {
                        name: "Set contains value",
                        value: new Set([1, 2, 3]),
                        matcherArgs: [2],
                    },
                ],
                fail: [
                    {
                        name: "string does not contain substring",
                        value: "lorem ipsum",
                        matcherArgs: ["dolor"],
                    },
                    {
                        name: "array does not contain value",
                        value: [1, 2, 3],
                        matcherArgs: [4],
                    },
                    {
                        name: "Set does not contain value",
                        value: new Set([1, 2, 3]),
                        matcherArgs: [4],
                    },
                    {
                        name: "number",
                        value: 123,
                        matcherArgs: [3],
                    },
                    {
                        name: "bigint",
                        value: 1234567890123456789012345678901234567890n,
                        matcherArgs: [3],
                    },
                    {
                        name: "boolean",
                        value: true,
                        matcherArgs: [3],
                    },
                    {
                        name: "function",
                        value: () => {},
                        matcherArgs: [3],
                    },
                    {
                        name: "symbol",
                        value: Symbol("test"),
                        matcherArgs: [3],
                    },
                    {
                        name: "object",
                        value: { id: "123" },
                        matcherArgs: [3],
                    },
                ],
                alwaysFail: [
                    {
                        name: "null",
                        value: null,
                        matcherArgs: [3],
                    },
                    {
                        name: "undefined",
                        value: undefined,
                        matcherArgs: [3],
                    },
                ],
            };
        });
    },
});
