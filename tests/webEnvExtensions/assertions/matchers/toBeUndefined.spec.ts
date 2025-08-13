import { type WindowEx, testMatcher } from "./testMatcher.testUtils.ts";

// eslint-disable-next-line playwright/require-hook
testMatcher("toBeUndefined", {
    beforeEach: async (page) => {
        await page.evaluate(() => {
            (window as unknown as WindowEx).testCases = {
                pass: [
                    {
                        name: "undefined",
                        value: undefined,
                        matcherArgs: [],
                    },
                ],
                fail: [
                    {
                        name: "string",
                        value: "test123",
                        matcherArgs: [],
                    },
                    {
                        name: "number",
                        value: true,
                        matcherArgs: [123],
                    },
                    {
                        name: "number-float",
                        value: 123.45,
                        matcherArgs: [],
                    },
                    {
                        name: "number-zero",
                        value: 0,
                        matcherArgs: [],
                    },
                    {
                        name: "number-negative zero",
                        value: -0,
                        matcherArgs: [],
                    },
                    {
                        name: "NaN",
                        value: Number.NaN,
                        matcherArgs: [],
                    },
                    {
                        name: "infinity",
                        value: Number.POSITIVE_INFINITY,
                        matcherArgs: [],
                    },
                    {
                        name: "bigint",
                        value: 1234567890123456789012345678901234567890n,
                        matcherArgs: [],
                    },
                    {
                        name: "boolean-true",
                        value: true,
                        matcherArgs: [],
                    },
                    {
                        name: "boolean-false",
                        value: false,
                        matcherArgs: [],
                    },
                    {
                        name: "null",
                        value: null,
                        matcherArgs: [],
                    },
                    {
                        name: "function",
                        value: () => {},
                        matcherArgs: [],
                    },
                    {
                        name: "symbol",
                        value: Symbol("test"),
                        matcherArgs: [],
                    },
                    {
                        name: "object",
                        value: { id: "123" },
                        matcherArgs: [],
                    },
                    {
                        name: "array",
                        value: [1, 2, 3],
                        matcherArgs: [],
                    },
                ],
            };
        });
    },
});
