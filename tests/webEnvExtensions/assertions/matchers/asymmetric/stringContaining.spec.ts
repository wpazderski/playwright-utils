import { expect, test } from "@playwright/test";
import { convertDataToSerializable } from "../../../../../src/webEnvExtensions/serialization/convertDataToSerializable.ts";
import { type WindowEx, testMatcher } from "../testMatcher.testUtils.ts";

// eslint-disable-next-line playwright/require-hook
testMatcher("stringContaining", {
    beforeEach: async (page) => {
        await page.evaluate(() => {
            (window as unknown as WindowEx).testCases = {
                pass: [
                    {
                        name: "string; matcher=stringContaining; contains=yes",
                        value: "test123",
                        matcherArgs: [window.playwrightUtils.expect.stringContaining("123")],
                    },
                    {
                        name: "string; matcher=not.stringContaining; contains=no",
                        value: "test123",
                        matcherArgs: [window.playwrightUtils.expect.not.stringContaining("456")],
                    },
                    {
                        name: "object; matcher=stringContaining; contains=yes",
                        value: { test: "test123" },
                        matcherArgs: [
                            {
                                test: window.playwrightUtils.expect.stringContaining("123"),
                            },
                        ],
                    },
                    {
                        name: "object; matcher=not.stringContaining; contains=no",
                        value: { test: "test123" },
                        matcherArgs: [
                            {
                                test: window.playwrightUtils.expect.not.stringContaining("456"),
                            },
                        ],
                    },
                    {
                        name: "array; matcher=stringContaining; contains=yes",
                        value: ["test123"],
                        matcherArgs: [[window.playwrightUtils.expect.stringContaining("123")]],
                    },
                    {
                        name: "array; matcher=not.stringContaining; contains=no",
                        value: ["test123"],
                        matcherArgs: [[window.playwrightUtils.expect.not.stringContaining("456")]],
                    },
                    {
                        name: "number; matcher=not.stringContaining",
                        value: 123456,
                        matcherArgs: [window.playwrightUtils.expect.not.stringContaining("123")],
                    },
                    {
                        name: "bigint; matcher=not.stringContaining",
                        value: 1234567890123456789012345678901234567890n,
                        matcherArgs: [window.playwrightUtils.expect.not.stringContaining("123")],
                    },
                    {
                        name: "boolean; matcher=not.stringContaining",
                        value: true,
                        matcherArgs: [window.playwrightUtils.expect.not.stringContaining("123")],
                    },
                    {
                        name: "null; matcher=not.stringContaining",
                        value: null,
                        matcherArgs: [window.playwrightUtils.expect.not.stringContaining("123")],
                    },
                    {
                        name: "undefined; matcher=not.stringContaining",
                        value: undefined,
                        matcherArgs: [window.playwrightUtils.expect.not.stringContaining("123")],
                    },
                    {
                        name: "function; matcher=not.stringContaining",
                        value: () => {},
                        matcherArgs: [window.playwrightUtils.expect.not.stringContaining("123")],
                    },
                    {
                        name: "symbol; matcher=not.stringContaining",
                        value: Symbol("test"),
                        matcherArgs: [window.playwrightUtils.expect.not.stringContaining("123")],
                    },
                    {
                        name: "object; matcher=not.stringContaining",
                        value: { id: "123" },
                        matcherArgs: [window.playwrightUtils.expect.not.stringContaining("123")],
                    },
                    {
                        name: "array; matcher=not.stringContaining",
                        value: [1, 2, 3],
                        matcherArgs: [window.playwrightUtils.expect.not.stringContaining("123")],
                    },
                ],
                fail: [
                    {
                        name: "string; matcher=stringContaining; contains=no",
                        value: "test123",
                        matcherArgs: [window.playwrightUtils.expect.stringContaining("456")],
                    },
                    {
                        name: "string; matcher=not.stringContaining; contains=yes",
                        value: "test123",
                        matcherArgs: [window.playwrightUtils.expect.not.stringContaining("123")],
                    },
                    {
                        name: "object; matcher=stringContaining; contains=no",
                        value: { test: "test123" },
                        matcherArgs: [
                            {
                                test: window.playwrightUtils.expect.stringContaining("456"),
                            },
                        ],
                    },
                    {
                        name: "object; matcher=not.stringContaining; contains=yes",
                        value: { test: "test123" },
                        matcherArgs: [
                            {
                                test: window.playwrightUtils.expect.not.stringContaining("123"),
                            },
                        ],
                    },
                    {
                        name: "array; matcher=stringContaining; contains=no",
                        value: ["test123"],
                        matcherArgs: [[window.playwrightUtils.expect.stringContaining("456")]],
                    },
                    {
                        name: "array; matcher=not.stringContaining; contains=yes",
                        value: ["test123"],
                        matcherArgs: [[window.playwrightUtils.expect.not.stringContaining("123")]],
                    },
                    {
                        name: "number; matcher=stringContaining",
                        value: 123456,
                        matcherArgs: [window.playwrightUtils.expect.stringContaining("123")],
                    },
                    {
                        name: "bigint; matcher=stringContaining",
                        value: 1234567890123456789012345678901234567890n,
                        matcherArgs: [window.playwrightUtils.expect.stringContaining("123")],
                    },
                    {
                        name: "boolean; matcher=stringContaining",
                        value: true,
                        matcherArgs: [window.playwrightUtils.expect.stringContaining("123")],
                    },
                    {
                        name: "null; matcher=stringContaining",
                        value: null,
                        matcherArgs: [window.playwrightUtils.expect.stringContaining("123")],
                    },
                    {
                        name: "undefined; matcher=stringContaining",
                        value: undefined,
                        matcherArgs: [window.playwrightUtils.expect.stringContaining("123")],
                    },
                    {
                        name: "function; matcher=stringContaining",
                        value: () => {},
                        matcherArgs: [window.playwrightUtils.expect.stringContaining("123")],
                    },
                    {
                        name: "symbol; matcher=stringContaining",
                        value: Symbol("test"),
                        matcherArgs: [window.playwrightUtils.expect.stringContaining("123")],
                    },
                    {
                        name: "object; matcher=stringContaining",
                        value: { id: "123" },
                        matcherArgs: [window.playwrightUtils.expect.stringContaining("123")],
                    },
                    {
                        name: "array; matcher=stringContaining",
                        value: [1, 2, 3],
                        matcherArgs: [window.playwrightUtils.expect.stringContaining("123")],
                    },
                ],
            };
        });
    },
    expectMatcher: {
        extraExpectMatcherBlock: () => {
            test.describe("invalid matcher args", () => {
                const testCases = [
                    {
                        name: "number",
                        matcherArgs: [123456],
                    },
                    {
                        name: "bigint",
                        matcherArgs: [1234567890123456789012345678901234567890n],
                    },
                    {
                        name: "boolean",
                        matcherArgs: [true],
                    },
                    {
                        name: "null",
                        matcherArgs: [null],
                    },
                    {
                        name: "undefined",
                        matcherArgs: [undefined],
                    },
                    {
                        name: "function",
                        matcherArgs: [() => {}],
                    },
                    {
                        name: "symbol",
                        matcherArgs: [Symbol("test")],
                    },
                    {
                        name: "object",
                        matcherArgs: [{ id: "123" }],
                    },
                    {
                        name: "array",
                        matcherArgs: [[1, 2, 3]],
                    },
                ];
                for (const testCase of testCases) {
                    test(`should fail for matcherArg: ${testCase.name}`, async ({ page }) => {
                        const isOk = await page.evaluate((matcherArgs) => {
                            const matcherArgsWeb = window.playwrightUtils.convertDataFromSerializable(matcherArgs) as typeof matcherArgs;
                            window.playwrightUtils
                                .expect(() => {
                                    window.playwrightUtils.expect.stringContaining(...(matcherArgsWeb as unknown as [string]));
                                })
                                .toThrow();
                            return true;
                        }, convertDataToSerializable(testCase.matcherArgs));
                        expect(isOk).toBe(true);
                    });
                }
            });
        },
    },
});
