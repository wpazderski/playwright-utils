import { type WindowEx, testMatcher } from "./testMatcher.testUtils.ts";

// eslint-disable-next-line playwright/require-hook
testMatcher("toHaveLength", {
    beforeEach: async (page) => {
        await page.evaluate(() => {
            (window as unknown as WindowEx).testCases = {
                pass: [
                    {
                        name: "string",
                        value: "test123",
                        matcherArgs: [7],
                    },
                    {
                        name: "empty string",
                        value: "",
                        matcherArgs: [0],
                    },
                    {
                        name: "array",
                        value: [1, 2, 3],
                        matcherArgs: [3],
                    },
                    {
                        name: "empty array",
                        value: [],
                        matcherArgs: [0],
                    },
                    {
                        name: "Uint8Array",
                        value: new Uint8Array([1, 2, 3]),
                        matcherArgs: [3],
                    },
                    {
                        name: "custom object with length",
                        value: {
                            lorem: 12,
                            ipsum: 34,
                            length: 5,
                        },
                        matcherArgs: [5],
                    },
                    {
                        name: "function",
                        value: (a: number, b: string) => `${a.toString()} ${b}`,
                        matcherArgs: [2],
                    },
                ],
                fail: [
                    {
                        name: "string - different length",
                        value: "test123",
                        matcherArgs: [10],
                    },
                    {
                        name: "array - different length",
                        value: [1, 2, 3],
                        matcherArgs: [5],
                    },
                    {
                        name: "Uint8Array - different length",
                        value: new Uint8Array([1, 2, 3]),
                        matcherArgs: [5],
                    },
                    {
                        name: "custom object with length - different length",
                        value: {
                            lorem: 12,
                            ipsum: 34,
                            length: 5,
                        },
                        matcherArgs: [10],
                    },
                    {
                        name: "function - different length",
                        value: (a: number, b: string) => `${a.toString()} ${b}`,
                        matcherArgs: [3],
                    },
                ],
                alwaysFail: [
                    {
                        name: "number",
                        value: 123,
                        matcherArgs: [5],
                    },
                    {
                        name: "bigint",
                        value: 12345678901234567890123456789012345678901234567890n,
                        matcherArgs: [5],
                    },
                    {
                        name: "boolean",
                        value: true,
                        matcherArgs: [false],
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
                        name: "string expected value",
                        value: "test123",
                        matcherArgs: ["test123"],
                    },
                    {
                        name: "negative number expected value",
                        value: "test123",
                        matcherArgs: [-123],
                    },
                    {
                        name: "floating point number expected value",
                        value: "test123",
                        matcherArgs: [123.45],
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
                    {
                        name: "custom object without length",
                        value: {
                            lorem: 12,
                            ipsum: 34,
                        },
                        matcherArgs: [2],
                    },
                    {
                        name: "custom object with length property of different type",
                        value: {
                            lorem: 12,
                            ipsum: 34,
                            length: "5",
                        },
                        matcherArgs: [2],
                    },
                ],
            };
        });
    },
});
