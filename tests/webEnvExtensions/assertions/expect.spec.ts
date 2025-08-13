import { expect, test } from "@playwright/test";
import { PageUtils } from "../../../src/PageUtils.ts";
import type { MatcherInternalOptions } from "../../../src/webEnvExtensions/assertions/expect.ts";
import { setupWebEnvExtensions } from "../../../src/webEnvExtensions/setupWebEnvExtensions.ts";

interface ToBeCloseToMatcherCall {
    internalOptions: MatcherInternalOptions;
    received: number;
    expected: number;
    precision?: number | undefined;
}

test.describe("Web env", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/");
        PageUtils.pipeWebConsoleToStdout(page);
        await setupWebEnvExtensions(page);
    });

    test.describe("expect()", () => {
        test("should call matchers with correct args", async ({ page }) => {
            const matcherCalls = await page.evaluate(() => {
                // eslint-disable-next-line @typescript-eslint/no-shadow
                const matcherCalls: ToBeCloseToMatcherCall[] = [];
                window.playwrightUtils.assertions.expect.__test_overrideMatchers({
                    // eslint-disable-next-line @typescript-eslint/max-params
                    toBeCloseTo: (internalOptions: MatcherInternalOptions, received: number, expected: number, precision?: number) => {
                        matcherCalls.push({ internalOptions: internalOptions, received: received, expected: expected, precision: precision });
                    },
                });
                window.playwrightUtils.expect(123.45).toBeCloseTo(6.78);
                window.playwrightUtils.expect(123.45).toBeCloseTo(6.78, 9);
                window.playwrightUtils.expect(123.45, "lorem ipsum").toBeCloseTo(6.78, 9);
                return matcherCalls;
            });
            expect(matcherCalls).toStrictEqual([
                {
                    internalOptions: { isNot: false, promiseExpectedState: undefined, message: undefined },
                    received: 123.45,
                    expected: 6.78,
                    precision: undefined,
                },
                {
                    internalOptions: { isNot: false, promiseExpectedState: undefined, message: undefined },
                    received: 123.45,
                    expected: 6.78,
                    precision: 9,
                },
                {
                    internalOptions: { isNot: false, promiseExpectedState: undefined, message: "lorem ipsum" },
                    received: 123.45,
                    expected: 6.78,
                    precision: 9,
                },
            ]);
        });

        test("should assert correctly with `not`", async ({ page }) => {
            const matcherCalls = await page.evaluate(() => {
                // eslint-disable-next-line @typescript-eslint/no-shadow
                const matcherCalls: ToBeCloseToMatcherCall[] = [];
                window.playwrightUtils.assertions.expect.__test_overrideMatchers({
                    // eslint-disable-next-line @typescript-eslint/max-params
                    toBeCloseTo: (internalOptions: MatcherInternalOptions, received: number, expected: number, precision?: number) => {
                        matcherCalls.push({ internalOptions: internalOptions, received: received, expected: expected, precision: precision });
                    },
                });
                window.playwrightUtils.expect(123.45).not.toBeCloseTo(6.78);
                window.playwrightUtils.expect(123.45).not.toBeCloseTo(6.78, 9);
                window.playwrightUtils.expect(123.45, "lorem ipsum").not.toBeCloseTo(6.78, 9);
                return matcherCalls;
            });
            expect(matcherCalls).toStrictEqual([
                {
                    internalOptions: { isNot: true, promiseExpectedState: undefined, message: undefined },
                    received: 123.45,
                    expected: 6.78,
                    precision: undefined,
                },
                {
                    internalOptions: { isNot: true, promiseExpectedState: undefined, message: undefined },
                    received: 123.45,
                    expected: 6.78,
                    precision: 9,
                },
                {
                    internalOptions: { isNot: true, promiseExpectedState: undefined, message: "lorem ipsum" },
                    received: 123.45,
                    expected: 6.78,
                    precision: 9,
                },
            ]);
        });

        test("should assert correctly with `resolves`", async ({ page }) => {
            const matcherCalls = await page.evaluate(async () => {
                // eslint-disable-next-line @typescript-eslint/no-shadow
                const matcherCalls: ToBeCloseToMatcherCall[] = [];
                window.playwrightUtils.assertions.expect.__test_overrideMatchers({
                    // eslint-disable-next-line @typescript-eslint/max-params
                    toBeCloseTo: (internalOptions: MatcherInternalOptions, received: number, expected: number, precision?: number) => {
                        matcherCalls.push({ internalOptions: internalOptions, received: received, expected: expected, precision: precision });
                    },
                });
                await window.playwrightUtils.expect(Promise.resolve(123.45)).resolves.toBeCloseTo(6.78);
                await window.playwrightUtils.expect(Promise.resolve(123.45)).resolves.toBeCloseTo(6.78, 9);
                await window.playwrightUtils.expect(Promise.resolve(123.45), "lorem ipsum").resolves.toBeCloseTo(6.78, 9);

                let didThrow1 = false;
                try {
                    await window.playwrightUtils.expect(123.45).resolves.toBeCloseTo(6.78);
                } catch {
                    didThrow1 = true;
                }
                if (!didThrow1) {
                    throw new Error("Expected to throw when calling `resolves` on non-promise value");
                }

                let didThrow2 = false;
                try {
                    // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
                    await window.playwrightUtils.expect(Promise.reject(123.45)).resolves.toBeCloseTo(6.78);
                } catch {
                    didThrow2 = true;
                }
                if (!didThrow2) {
                    throw new Error("Expected to throw when calling `resolves` on rejected promise");
                }

                return matcherCalls;
            });
            expect(matcherCalls).toStrictEqual([
                {
                    internalOptions: { isNot: false, promiseExpectedState: "resolves", message: undefined },
                    received: 123.45,
                    expected: 6.78,
                    precision: undefined,
                },
                {
                    internalOptions: { isNot: false, promiseExpectedState: "resolves", message: undefined },
                    received: 123.45,
                    expected: 6.78,
                    precision: 9,
                },
                {
                    internalOptions: { isNot: false, promiseExpectedState: "resolves", message: "lorem ipsum" },
                    received: 123.45,
                    expected: 6.78,
                    precision: 9,
                },
            ]);
        });

        test("should assert correctly with `rejects`", async ({ page }) => {
            const matcherCalls = await page.evaluate(async () => {
                // eslint-disable-next-line @typescript-eslint/no-shadow
                const matcherCalls: ToBeCloseToMatcherCall[] = [];
                window.playwrightUtils.assertions.expect.__test_overrideMatchers({
                    // eslint-disable-next-line @typescript-eslint/max-params
                    toBeCloseTo: (internalOptions: MatcherInternalOptions, received: number, expected: number, precision?: number) => {
                        matcherCalls.push({ internalOptions: internalOptions, received: received, expected: expected, precision: precision });
                    },
                });
                // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
                await window.playwrightUtils.expect(Promise.reject(123.45)).rejects.toBeCloseTo(6.78);
                // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
                await window.playwrightUtils.expect(Promise.reject(123.45)).rejects.toBeCloseTo(6.78, 9);
                // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
                await window.playwrightUtils.expect(Promise.reject(123.45), "lorem ipsum").rejects.toBeCloseTo(6.78, 9);

                let didThrow1 = false;
                try {
                    await window.playwrightUtils.expect(123.45).rejects.toBeCloseTo(6.78);
                } catch {
                    didThrow1 = true;
                }
                if (!didThrow1) {
                    throw new Error("Expected to throw when calling `rejects` on non-promise value");
                }

                let didThrow2 = false;
                try {
                    await window.playwrightUtils.expect(Promise.resolve(123.45)).rejects.toBeCloseTo(6.78);
                } catch {
                    didThrow2 = true;
                }
                if (!didThrow2) {
                    throw new Error("Expected to throw when calling `rejects` on resolved promise");
                }

                return matcherCalls;
            });
            expect(matcherCalls).toStrictEqual([
                {
                    internalOptions: { isNot: false, promiseExpectedState: "rejects", message: undefined },
                    received: 123.45,
                    expected: 6.78,
                    precision: undefined,
                },
                {
                    internalOptions: { isNot: false, promiseExpectedState: "rejects", message: undefined },
                    received: 123.45,
                    expected: 6.78,
                    precision: 9,
                },
                {
                    internalOptions: { isNot: false, promiseExpectedState: "rejects", message: "lorem ipsum" },
                    received: 123.45,
                    expected: 6.78,
                    precision: 9,
                },
            ]);
        });

        test("should assert correctly with `resolves.not` and `not.resolves`", async ({ page }) => {
            const matcherCalls = await page.evaluate(async () => {
                // eslint-disable-next-line @typescript-eslint/no-shadow
                const matcherCalls: ToBeCloseToMatcherCall[] = [];
                window.playwrightUtils.assertions.expect.__test_overrideMatchers({
                    // eslint-disable-next-line @typescript-eslint/max-params
                    toBeCloseTo: (internalOptions: MatcherInternalOptions, received: number, expected: number, precision?: number) => {
                        matcherCalls.push({ internalOptions: internalOptions, received: received, expected: expected, precision: precision });
                    },
                });
                await window.playwrightUtils.expect(Promise.resolve(123.45)).resolves.not.toBeCloseTo(6.78);
                await window.playwrightUtils.expect(Promise.resolve(123.45)).resolves.not.toBeCloseTo(6.78, 9);
                await window.playwrightUtils.expect(Promise.resolve(123.45), "lorem ipsum").resolves.not.toBeCloseTo(6.78, 9);
                await window.playwrightUtils.expect(Promise.resolve(123.45)).not.resolves.toBeCloseTo(6.78);
                await window.playwrightUtils.expect(Promise.resolve(123.45)).not.resolves.toBeCloseTo(6.78, 9);
                await window.playwrightUtils.expect(Promise.resolve(123.45), "lorem ipsum").not.resolves.toBeCloseTo(6.78, 9);

                let didThrow1 = false;
                try {
                    await window.playwrightUtils.expect(123.45).resolves.not.toBeCloseTo(6.78);
                } catch {
                    didThrow1 = true;
                }
                if (!didThrow1) {
                    throw new Error("Expected to throw when calling `resolves.not` on non-promise value");
                }

                let didThrow2 = false;
                try {
                    // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
                    await window.playwrightUtils.expect(Promise.reject(123.45)).resolves.not.toBeCloseTo(6.78);
                } catch {
                    didThrow2 = true;
                }
                if (!didThrow2) {
                    throw new Error("Expected to throw when calling `resolves.not` on rejected promise");
                }

                let didThrow3 = false;
                try {
                    await window.playwrightUtils.expect(123.45).not.resolves.toBeCloseTo(6.78);
                } catch {
                    didThrow3 = true;
                }
                if (!didThrow3) {
                    throw new Error("Expected to throw when calling `not.resolves` on non-promise value");
                }

                let didThrow4 = false;
                try {
                    // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
                    await window.playwrightUtils.expect(Promise.reject(123.45)).not.resolves.toBeCloseTo(6.78);
                } catch {
                    didThrow4 = true;
                }
                if (!didThrow4) {
                    throw new Error("Expected to throw when calling `not.resolves` on rejected promise");
                }

                return matcherCalls;
            });
            expect(matcherCalls).toStrictEqual([
                {
                    internalOptions: { isNot: true, promiseExpectedState: "resolves", message: undefined },
                    received: 123.45,
                    expected: 6.78,
                    precision: undefined,
                },
                {
                    internalOptions: { isNot: true, promiseExpectedState: "resolves", message: undefined },
                    received: 123.45,
                    expected: 6.78,
                    precision: 9,
                },
                {
                    internalOptions: { isNot: true, promiseExpectedState: "resolves", message: "lorem ipsum" },
                    received: 123.45,
                    expected: 6.78,
                    precision: 9,
                },
                {
                    internalOptions: { isNot: true, promiseExpectedState: "resolves", message: undefined },
                    received: 123.45,
                    expected: 6.78,
                    precision: undefined,
                },
                {
                    internalOptions: { isNot: true, promiseExpectedState: "resolves", message: undefined },
                    received: 123.45,
                    expected: 6.78,
                    precision: 9,
                },
                {
                    internalOptions: { isNot: true, promiseExpectedState: "resolves", message: "lorem ipsum" },
                    received: 123.45,
                    expected: 6.78,
                    precision: 9,
                },
            ]);
        });

        test("should assert correctly with `rejects.not` and `not.rejects`", async ({ page }) => {
            const matcherCalls = await page.evaluate(async () => {
                // eslint-disable-next-line @typescript-eslint/no-shadow
                const matcherCalls: ToBeCloseToMatcherCall[] = [];
                window.playwrightUtils.assertions.expect.__test_overrideMatchers({
                    // eslint-disable-next-line @typescript-eslint/max-params
                    toBeCloseTo: (internalOptions: MatcherInternalOptions, received: number, expected: number, precision?: number) => {
                        matcherCalls.push({ internalOptions: internalOptions, received: received, expected: expected, precision: precision });
                    },
                });
                // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
                await window.playwrightUtils.expect(Promise.reject(123.45)).rejects.not.toBeCloseTo(6.78);
                // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
                await window.playwrightUtils.expect(Promise.reject(123.45)).rejects.not.toBeCloseTo(6.78, 9);
                // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
                await window.playwrightUtils.expect(Promise.reject(123.45), "lorem ipsum").rejects.not.toBeCloseTo(6.78, 9);
                // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
                await window.playwrightUtils.expect(Promise.reject(123.45)).not.rejects.toBeCloseTo(6.78);
                // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
                await window.playwrightUtils.expect(Promise.reject(123.45)).not.rejects.toBeCloseTo(6.78, 9);
                // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
                await window.playwrightUtils.expect(Promise.reject(123.45), "lorem ipsum").not.rejects.toBeCloseTo(6.78, 9);

                let didThrow1 = false;
                try {
                    await window.playwrightUtils.expect(123.45).rejects.not.toBeCloseTo(6.78);
                } catch {
                    didThrow1 = true;
                }
                if (!didThrow1) {
                    throw new Error("Expected to throw when calling `rejects.not` on non-promise value");
                }

                let didThrow2 = false;
                try {
                    await window.playwrightUtils.expect(Promise.resolve(123.45)).rejects.not.toBeCloseTo(6.78);
                } catch {
                    didThrow2 = true;
                }
                if (!didThrow2) {
                    throw new Error("Expected to throw when calling `rejects.not` on resolved promise");
                }

                let didThrow3 = false;
                try {
                    await window.playwrightUtils.expect(123.45).not.rejects.toBeCloseTo(6.78);
                } catch {
                    didThrow3 = true;
                }
                if (!didThrow3) {
                    throw new Error("Expected to throw when calling `not.rejects` on non-promise value");
                }

                let didThrow4 = false;
                try {
                    await window.playwrightUtils.expect(Promise.resolve(123.45)).not.rejects.toBeCloseTo(6.78);
                } catch {
                    didThrow4 = true;
                }
                if (!didThrow4) {
                    throw new Error("Expected to throw when calling `not.rejects` on resolved promise");
                }

                return matcherCalls;
            });
            expect(matcherCalls).toStrictEqual([
                {
                    internalOptions: { isNot: true, promiseExpectedState: "rejects", message: undefined },
                    received: 123.45,
                    expected: 6.78,
                    precision: undefined,
                },
                {
                    internalOptions: { isNot: true, promiseExpectedState: "rejects", message: undefined },
                    received: 123.45,
                    expected: 6.78,
                    precision: 9,
                },
                {
                    internalOptions: { isNot: true, promiseExpectedState: "rejects", message: "lorem ipsum" },
                    received: 123.45,
                    expected: 6.78,
                    precision: 9,
                },
                {
                    internalOptions: { isNot: true, promiseExpectedState: "rejects", message: undefined },
                    received: 123.45,
                    expected: 6.78,
                    precision: undefined,
                },
                {
                    internalOptions: { isNot: true, promiseExpectedState: "rejects", message: undefined },
                    received: 123.45,
                    expected: 6.78,
                    precision: 9,
                },
                {
                    internalOptions: { isNot: true, promiseExpectedState: "rejects", message: "lorem ipsum" },
                    received: 123.45,
                    expected: 6.78,
                    precision: 9,
                },
            ]);
        });
    });
});
