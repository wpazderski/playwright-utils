import { type WindowEx, testMatcher } from "./testMatcher.testUtils.ts";

// eslint-disable-next-line playwright/require-hook
testMatcher("toBeCloseTo", {
    beforeEach: async (page) => {
        await page.evaluate(() => {
            (window as unknown as WindowEx).testCases = (window as unknown as WindowEx).addTestCasesWithSwappedValueAndFirstMatcherArg({
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
                        name: "number-float - close",
                        value: 123.456,
                        matcherArgs: [123.4565],
                    },
                    {
                        name: "number-float - close, precision-0",
                        value: 123.0,
                        matcherArgs: [123.4, 0],
                    },
                    {
                        name: "number-float - close, precision-5",
                        value: 123.456789,
                        matcherArgs: [123.4567895, 5],
                    },
                    {
                        name: "number-float - close, precision=-1",
                        value: 123.5,
                        matcherArgs: [124.5, -1],
                    },
                    {
                        name: "infinity",
                        value: Number.POSITIVE_INFINITY,
                        matcherArgs: [Number.POSITIVE_INFINITY],
                    },
                    {
                        name: "negative infinity",
                        value: Number.NEGATIVE_INFINITY,
                        matcherArgs: [Number.NEGATIVE_INFINITY],
                    },
                    {
                        name: "zero and negative zero",
                        value: 0,
                        matcherArgs: [-0],
                    },
                ],
                fail: [
                    {
                        name: "number-int - different",
                        value: 123,
                        matcherArgs: [125],
                    },
                    {
                        name: "number-float - not close",
                        value: 123.45,
                        matcherArgs: [123.46],
                    },
                    {
                        name: "number-float - not close",
                        value: 123.456,
                        matcherArgs: [123.466],
                    },
                    {
                        name: "number-float - not close, precision-0",
                        value: 123.0,
                        matcherArgs: [123.5, 0],
                    },
                    {
                        name: "number-float - not close, precision-5",
                        value: 123.456789,
                        matcherArgs: [123.457789, 5],
                    },
                    {
                        name: "number-float - not close, precision=-1",
                        value: 123.5,
                        matcherArgs: [144.5, -1],
                    },
                    {
                        name: "infinity and negative infinity",
                        value: Number.POSITIVE_INFINITY,
                        matcherArgs: [Number.NEGATIVE_INFINITY],
                    },
                    {
                        name: "NaN",
                        value: Number.NaN,
                        matcherArgs: [Number.NaN],
                    },
                ],
                alwaysFail: [
                    {
                        name: "string",
                        value: "test123",
                        matcherArgs: [123],
                    },
                    {
                        name: "bigint",
                        value: 1234567890123456789012345678901234567890n,
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
                ],
            });
        });
    },
});
