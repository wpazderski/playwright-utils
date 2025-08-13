/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { type Page, expect, test } from "@playwright/test";
import { PageUtils } from "../../../../src/PageUtils.ts";
import { type AsymmetricMatcherName, isAsymmetricMatcherName } from "../../../../src/webEnvExtensions/assertions/matchers/asymmetric/AsymmetricMatcher.ts";
import type { MatcherName } from "../../../../src/webEnvExtensions/assertions/matchers/types.ts";
import { setupWebEnvExtensions } from "../../../../src/webEnvExtensions/setupWebEnvExtensions.ts";

export function testMatcher(matcherOrAsymmetricMatcherName: MatcherName | AsymmetricMatcherName, extraTests?: ExtraTests): void {
    const isAsymmetric = isAsymmetricMatcherName(matcherOrAsymmetricMatcherName);
    const matcherName: MatcherName = isAsymmetric ? "toEqual" : matcherOrAsymmetricMatcherName;

    test.describe("Web env", () => {
        test.beforeEach(async ({ page }) => {
            await page.goto("/");
            PageUtils.pipeWebConsoleToStdout(page);
            await setupWebEnvExtensions(page);
            await page.evaluate(() => {
                (window as unknown as WindowEx).runPassingTestCases = async (runner, isNot, promise) => {
                    const testCases = (window as unknown as WindowEx).testCases[isNot === true ? "fail" : "pass"];
                    for (const testCase of testCases) {
                        if (testCase.skipPromised === true && promise !== undefined) {
                            continue;
                        }
                        let didThrow = false;
                        try {
                            await runner(testCase);
                        } catch {
                            didThrow = true;
                        }
                        if (didThrow) {
                            throw new Error(`Expected test case "${testCase.name}" to pass, but it failed.`);
                        }
                    }
                };
                (window as unknown as WindowEx).runFailingTestCases = async (runner, isNot, promise) => {
                    const testCases = [
                        ...(window as unknown as WindowEx).testCases[isNot === true ? "pass" : "fail"],
                        ...((window as unknown as WindowEx).testCases.alwaysFail ?? []),
                    ];
                    for (const testCase of testCases) {
                        if (testCase.skipPromised === true && promise !== undefined) {
                            continue;
                        }
                        let didThrow = false;
                        try {
                            await runner(testCase);
                        } catch {
                            didThrow = true;
                        }
                        if (!didThrow) {
                            throw new Error(`Expected test case "${testCase.name}" to fail, but it passed.`);
                        }
                    }
                };

                (window as unknown as WindowEx).addTestCasesWithSwappedValueAndFirstMatcherArg = <T extends TestCase[] | TestCases>(testCases: T): T => {
                    if (Array.isArray(testCases)) {
                        const testCasesArr = testCases as unknown as TestCase[];
                        const newTestCases: TestCase[] = [...testCasesArr];
                        for (const testCase of testCasesArr) {
                            const swappedTestCase: TestCase = {
                                name: `${testCase.name} (reversed received and expected values)`,
                                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                                value: testCase.matcherArgs[0],
                                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                                matcherArgs: [testCase.value, ...testCase.matcherArgs.slice(1)],
                            };
                            newTestCases.push(swappedTestCase);
                        }
                        return newTestCases as T;
                    } else {
                        const newTestCases: TestCases = {
                            pass: (window as unknown as WindowEx).addTestCasesWithSwappedValueAndFirstMatcherArg(testCases.pass),
                            fail: (window as unknown as WindowEx).addTestCasesWithSwappedValueAndFirstMatcherArg(testCases.fail),
                        };
                        if (testCases.alwaysFail) {
                            newTestCases.alwaysFail = (window as unknown as WindowEx).addTestCasesWithSwappedValueAndFirstMatcherArg(testCases.alwaysFail);
                        }
                        return newTestCases as T;
                    }
                };
                (window as unknown as WindowEx).runTestCases = async (runner, isNot, promise) => {
                    await (window as unknown as WindowEx).runPassingTestCases(runner, isNot, promise);
                    await (window as unknown as WindowEx).runFailingTestCases(runner, isNot, promise);
                };
            });
            await extraTests?.beforeEach?.(page);
        });

        // eslint-disable-next-line playwright/valid-title
        test.describe(isAsymmetric ? `expect.${matcherOrAsymmetricMatcherName}()` : `expect().${matcherName}()`, () => {
            test("should assert correctly", async ({ page }) => {
                const isOK = await page.evaluate(
                    // eslint-disable-next-line @typescript-eslint/no-shadow
                    async ([matcherName]) => {
                        const testCaseRunner: TestCaseRunner = (testCase) => {
                            (window.playwrightUtils.expect(testCase.value)[matcherName] as any)(...(testCase.matcherArgs as []));
                        };
                        await (window as unknown as WindowEx).runTestCases(testCaseRunner);
                        return true;
                    },
                    [matcherName] as const,
                );
                expect(isOK).toBe(true);
            });

            test("should assert correctly with `not`", async ({ page }) => {
                const isOK = await page.evaluate(
                    // eslint-disable-next-line @typescript-eslint/no-shadow
                    async ([matcherName]) => {
                        const testCaseRunner: TestCaseRunner = (testCase) => {
                            (window.playwrightUtils.expect(testCase.value).not[matcherName] as any)(...(testCase.matcherArgs as []));
                        };
                        await (window as unknown as WindowEx).runTestCases(testCaseRunner, true);
                        return true;
                    },
                    [matcherName] as const,
                );
                expect(isOK).toBe(true);
            });

            test("should assert correctly with `resolves`", async ({ page }) => {
                const isOK = await page.evaluate(
                    // eslint-disable-next-line @typescript-eslint/no-shadow
                    async ([matcherName]) => {
                        const testCaseRunner: TestCaseRunner = async (testCase) => {
                            await (window.playwrightUtils.expect(Promise.resolve(testCase.value)) as any).resolves[matcherName](...(testCase.matcherArgs as []));
                        };
                        await (window as unknown as WindowEx).runTestCases(testCaseRunner, false, "resolves");
                        return true;
                    },
                    [matcherName] as const,
                );
                expect(isOK).toBe(true);
            });

            test("should assert correctly with `rejects`", async ({ page }) => {
                const isOK = await page.evaluate(
                    // eslint-disable-next-line @typescript-eslint/no-shadow
                    async ([matcherName]) => {
                        const testCaseRunner: TestCaseRunner = async (testCase) => {
                            if (testCase.skipPromised === true) {
                                return;
                            }
                            // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
                            await (window.playwrightUtils.expect(Promise.reject(testCase.value)).rejects[matcherName] as any)(...(testCase.matcherArgs as []));
                        };
                        await (window as unknown as WindowEx).runTestCases(testCaseRunner, false, "rejects");
                        return true;
                    },
                    [matcherName] as const,
                );
                expect(isOK).toBe(true);
            });

            test("should assert correctly with `resolves.not` and `not.resolves`", async ({ page }) => {
                const isOK = await page.evaluate(
                    // eslint-disable-next-line @typescript-eslint/no-shadow
                    async ([matcherName]) => {
                        const testCaseRunner: TestCaseRunner = async (testCase) => {
                            if (testCase.skipPromised === true) {
                                return;
                            }
                            await (window.playwrightUtils.expect(Promise.resolve(testCase.value)).resolves.not[matcherName] as any)(...(testCase.matcherArgs as []));
                            await (window.playwrightUtils.expect(Promise.resolve(testCase.value)).not.resolves[matcherName] as any)(...(testCase.matcherArgs as []));
                        };
                        await (window as unknown as WindowEx).runTestCases(testCaseRunner, true, "resolves");
                        return true;
                    },
                    [matcherName] as const,
                );
                expect(isOK).toBe(true);
            });

            test("should assert correctly with `rejects.not` and `not.rejects`", async ({ page }) => {
                const isOK = await page.evaluate(
                    // eslint-disable-next-line @typescript-eslint/no-shadow
                    async ([matcherName]) => {
                        const testCaseRunner: TestCaseRunner = async (testCase) => {
                            if (testCase.skipPromised === true) {
                                return;
                            }
                            // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
                            await (window.playwrightUtils.expect(Promise.reject(testCase.value)).rejects.not[matcherName] as any)(...(testCase.matcherArgs as []));
                            // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
                            await (window.playwrightUtils.expect(Promise.reject(testCase.value)).not.rejects[matcherName] as any)(...(testCase.matcherArgs as []));
                        };
                        await (window as unknown as WindowEx).runTestCases(testCaseRunner, true, "rejects");
                        return true;
                    },
                    [matcherName] as const,
                );
                expect(isOK).toBe(true);
            });

            extraTests?.expectMatcher?.extraExpectMatcherBlock?.();
        });
    });
}

export type TestCaseRunner = (testCase: TestCase) => Promise<void> | void;

export interface WindowEx extends Window {
    testCases: TestCases;
    runPassingTestCases: (runner: TestCaseRunner, isNot?: boolean, promise?: "resolves" | "rejects") => Promise<void>;
    runFailingTestCases: (runner: TestCaseRunner, isNot?: boolean, promise?: "resolves" | "rejects") => Promise<void>;
    runTestCases: (runner: TestCaseRunner, isNot?: boolean, promise?: "resolves" | "rejects") => Promise<void>;
    addTestCasesWithSwappedValueAndFirstMatcherArg: <T extends TestCase[] | TestCases>(testCases: T) => T;
}

export interface TestCases {
    /**
     * TestCases that shouldpass when isNot=false and fail when isNot=true.
     */
    pass: TestCase[];

    /**
     * TestCases that should fail when isNot=false and pass when isNot=true.
     */
    fail: TestCase[];

    /**
     * TestCases that should fail regardless of isNot.
     */
    alwaysFail?: TestCase[] | undefined;
}

export interface TestCase {
    name: string;
    value: any;
    matcherArgs: any[];
    skipPromised?: boolean | undefined;
}

export interface ExtraTests {
    beforeEach?: ((page: Page) => Promise<void> | void) | undefined;
    expectMatcher?: {
        extraExpectMatcherBlock?: (() => void) | undefined;
    };
}
