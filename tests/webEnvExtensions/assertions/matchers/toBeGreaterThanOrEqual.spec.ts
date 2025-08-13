import { type WindowEx, testMatcher } from "./testMatcher.testUtils.ts";

// eslint-disable-next-line playwright/require-hook
testMatcher("toBeGreaterThanOrEqual", {
    beforeEach: async (page) => {
        await page.evaluate(() => {
            (window as unknown as WindowEx).testCases = {
                pass: [
                    {
                        name: "number-int - eq",
                        value: 123,
                        matcherArgs: [123],
                    },
                    {
                        name: "number-float - eq",
                        value: 123.45,
                        matcherArgs: [123.45],
                    },
                    {
                        name: "zero and negative zero",
                        value: 0,
                        matcherArgs: [-0],
                    },
                    {
                        name: "number-int - gt",
                        value: 125,
                        matcherArgs: [123],
                    },
                    {
                        name: "number-float - gt",
                        value: 123.46,
                        matcherArgs: [123.45],
                    },
                    {
                        name: "number-float-negative - gt",
                        value: -123.44,
                        matcherArgs: [-123.45],
                    },
                    {
                        name: "number and negative infinity",
                        value: 5,
                        matcherArgs: [Number.NEGATIVE_INFINITY],
                    },
                    {
                        name: "2x infinity",
                        value: Number.POSITIVE_INFINITY,
                        matcherArgs: [Number.POSITIVE_INFINITY],
                    },
                    {
                        name: "2x negative infinity",
                        value: Number.NEGATIVE_INFINITY,
                        matcherArgs: [Number.NEGATIVE_INFINITY],
                    },
                    {
                        name: "bigints - gt",
                        value: 91234567890123456789012345678901234567890n,
                        matcherArgs: [1234567890123456789012345678901234567890n],
                    },
                    {
                        name: "number and bigint - gt",
                        value: 12345,
                        matcherArgs: [5n],
                    },
                    {
                        name: "bigint and number - gt",
                        value: 12345n,
                        matcherArgs: [5],
                    },
                    {
                        name: "infinity and negative infinity",
                        value: Number.POSITIVE_INFINITY,
                        matcherArgs: [Number.NEGATIVE_INFINITY],
                    },
                ],
                fail: [
                    {
                        name: "number-int - lt",
                        value: 123,
                        matcherArgs: [125],
                    },
                    {
                        name: "number-float - lt",
                        value: 123.45,
                        matcherArgs: [123.46],
                    },
                    {
                        name: "number-float-negative - lt",
                        value: -123.45,
                        matcherArgs: [-123.44],
                    },
                    {
                        name: "negative infinity and infinity",
                        value: Number.NEGATIVE_INFINITY,
                        matcherArgs: [Number.POSITIVE_INFINITY],
                    },
                    {
                        name: "number and infinity",
                        value: 5,
                        matcherArgs: [Number.POSITIVE_INFINITY],
                    },
                    {
                        name: "NaN",
                        value: Number.NaN,
                        matcherArgs: [Number.NaN],
                    },
                    {
                        name: "bigints - lt",
                        value: 1234567890123456789012345678901234567890n,
                        matcherArgs: [91234567890123456789012345678901234567890n],
                    },
                    {
                        name: "number and bigint - lt",
                        value: 5,
                        matcherArgs: [12345n],
                    },
                    {
                        name: "bigint and number - lt",
                        value: 5n,
                        matcherArgs: [12345],
                    },
                ],
                alwaysFail: (window as unknown as WindowEx).addTestCasesWithSwappedValueAndFirstMatcherArg([
                    {
                        name: "string",
                        value: "test123",
                        matcherArgs: [123],
                    },
                    {
                        name: "boolean",
                        value: true,
                        matcherArgs: [123],
                    },
                    {
                        name: "null",
                        value: null,
                        matcherArgs: [123],
                    },
                    {
                        name: "undefined",
                        value: undefined,
                        matcherArgs: [123],
                    },
                    {
                        name: "function",
                        value: () => {},
                        matcherArgs: [123],
                    },
                    {
                        name: "symbol",
                        value: Symbol("test"),
                        matcherArgs: [123],
                    },
                    {
                        name: "object",
                        value: { id: "123" },
                        matcherArgs: [123],
                    },
                    {
                        name: "array",
                        value: [1, 2, 3],
                        matcherArgs: [123],
                    },
                ]),
            };
        });
    },
});
