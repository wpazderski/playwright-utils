import { type WindowEx, testMatcher } from "./testMatcher.testUtils.ts";

// eslint-disable-next-line playwright/require-hook
testMatcher("toMatchObject", {
    beforeEach: async (page) => {
        await page.evaluate(() => {
            const fn = (): void => {};
            const sym = Symbol("test");
            const obj = { id: "123" };
            const arr = [1, 2, 3];
            class ExampleClass {
                id = "123" as const;
            }
            const exampleInstance = new ExampleClass();
            (window as unknown as WindowEx).testCases = {
                pass: [
                    {
                        name: "object - same reference",
                        value: obj,
                        matcherArgs: [obj],
                    },
                    {
                        name: "array - same reference",
                        value: arr,
                        matcherArgs: [arr],
                    },
                    {
                        name: "object - equal value",
                        value: { id: "123" },
                        matcherArgs: [{ id: "123" }],
                    },
                    {
                        name: "array - equal value",
                        value: [1, 2, 3],
                        matcherArgs: [[1, 2, 3]],
                    },
                    {
                        name: "deep - equal",
                        value: {
                            id: "123",
                            nested: {
                                value: "test",
                                arr: [
                                    1,
                                    2,
                                    3,
                                    {
                                        id: "456",
                                        nested: {
                                            value: "example",
                                            arr: [4, 5, 6],
                                        },
                                    },
                                ],
                            },
                        },
                        matcherArgs: [
                            {
                                id: "123",
                                nested: {
                                    value: "test",
                                    arr: [
                                        1,
                                        2,
                                        3,
                                        {
                                            id: "456",
                                            nested: {
                                                value: "example",
                                                arr: [4, 5, 6],
                                            },
                                        },
                                    ],
                                },
                            },
                        ],
                    },
                    ...(window as unknown as WindowEx).addTestCasesWithSwappedValueAndFirstMatcherArg([
                        {
                            name: "array sparseness",
                            // eslint-disable-next-line no-sparse-arrays
                            value: [1, , 3],
                            matcherArgs: [[1, undefined, 3]],
                        },
                        {
                            name: "object - same properties, but different types",
                            value: exampleInstance,
                            matcherArgs: [JSON.parse(JSON.stringify(exampleInstance))],
                        },
                    ]),
                    {
                        name: "object - undefined value vs missing property",
                        value: { id: "123", missing: undefined },
                        matcherArgs: [{ id: "123" }],
                    },
                    {
                        name: "object - extra props in received value",
                        value: { id: "123", extra: "value" },
                        matcherArgs: [{ id: "123" }],
                    },
                ],
                fail: [
                    {
                        name: "deep - different",
                        value: {
                            id: "123",
                            nested: {
                                value: "test",
                                arr: [
                                    1,
                                    2,
                                    3,
                                    {
                                        id: "456",
                                        nested: {
                                            value: "example",
                                            arr: [4, 5, 6],
                                        },
                                    },
                                ],
                            },
                        },
                        matcherArgs: [
                            {
                                id: "123",
                                nested: {
                                    value: "test",
                                    arr: [
                                        1,
                                        2,
                                        3,
                                        {
                                            id: "456",
                                            nested: {
                                                value: "example",
                                                arr: [4, 5, 67851455],
                                            },
                                        },
                                    ],
                                },
                            },
                        ],
                    },
                    {
                        name: "object - missing property vs undefined value",
                        value: { id: "123" },
                        matcherArgs: [{ id: "123", missing: undefined }],
                    },
                    {
                        name: "object - extra props in expected",
                        value: { id: "123" },
                        matcherArgs: [{ id: "123", extra: "value" }],
                    },
                ],
                alwaysFail: [
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
                        name: "function - same reference",
                        value: fn,
                        matcherArgs: [fn],
                    },
                    {
                        name: "symbol - same reference",
                        value: sym,
                        matcherArgs: [sym],
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
                        name: "function - different reference",
                        value: () => {},
                        matcherArgs: [() => {}],
                    },
                    {
                        name: "symbol - different reference",
                        value: Symbol("test"),
                        matcherArgs: [Symbol("test")],
                    },
                ],
            };
        });
    },
});
