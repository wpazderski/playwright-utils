import { type WindowEx, testMatcher } from "./testMatcher.testUtils.ts";

// eslint-disable-next-line playwright/require-hook
testMatcher("toBeInstanceOf", {
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
                        name: "baseClassObj instanceof BaseClass",
                        value: baseClassObj,
                        matcherArgs: [BaseClass],
                    },
                    {
                        name: "derivedClassObj instanceof BaseClass",
                        value: derivedClassObj,
                        matcherArgs: [BaseClass],
                    },
                    {
                        name: "derivedClassObj instanceof DerivedClass",
                        value: derivedClassObj,
                        matcherArgs: [DerivedClass],
                    },
                ],
                fail: [
                    {
                        name: "baseClassObj instanceof DerivedClass",
                        value: baseClassObj,
                        matcherArgs: [DerivedClass],
                    },
                    {
                        name: "anotherClassObj instanceof BaseClass",
                        value: anotherClassObj,
                        matcherArgs: [BaseClass],
                    },
                    {
                        name: "anotherClassObj instanceof DerivedClass",
                        value: anotherClassObj,
                        matcherArgs: [DerivedClass],
                    },
                ],
                alwaysFail: [
                    {
                        name: "string expected value",
                        value: new BaseClass(),
                        matcherArgs: ["test123"],
                    },
                    {
                        name: "number expected value",
                        value: new BaseClass(),
                        matcherArgs: [123],
                    },
                    {
                        name: "bigint expected value",
                        value: new BaseClass(),
                        matcherArgs: [1234567890123456789012345678901234567890n],
                    },
                    {
                        name: "boolean expected value",
                        value: new BaseClass(),
                        matcherArgs: [true],
                    },
                    {
                        name: "null expected value",
                        value: new BaseClass(),
                        matcherArgs: [null],
                    },
                    {
                        name: "undefined expected value",
                        value: new BaseClass(),
                        matcherArgs: [undefined],
                    },
                    {
                        name: "symbol expected value",
                        value: new BaseClass(),
                        matcherArgs: [Symbol("test")],
                    },
                    {
                        name: "object expected value",
                        value: new BaseClass(),
                        matcherArgs: [{ id: "123" }],
                    },
                    {
                        name: "array expected value",
                        value: new BaseClass(),
                        matcherArgs: [[1, 2, 3]],
                    },
                ],
            };
        });
    },
});
