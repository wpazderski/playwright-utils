import { expect, test } from "@playwright/test";
import { convertDataToSerializable } from "../../../../../src/webEnvExtensions/serialization/convertDataToSerializable.ts";
import { type WindowEx, testMatcher } from "../testMatcher.testUtils.ts";

// eslint-disable-next-line playwright/require-hook
testMatcher("any", {
    beforeEach: async (page) => {
        await page.evaluate(() => {
            class BaseClass {}
            class DerivedClass extends BaseClass {}
            class AnotherClass {}
            const baseClassObj = new BaseClass();
            const derivedClassObj = new DerivedClass();
            const anotherClassObj = new AnotherClass();
            (window as unknown as WindowEx).testCases = {
                pass: [
                    {
                        name: "string given, String expected",
                        value: "test123",
                        matcherArgs: [window.playwrightUtils.expect.any(String)],
                    },
                    {
                        name: "number given, Number expected",
                        value: 123,
                        matcherArgs: [window.playwrightUtils.expect.any(Number)],
                    },
                    {
                        name: "bigint given, BigInt expected",
                        value: 1234567890123456789012345678901234567890n,
                        matcherArgs: [window.playwrightUtils.expect.any(BigInt)],
                    },
                    {
                        name: "boolean given, Boolean expected",
                        value: true,
                        matcherArgs: [window.playwrightUtils.expect.any(Boolean)],
                    },
                    {
                        name: "function given, Function expected",
                        value: () => {},
                        matcherArgs: [window.playwrightUtils.expect.any(Function)],
                    },
                    {
                        name: "symbol given, Symbol expected",
                        value: Symbol("test"),
                        matcherArgs: [window.playwrightUtils.expect.any(Symbol)],
                    },
                    {
                        name: "object given, Object expected",
                        value: { id: "123" },
                        matcherArgs: [window.playwrightUtils.expect.any(Object)],
                    },
                    {
                        name: "array given, Array expected",
                        value: [1, 2, 3],
                        matcherArgs: [window.playwrightUtils.expect.any(Array)],
                    },
                    {
                        name: "Date instance given, Date expected",
                        value: new Date(),
                        matcherArgs: [window.playwrightUtils.expect.any(Date)],
                    },
                    {
                        name: "BaseClass instance given, BaseClass expected",
                        value: baseClassObj,
                        matcherArgs: [window.playwrightUtils.expect.any(BaseClass)],
                    },
                    {
                        name: "DerivedClass instance given, BaseClass expected",
                        value: derivedClassObj,
                        matcherArgs: [window.playwrightUtils.expect.any(BaseClass)],
                    },
                    {
                        name: "DerivedClass instance given, DerivedClass expected",
                        value: derivedClassObj,
                        matcherArgs: [window.playwrightUtils.expect.any(DerivedClass)],
                    },
                ],
                fail: [
                    {
                        name: "string given, Number expected",
                        value: "test123",
                        matcherArgs: [window.playwrightUtils.expect.any(Number)],
                    },
                    {
                        name: "Date instance given, Number expected",
                        value: new Date(),
                        matcherArgs: [window.playwrightUtils.expect.any(Number)],
                    },
                    {
                        name: "AnotherClass instance given, BaseClass expected",
                        value: anotherClassObj,
                        matcherArgs: [window.playwrightUtils.expect.any(BaseClass)],
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
                        name: "undefined-value",
                        matcherArgs: [undefined],
                    },
                ];
                for (const testCase of testCases) {
                    test(`should fail for matcherArg: ${testCase.name}`, async ({ page }) => {
                        const isOk = await page.evaluate((matcherArgs) => {
                            const matcherArgsWeb = window.playwrightUtils.convertDataFromSerializable(matcherArgs) as typeof matcherArgs;
                            window.playwrightUtils
                                .expect(() => {
                                    window.playwrightUtils.expect.any(...(matcherArgsWeb as unknown as [unknown]));
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
