import { type WindowEx, testMatcher } from "./testMatcher.testUtils.ts";

export function testToThrowMatcher(matcherName: "toThrow" | "toThrowError"): void {
    testMatcher(matcherName, {
        beforeEach: async (page) => {
            await page.evaluate(() => {
                class ExampleError extends Error {}
                (window as unknown as WindowEx).testCases = {
                    pass: [
                        {
                            name: "throws anything",
                            value: () => {
                                throw new Error("test123");
                            },
                            matcherArgs: [],
                        },
                        {
                            name: "throws substring",
                            value: () => {
                                throw new Error("test123");
                            },
                            matcherArgs: ["t123"],
                        },
                        {
                            name: "throws RegExp",
                            value: () => {
                                throw new Error("test123");
                            },
                            matcherArgs: [/t123/u],
                        },
                        {
                            name: "throws error class",
                            value: () => {
                                throw new ExampleError("test123");
                            },
                            matcherArgs: [ExampleError],
                        },
                        {
                            name: "throws error object",
                            value: () => {
                                throw new ExampleError("test123");
                            },
                            matcherArgs: [new ExampleError("test123")],
                        },
                    ],
                    fail: [
                        {
                            name: "does not throw anything",
                            value: () => {},
                            matcherArgs: [],
                        },
                        {
                            name: "does not throw substring",
                            value: () => {
                                throw new Error("test999");
                            },
                            matcherArgs: ["t123"],
                        },
                        {
                            name: "does not throw RegExp",
                            value: () => {
                                throw new Error("test999");
                            },
                            matcherArgs: [/t123/u],
                        },
                        {
                            name: "does not throw error class",
                            value: () => {
                                throw new Error("test123");
                            },
                            matcherArgs: [ExampleError],
                        },
                        {
                            name: "does not throw error object",
                            value: () => {
                                throw new Error("test999");
                            },
                            matcherArgs: [new ExampleError("test123")],
                        },
                    ],
                    alwaysFail: [
                        {
                            name: "string",
                            value: "test123",
                            matcherArgs: ["test123"],
                            skipPromised: true,
                        },
                        {
                            name: "number-int",
                            value: 123,
                            matcherArgs: ["test123"],
                            skipPromised: true,
                        },
                        {
                            name: "number-float",
                            value: 123.45,
                            matcherArgs: ["test123"],
                            skipPromised: true,
                        },
                        {
                            name: "NaN",
                            value: Number.NaN,
                            matcherArgs: ["test123"],
                            skipPromised: true,
                        },
                        {
                            name: "infinity",
                            value: Number.POSITIVE_INFINITY,
                            matcherArgs: ["test123"],
                            skipPromised: true,
                        },
                        {
                            name: "bigint",
                            value: 1234567890123456789012345678901234567890n,
                            matcherArgs: ["test123"],
                            skipPromised: true,
                        },
                        {
                            name: "boolean-true",
                            value: true,
                            matcherArgs: ["test123"],
                            skipPromised: true,
                        },
                        {
                            name: "boolean-false",
                            value: false,
                            matcherArgs: ["test123"],
                            skipPromised: true,
                        },
                        {
                            name: "null",
                            value: null,
                            matcherArgs: ["test123"],
                            skipPromised: true,
                        },
                        {
                            name: "undefined",
                            value: undefined,
                            matcherArgs: ["test123"],
                            skipPromised: true,
                        },
                        {
                            name: "symbol",
                            value: Symbol("test"),
                            matcherArgs: ["test123"],
                            skipPromised: true,
                        },
                        {
                            name: "array",
                            value: [1, 2, 3],
                            matcherArgs: ["test123"],
                            skipPromised: true,
                        },
                        {
                            name: "object",
                            value: { id: "123" },
                            matcherArgs: ["test123"],
                            skipPromised: true,
                        },
                        {
                            name: "number expected value",
                            value: () => {
                                throw new Error("test123");
                            },
                            matcherArgs: [123],
                        },
                        {
                            name: "bigint expected value",
                            value: () => {
                                throw new Error("test123");
                            },
                            matcherArgs: [1234567890123456789012345678901234567890n],
                        },
                        {
                            name: "boolean expected value",
                            value: () => {
                                throw new Error("test123");
                            },
                            matcherArgs: [true],
                        },
                        {
                            name: "null expected value",
                            value: () => {
                                throw new Error("test123");
                            },
                            matcherArgs: [null],
                        },
                        {
                            name: "symbol expected value",
                            value: () => {
                                throw new Error("test123");
                            },
                            matcherArgs: [Symbol("test")],
                        },
                    ],
                };
            });
        },
    });
}
