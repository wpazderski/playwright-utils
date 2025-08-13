import { expect, test } from "@playwright/test";
import { convertDataToSerializable } from "../../../../../src/webEnvExtensions/serialization/convertDataToSerializable.ts";
import { type WindowEx, testMatcher } from "../testMatcher.testUtils.ts";

// eslint-disable-next-line playwright/require-hook
testMatcher("closeTo", {
    beforeEach: async (page) => {
        await page.evaluate(() => {
            (window as unknown as WindowEx).testCases = {
                pass: [
                    {
                        name: "number-int - eq",
                        value: 123,
                        matcherArgs: [window.playwrightUtils.expect.closeTo(123)],
                    },
                    {
                        name: "number-float - eq",
                        value: 123.45,
                        matcherArgs: [window.playwrightUtils.expect.closeTo(123.45)],
                    },
                    {
                        name: "number-float - close",
                        value: 123.456,
                        matcherArgs: [window.playwrightUtils.expect.closeTo(123.4565)],
                    },
                    {
                        name: "number-float - close, precision-0",
                        value: 123.0,
                        matcherArgs: [window.playwrightUtils.expect.closeTo(123.4, 0)],
                    },
                    {
                        name: "number-float - close, precision-5",
                        value: 123.456789,
                        matcherArgs: [window.playwrightUtils.expect.closeTo(123.4567895, 5)],
                    },
                    {
                        name: "number-float - close, precision=-1",
                        value: 123.5,
                        matcherArgs: [window.playwrightUtils.expect.closeTo(124.5, -1)],
                    },
                    {
                        name: "infinity",
                        value: Number.POSITIVE_INFINITY,
                        matcherArgs: [window.playwrightUtils.expect.closeTo(Number.POSITIVE_INFINITY)],
                    },
                    {
                        name: "negative infinity",
                        value: Number.NEGATIVE_INFINITY,
                        matcherArgs: [window.playwrightUtils.expect.closeTo(Number.NEGATIVE_INFINITY)],
                    },
                    {
                        name: "zero and negative zero",
                        value: 0,
                        matcherArgs: [window.playwrightUtils.expect.closeTo(-0)],
                    },
                    {
                        name: "number-float - not close; not.closeTo",
                        value: 123.45,
                        matcherArgs: [window.playwrightUtils.expect.not.closeTo(123.46)],
                    },
                ],
                fail: [
                    {
                        name: "number-int - different",
                        value: 123,
                        matcherArgs: [window.playwrightUtils.expect.closeTo(125)],
                    },
                    {
                        name: "number-float - not close",
                        value: 123.45,
                        matcherArgs: [window.playwrightUtils.expect.closeTo(123.46)],
                    },
                    {
                        name: "number-float - not close",
                        value: 123.456,
                        matcherArgs: [window.playwrightUtils.expect.closeTo(123.466)],
                    },
                    {
                        name: "number-float - not close, precision-0",
                        value: 123.0,
                        matcherArgs: [window.playwrightUtils.expect.closeTo(123.5, 0)],
                    },
                    {
                        name: "number-float - not close, precision-5",
                        value: 123.456789,
                        matcherArgs: [window.playwrightUtils.expect.closeTo(123.457789, 5)],
                    },
                    {
                        name: "number-float - not close, precision=-1",
                        value: 123.5,
                        matcherArgs: [window.playwrightUtils.expect.closeTo(144.5, -1)],
                    },
                    {
                        name: "infinity and negative infinity",
                        value: Number.POSITIVE_INFINITY,
                        matcherArgs: [window.playwrightUtils.expect.closeTo(Number.NEGATIVE_INFINITY)],
                    },
                    {
                        name: "string",
                        value: "test123",
                        matcherArgs: [window.playwrightUtils.expect.closeTo(123)],
                    },
                    {
                        name: "bigint",
                        value: 1234567890123456789012345678901234567890n,
                        matcherArgs: [window.playwrightUtils.expect.closeTo(123)],
                    },
                    {
                        name: "boolean",
                        value: true,
                        matcherArgs: [window.playwrightUtils.expect.closeTo(123)],
                    },
                    {
                        name: "null",
                        value: null,
                        matcherArgs: [window.playwrightUtils.expect.closeTo(123)],
                    },
                    {
                        name: "undefined",
                        value: undefined,
                        matcherArgs: [window.playwrightUtils.expect.closeTo(123)],
                    },
                    {
                        name: "function",
                        value: () => {},
                        matcherArgs: [window.playwrightUtils.expect.closeTo(123)],
                    },
                    {
                        name: "symbol",
                        value: Symbol("test"),
                        matcherArgs: [window.playwrightUtils.expect.closeTo(123)],
                    },
                    {
                        name: "object",
                        value: { id: "123" },
                        matcherArgs: [window.playwrightUtils.expect.closeTo(123)],
                    },
                    {
                        name: "array",
                        value: [1, 2, 3],
                        matcherArgs: [window.playwrightUtils.expect.closeTo(123)],
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
                        name: "string-value",
                        matcherArgs: ["test123"],
                    },
                    {
                        name: "bigint-value",
                        matcherArgs: [1234567890123456789012345678901234567890n],
                    },
                    {
                        name: "boolean-value",
                        matcherArgs: [true],
                    },
                    {
                        name: "null-value",
                        matcherArgs: [null],
                    },
                    {
                        name: "undefined-value",
                        matcherArgs: [undefined],
                    },
                    {
                        name: "function-value",
                        matcherArgs: [() => {}],
                    },
                    {
                        name: "symbol-value",
                        matcherArgs: [Symbol("test")],
                    },
                    {
                        name: "object-value",
                        matcherArgs: [Symbol("test")],
                    },
                    {
                        name: "array-value",
                        matcherArgs: [[1, 2, 3]],
                    },
                    {
                        name: "string-precision",
                        matcherArgs: [123.45, "test123"],
                    },
                    {
                        name: "bigint-precision",
                        matcherArgs: [123.45, 1234567890123456789012345678901234567890n],
                    },
                    {
                        name: "boolean-precision",
                        matcherArgs: [123.45, true],
                    },
                    {
                        name: "null-precision",
                        matcherArgs: [123.45, null],
                    },
                    {
                        name: "function-precision",
                        matcherArgs: [123.45, () => {}],
                    },
                    {
                        name: "symbol-precision",
                        matcherArgs: [123.45, Symbol("test")],
                    },
                    {
                        name: "object-precision",
                        matcherArgs: [123.45, Symbol("test")],
                    },
                    {
                        name: "array-precision",
                        matcherArgs: [123.45, [1, 2, 3]],
                    },
                ];
                for (const testCase of testCases) {
                    test(`should fail for matcherArg: ${testCase.name}`, async ({ page }) => {
                        const isOk = await page.evaluate((matcherArgs) => {
                            const matcherArgsWeb = window.playwrightUtils.convertDataFromSerializable(matcherArgs) as typeof matcherArgs;
                            window.playwrightUtils
                                .expect(() => {
                                    window.playwrightUtils.expect.closeTo(...(matcherArgsWeb as unknown as [number, number?]));
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
