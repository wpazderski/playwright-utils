import { type WindowEx, testMatcher } from "./testMatcher.testUtils.ts";

// eslint-disable-next-line playwright/require-hook
testMatcher("toBe", {
    beforeEach: async (page) => {
        await page.evaluate(() => {
            const fn = (): void => {};
            const sym = Symbol("test");
            const obj = { id: "123" };
            const arr = [1, 2, 3];
            (window as unknown as WindowEx).testCases = {
                pass: [
                    {
                        name: "string",
                        value: "test123",
                        matcherArgs: ["test123"],
                    },
                    {
                        name: "number-int",
                        value: 123,
                        matcherArgs: [123],
                    },
                    {
                        name: "number-float",
                        value: 123.45,
                        matcherArgs: [123.45],
                    },
                    {
                        name: "NaN",
                        value: Number.NaN,
                        matcherArgs: [Number.NaN],
                    },
                    {
                        name: "infinity",
                        value: Number.POSITIVE_INFINITY,
                        matcherArgs: [Number.POSITIVE_INFINITY],
                    },
                    {
                        name: "bigint",
                        value: 1234567890123456789012345678901234567890n,
                        matcherArgs: [1234567890123456789012345678901234567890n],
                    },
                    {
                        name: "boolean-true",
                        value: true,
                        matcherArgs: [true],
                    },
                    {
                        name: "boolean-false",
                        value: false,
                        matcherArgs: [false],
                    },
                    {
                        name: "null",
                        value: null,
                        matcherArgs: [null],
                    },
                    {
                        name: "undefined",
                        value: undefined,
                        matcherArgs: [undefined],
                    },
                    {
                        name: "function",
                        value: fn,
                        matcherArgs: [fn],
                    },
                    {
                        name: "symbol",
                        value: sym,
                        matcherArgs: [sym],
                    },
                    {
                        name: "object",
                        value: obj,
                        matcherArgs: [obj],
                    },
                    {
                        name: "array",
                        value: arr,
                        matcherArgs: [arr],
                    },
                ],
                fail: [
                    {
                        name: "string",
                        value: "test123",
                        matcherArgs: ["test12345"],
                    },
                    {
                        name: "number-int",
                        value: 123,
                        matcherArgs: [12345],
                    },
                    {
                        name: "number-float",
                        value: 123.45,
                        matcherArgs: [123.4567],
                    },
                    {
                        name: "zero and negative zero",
                        value: 0,
                        matcherArgs: [-0],
                    },
                    {
                        name: "infinity and negative infinity",
                        value: Number.POSITIVE_INFINITY,
                        matcherArgs: [Number.NEGATIVE_INFINITY],
                    },
                    {
                        name: "bigint",
                        value: 1234567890123456789012345678901234567890n,
                        matcherArgs: [12345678901234567890123456789012345678901234567890n],
                    },
                    {
                        name: "boolean",
                        value: true,
                        matcherArgs: [false],
                    },
                    {
                        name: "null and undefined",
                        value: null,
                        matcherArgs: [undefined],
                    },
                    {
                        name: "function",
                        value: () => {},
                        matcherArgs: [() => {}],
                    },
                    {
                        name: "symbol",
                        value: Symbol("test"),
                        matcherArgs: [Symbol("test")],
                    },
                    {
                        name: "object",
                        value: { id: "123" },
                        matcherArgs: [{ id: "123" }],
                    },
                    {
                        name: "array",
                        value: [1, 2, 3],
                        matcherArgs: [[1, 2, 3]],
                    },
                ],
            };
        });
    },
});
