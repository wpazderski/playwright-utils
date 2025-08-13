import { type WindowEx, testMatcher } from "./testMatcher.testUtils.ts";

// eslint-disable-next-line playwright/require-hook
testMatcher("toBeTruthy", {
    beforeEach: async (page) => {
        await page.evaluate(() => {
            (window as unknown as WindowEx).testCases = {
                pass: [
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
                        name: "infinity",
                        value: Number.POSITIVE_INFINITY,
                        matcherArgs: [],
                    },
                    {
                        name: "boolean-true",
                        value: true,
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
                fail: [
                    {
                        name: "empty string",
                        value: "",
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
                        name: "bigint-zero",
                        value: 0n,
                        matcherArgs: [],
                    },
                    {
                        name: "null",
                        value: null,
                        matcherArgs: [],
                    },
                    {
                        name: "undefined",
                        value: undefined,
                        matcherArgs: [],
                    },
                    {
                        name: "boolean-false",
                        value: false,
                        matcherArgs: [],
                    },
                ],
            };
        });
    },
});
