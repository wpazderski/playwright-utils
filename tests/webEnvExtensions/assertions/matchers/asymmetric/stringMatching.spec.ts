import { expect, test } from "@playwright/test";
import { convertDataToSerializable } from "../../../../../src/webEnvExtensions/serialization/convertDataToSerializable.ts";
import { type WindowEx, testMatcher } from "../testMatcher.testUtils.ts";

// eslint-disable-next-line playwright/require-hook
testMatcher("stringMatching", {
    beforeEach: async (page) => {
        await page.evaluate(() => {
            (window as unknown as WindowEx).testCases = {
                pass: [
                    {
                        name: "string; matcher=stringMatching; matches=yes",
                        value: "test123",
                        matcherArgs: [window.playwrightUtils.expect.stringMatching(/[0-9]$/u)],
                    },
                    {
                        name: "string; matcher=not.stringMatching; matches=no",
                        value: "test123",
                        matcherArgs: [window.playwrightUtils.expect.not.stringMatching(/[a-z]$/u)],
                    },
                    {
                        name: "string; matcher=stringMatching; matches=yes; string matcher arg",
                        value: "test123",
                        matcherArgs: [window.playwrightUtils.expect.stringMatching("[0-9]$")],
                    },
                    {
                        name: "string; matcher=not.stringMatching; matches=no; string matcher arg",
                        value: "test123",
                        matcherArgs: [window.playwrightUtils.expect.not.stringMatching("[a-z]$")],
                    },
                    {
                        name: "object; matcher=stringMatching; matches=yes",
                        value: { test: "test123" },
                        matcherArgs: [
                            {
                                test: window.playwrightUtils.expect.stringMatching(/[0-9]$/u),
                            },
                        ],
                    },
                    {
                        name: "object; matcher=not.stringMatching; matches=no",
                        value: { test: "test123" },
                        matcherArgs: [
                            {
                                test: window.playwrightUtils.expect.not.stringMatching(/[a-z]$/u),
                            },
                        ],
                    },
                    {
                        name: "array; matcher=stringMatching; matches=yes",
                        value: ["test123"],
                        matcherArgs: [[window.playwrightUtils.expect.stringMatching(/[0-9]$/u)]],
                    },
                    {
                        name: "array; matcher=not.stringMatching; matches=no",
                        value: ["test123"],
                        matcherArgs: [[window.playwrightUtils.expect.not.stringMatching(/[a-z]$/u)]],
                    },
                    {
                        name: "number; matcher=not.stringMatching",
                        value: 123456,
                        matcherArgs: [window.playwrightUtils.expect.not.stringMatching(/[0-9]$/u)],
                    },
                    {
                        name: "bigint; matcher=not.stringMatching",
                        value: 1234567890123456789012345678901234567890n,
                        matcherArgs: [window.playwrightUtils.expect.not.stringMatching(/[0-9]$/u)],
                    },
                    {
                        name: "boolean; matcher=not.stringMatching",
                        value: true,
                        matcherArgs: [window.playwrightUtils.expect.not.stringMatching(/[0-9]$/u)],
                    },
                    {
                        name: "null; matcher=not.stringMatching",
                        value: null,
                        matcherArgs: [window.playwrightUtils.expect.not.stringMatching(/[0-9]$/u)],
                    },
                    {
                        name: "undefined; matcher=not.stringMatching",
                        value: undefined,
                        matcherArgs: [window.playwrightUtils.expect.not.stringMatching(/[0-9]$/u)],
                    },
                    {
                        name: "function; matcher=not.stringMatching",
                        value: () => {},
                        matcherArgs: [window.playwrightUtils.expect.not.stringMatching(/[0-9]$/u)],
                    },
                    {
                        name: "symbol; matcher=not.stringMatching",
                        value: Symbol("test"),
                        matcherArgs: [window.playwrightUtils.expect.not.stringMatching(/[0-9]$/u)],
                    },
                    {
                        name: "object; matcher=not.stringMatching",
                        value: { id: "123" },
                        matcherArgs: [window.playwrightUtils.expect.not.stringMatching(/[0-9]$/u)],
                    },
                    {
                        name: "array; matcher=not.stringMatching",
                        value: [1, 2, 3],
                        matcherArgs: [window.playwrightUtils.expect.not.stringMatching(/[0-9]$/u)],
                    },
                ],
                fail: [
                    {
                        name: "string; matcher=stringMatching; matches=no",
                        value: "test123",
                        matcherArgs: [window.playwrightUtils.expect.stringMatching(/[a-z]$/u)],
                    },
                    {
                        name: "string; matcher=not.stringMatching; matches=yes",
                        value: "test123",
                        matcherArgs: [window.playwrightUtils.expect.not.stringMatching(/[0-9]$/u)],
                    },
                    {
                        name: "string; matcher=stringMatching; matches=no; string matcher arg",
                        value: "test123",
                        matcherArgs: [window.playwrightUtils.expect.stringMatching("[a-z]$")],
                    },
                    {
                        name: "string; matcher=not.stringMatching; matches=yes; string matcher arg",
                        value: "test123",
                        matcherArgs: [window.playwrightUtils.expect.not.stringMatching("[0-9]$")],
                    },
                    {
                        name: "object; matcher=stringMatching; matches=no",
                        value: { test: "test123" },
                        matcherArgs: [
                            {
                                test: window.playwrightUtils.expect.stringMatching(/[a-z]$/u),
                            },
                        ],
                    },
                    {
                        name: "object; matcher=not.stringMatching; matches=yes",
                        value: { test: "test123" },
                        matcherArgs: [
                            {
                                test: window.playwrightUtils.expect.not.stringMatching(/[0-9]$/u),
                            },
                        ],
                    },
                    {
                        name: "array; matcher=stringMatching; matches=no",
                        value: ["test123"],
                        matcherArgs: [[window.playwrightUtils.expect.stringMatching(/[a-z]$/u)]],
                    },
                    {
                        name: "array; matcher=not.stringMatching; matches=yes",
                        value: ["test123"],
                        matcherArgs: [[window.playwrightUtils.expect.not.stringMatching(/[0-9]$/u)]],
                    },
                    {
                        name: "number; matcher=stringMatching",
                        value: 123456,
                        matcherArgs: [window.playwrightUtils.expect.stringMatching(/[0-9]$/u)],
                    },
                    {
                        name: "bigint; matcher=stringMatching",
                        value: 1234567890123456789012345678901234567890n,
                        matcherArgs: [window.playwrightUtils.expect.stringMatching(/[0-9]$/u)],
                    },
                    {
                        name: "boolean; matcher=stringMatching",
                        value: true,
                        matcherArgs: [window.playwrightUtils.expect.stringMatching(/[0-9]$/u)],
                    },
                    {
                        name: "null; matcher=stringMatching",
                        value: null,
                        matcherArgs: [window.playwrightUtils.expect.stringMatching(/[0-9]$/u)],
                    },
                    {
                        name: "undefined; matcher=stringMatching",
                        value: undefined,
                        matcherArgs: [window.playwrightUtils.expect.stringMatching(/[0-9]$/u)],
                    },
                    {
                        name: "function; matcher=stringMatching",
                        value: () => {},
                        matcherArgs: [window.playwrightUtils.expect.stringMatching(/[0-9]$/u)],
                    },
                    {
                        name: "symbol; matcher=stringMatching",
                        value: Symbol("test"),
                        matcherArgs: [window.playwrightUtils.expect.stringMatching(/[0-9]$/u)],
                    },
                    {
                        name: "object; matcher=stringMatching",
                        value: { id: "123" },
                        matcherArgs: [window.playwrightUtils.expect.stringMatching(/[0-9]$/u)],
                    },
                    {
                        name: "array; matcher=stringMatching",
                        value: [1, 2, 3],
                        matcherArgs: [window.playwrightUtils.expect.stringMatching(/[0-9]$/u)],
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
                                    window.playwrightUtils.expect.stringMatching(...(matcherArgsWeb as unknown as [string]));
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
