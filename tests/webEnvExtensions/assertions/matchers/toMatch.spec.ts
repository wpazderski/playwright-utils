import { type WindowEx, testMatcher } from "./testMatcher.testUtils.ts";

// eslint-disable-next-line playwright/require-hook
testMatcher("toMatch", {
    beforeEach: async (page) => {
        await page.evaluate(() => {
            (window as unknown as WindowEx).testCases = {
                pass: [
                    {
                        name: "matches expected string",
                        value: "lorem ipsum",
                        matcherArgs: ["em ip"],
                    },
                    {
                        name: "matches expected RegExp",
                        value: "lorem ipsum",
                        matcherArgs: [/^[a-z\s]+$/gu],
                    },
                ],
                fail: [
                    {
                        name: "does not match expected string",
                        value: "lorem ipsum",
                        matcherArgs: ["dolor"],
                    },
                    {
                        name: "does not match expected RegExp",
                        value: "lorem ipsum",
                        matcherArgs: [/^[0-9\s]+$/gu],
                    },
                ],
                alwaysFail: [
                    {
                        name: "number",
                        value: 123,
                        matcherArgs: [/^.*$/gu],
                    },
                    {
                        name: "bigint",
                        value: 1234567890123456789012345678901234567890n,
                        matcherArgs: [/^.*$/gu],
                    },
                    {
                        name: "boolean",
                        value: true,
                        matcherArgs: [/^.*$/gu],
                    },
                    {
                        name: "null",
                        value: null,
                        matcherArgs: [/^.*$/gu],
                    },
                    {
                        name: "undefined",
                        value: undefined,
                        matcherArgs: [/^.*$/gu],
                    },
                    {
                        name: "function",
                        value: () => {},
                        matcherArgs: [/^.*$/gu],
                    },
                    {
                        name: "symbol",
                        value: Symbol("test"),
                        matcherArgs: [/^.*$/gu],
                    },
                    {
                        name: "object",
                        value: { id: "123" },
                        matcherArgs: [/^.*$/gu],
                    },
                    {
                        name: "array",
                        value: [1, 2, 3],
                        matcherArgs: [/^.*$/gu],
                    },
                    {
                        name: "number expected value",
                        value: "test123",
                        matcherArgs: [123],
                    },
                    {
                        name: "bigint expected value",
                        value: "test123",
                        matcherArgs: [1234567890123456789012345678901234567890n],
                    },
                    {
                        name: "boolean expected value",
                        value: "test123",
                        matcherArgs: [true],
                    },
                    {
                        name: "null expected value",
                        value: "test123",
                        matcherArgs: [null],
                    },
                    {
                        name: "undefined expected value",
                        value: "test123",
                        matcherArgs: [undefined],
                    },
                    {
                        name: "symbol expected value",
                        value: "test123",
                        matcherArgs: [Symbol("test")],
                    },
                    {
                        name: "object expected value",
                        value: "test123",
                        matcherArgs: [{ id: "123" }],
                    },
                    {
                        name: "array expected value",
                        value: "test123",
                        matcherArgs: [[1, 2, 3]],
                    },
                ],
            };
        });
    },
});
