import { type WindowEx, testMatcher } from "./testMatcher.testUtils.ts";

// eslint-disable-next-line playwright/require-hook
testMatcher("toContainEqual", {
    beforeEach: async (page) => {
        await page.evaluate(() => {
            (window as unknown as WindowEx).testCases = {
                pass: [
                    {
                        name: "array contains equal value",
                        value: [
                            { id: 1, name: "test" },
                            { id: 2, name: "example" },
                            { id: 3, name: "lorem ipsum" },
                        ],
                        matcherArgs: [{ id: 2, name: "example" }],
                    },
                    {
                        name: "Set contains equal value",
                        value: new Set([
                            { id: 1, name: "test" },
                            { id: 2, name: "example" },
                            { id: 3, name: "lorem ipsum" },
                        ]),
                        matcherArgs: [
                            {
                                id: 2,
                                name: "example",
                            },
                        ],
                    },
                ],
                fail: [
                    {
                        name: "array does not contain equal value",
                        value: [
                            { id: 1, name: "test" },
                            { id: 2, name: "example" },
                            { id: 3, name: "lorem ipsum" },
                        ],
                        matcherArgs: [{ id: 4, name: "not found" }],
                    },
                    {
                        name: "Set does not contain equal value",
                        value: new Set([1, 2, 3]),
                        matcherArgs: [4],
                    },
                    {
                        name: "string",
                        value: "lorem ipsum",
                        matcherArgs: [3],
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
