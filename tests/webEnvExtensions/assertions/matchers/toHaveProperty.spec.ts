import { type WindowEx, testMatcher } from "./testMatcher.testUtils.ts";

// eslint-disable-next-line playwright/require-hook
testMatcher("toHaveProperty", {
    beforeEach: async (page) => {
        await page.evaluate(() => {
            const obj = {
                id: "123",
                name: "test",
                test123: 12345,
                lorem: {
                    ipsum: "dolor sit amet",
                },
                undef: undefined,
            };
            (window as unknown as WindowEx).testCases = {
                pass: [
                    {
                        name: "property exists - string path",
                        value: obj,
                        matcherArgs: ["test123"],
                    },
                    {
                        name: "nested property exists - string path",
                        value: obj,
                        matcherArgs: ["lorem.ipsum"],
                    },
                    {
                        name: "property has value - string path",
                        value: obj,
                        matcherArgs: ["id", "123"],
                    },
                    {
                        name: "nested property has value - string path",
                        value: obj,
                        matcherArgs: ["lorem.ipsum", "dolor sit amet"],
                    },
                    {
                        name: "property with undefined value exists - string path",
                        value: obj,
                        matcherArgs: ["undef"],
                    },
                    {
                        name: "property exists - array path",
                        value: obj,
                        matcherArgs: [["test123"]],
                    },
                    {
                        name: "nested property exists - array path",
                        value: obj,
                        matcherArgs: [["lorem", "ipsum"]],
                    },
                    {
                        name: "property has value - array path",
                        value: obj,
                        matcherArgs: [["id"], "123"],
                    },
                    {
                        name: "nested property has value - array path",
                        value: obj,
                        matcherArgs: [["lorem", "ipsum"], "dolor sit amet"],
                    },
                    {
                        name: "property with undefined value exists - array path",
                        value: obj,
                        matcherArgs: [["undef"]],
                    },
                ],
                fail: [
                    {
                        name: "property does not exist - string path",
                        value: obj,
                        matcherArgs: ["nonExistent"],
                    },
                    {
                        name: "nested property does not exist - string path",
                        value: obj,
                        matcherArgs: ["lorem.nonExistent"],
                    },
                    {
                        name: "property has different value - string path",
                        value: obj,
                        matcherArgs: ["id", "456"],
                    },
                    {
                        name: "nested property has different value - string path",
                        value: obj,
                        matcherArgs: ["lorem.ipsum", "different value"],
                    },
                    {
                        name: "property does not exist - array path",
                        value: obj,
                        matcherArgs: [["nonExistent"]],
                    },
                    {
                        name: "nested property does not exist - array path",
                        value: obj,
                        matcherArgs: [["lorem", "nonExistent"]],
                    },
                    {
                        name: "property has different value - array path",
                        value: obj,
                        matcherArgs: [["id"], "456"],
                    },
                    {
                        name: "nested property has different value - array path",
                        value: obj,
                        matcherArgs: [["lorem", "ipsum"], "different value"],
                    },
                    {
                        name: "empty string expected value",
                        value: "test123",
                        matcherArgs: [""],
                    },
                ],
                alwaysFail: [
                    {
                        name: "null",
                        value: null,
                        matcherArgs: ["test123"],
                    },
                    {
                        name: "undefined",
                        value: undefined,
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
                        name: "empty array expected value",
                        value: "test123",
                        matcherArgs: [[]],
                    },
                    {
                        name: "custom object expected value",
                        value: "test123",
                        matcherArgs: [
                            {
                                lorem: 12,
                                ipsum: 34,
                            },
                        ],
                    },
                ],
            };
        });
    },
});
