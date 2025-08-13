/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { getType } from "jest-get-type";
import { stringify } from "jest-matcher-utils";
import * as asymmetricMatchers from "./matchers/asymmetric/index.ts";
import { type MatchersFunctions, matchersFunctions } from "./matchers/matchersFunctions.ts";
import { toThrowFromPromiseMatcher } from "./matchers/toThrow.ts";
import { toThrowErrorFromPromiseMatcher } from "./matchers/toThrowErrorMatcher.ts";
import type { MatcherName, Matchers, PromisedMatchers } from "./matchers/types.ts";

// For consistency, assertions module is largely based on Playwright's code: https://github.com/microsoft/playwright/tree/main/packages/playwright/bundles/expect/third_party

/**
 * Internal options passed to matchers.
 */
export interface MatcherInternalOptions {
    /**
     * Whether the matcher is negated (e.g. `expect(...).not.toBe(...)`).
     */
    isNot: boolean;

    /**
     * If the matcher is expected to be called on a promise, this indicates whether it should resolve or reject.
     * If undefined, the matcher is not expected to be called on a promise.
     */
    promiseExpectedState?: "resolves" | "rejects" | undefined;

    /**
     * An optional message to be used in the assertion error; passed as the second argument to {@link expect}.
     */
    message?: string | undefined;
}

/**
 * Indicates the expected resolution state of a promise when using `expect.resolves` or `expect.rejects`.
 */
type MatcherPromiseExpectedState = "resolves" | "rejects";

/**
 * The return type of {@link expect} function. Includes all matchers, negation, and promise resolution/rejection matchers.
 */
export type ExpectReturnType = Matchers & {
    /**
     * Makes the assertion check for the opposite condition. For example, the following code passes:
     *
     * ```js
     * const value = 1;
     * expect(value).not.toBe(2);
     * ```
     *
     */
    not: ExpectReturnType;

    /**
     * Use resolves to unwrap the value of a fulfilled promise so any other
     * matcher can be chained. If the promise is rejected the assertion fails.
     */
    resolves: PromisedMatchers & {
        /**
         * Makes the assertion check for the opposite condition. For example, the following code passes:
         *
         * ```js
         * const value = 1;
         * expect(value).not.toBe(2);
         * ```
         *
         */
        not: PromisedMatchers;
    };

    /**
     * Unwraps the reason of a rejected promise so any other matcher can be chained.
     * If the promise is fulfilled the assertion fails.
     */
    rejects: PromisedMatchers & {
        /**
         * Makes the assertion check for the opposite condition. For example, the following code passes:
         *
         * ```js
         * const value = 1;
         * expect(value).not.toBe(2);
         * ```
         *
         */
        not: PromisedMatchers;
    };
};

/**
 * Represents the result of a promise, either resolved or rejected.
 */
type PromiseResult<T = unknown> =
    | {
          state: "resolved";
          result: T;
      }
    | {
          state: "rejected";
          error: unknown;
      };

/**
 * The main `expect` function that can be used to make test assertions.
 *
 * @param received The value to be tested.
 * @param message An optional message to be used in the assertion error.
 * @returns An object with matcher functions that can be used to assert conditions on the `received` value.
 */
export function expect(received: unknown, message?: string): ExpectReturnType {
    let isNot = false;
    let promiseExpectedState: MatcherPromiseExpectedState | undefined = undefined;
    let matcherName: MatcherName | undefined = undefined;
    const functions: ExpectReturnType = new Proxy(
        {},
        {
            get(_target, functionName, _receiver) {
                if (functionName === "not") {
                    isNot = true;
                    return functions;
                }
                if (functionName === "resolves") {
                    promiseExpectedState = "resolves";
                    return functions;
                }
                if (functionName === "rejects") {
                    promiseExpectedState = "rejects";
                    return functions;
                }
                if (!isMatcherName(functionName as string)) {
                    throw new Error(`Unknown matcher: ${String(functionName)}`);
                }
                matcherName = functionName as MatcherName;
                const isThrowMatcher = matcherName === "toThrow" || matcherName === "toThrowError";
                const isFromPromise = promiseExpectedState === "rejects" || promiseExpectedState === "resolves";
                let matcher = matchersFunctions[matcherName];
                if (isThrowMatcher && isFromPromise) {
                    matcher = matcherName === "toThrow" ? toThrowFromPromiseMatcher : toThrowErrorFromPromiseMatcher;
                }
                const internalOptions: MatcherInternalOptions = {
                    isNot: isNot,
                    promiseExpectedState: promiseExpectedState,
                    message: message,
                };
                if (isFromPromise) {
                    if (!(received instanceof Promise)) {
                        throw new Error(`Expected a promise, but received: ${getType(received)}`);
                    }
                    return async (...args: any[]) => {
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                        const expected = args[0];
                        const extraArgs = args.slice(1);
                        let promiseResult: PromiseResult;
                        try {
                            promiseResult = {
                                state: "resolved",
                                result: await received,
                            };
                        } catch (error) {
                            promiseResult = {
                                state: "rejected",
                                error: error,
                            };
                        }
                        if (promiseExpectedState === "resolves") {
                            if (promiseResult.state !== "resolved") {
                                throw new Error(`Expected promise to resolve, but it was rejected with: ${stringify(promiseResult.error)}`);
                            }
                        } else if (promiseExpectedState === "rejects") {
                            if (promiseResult.state !== "rejected") {
                                throw new Error(`Expected promise to reject, but it resolved with: ${stringify(promiseResult.result)}`);
                            }
                        }
                        const resolvedValue = promiseResult.state === "resolved" ? promiseResult.result : promiseResult.error;
                        (matcher as any)(internalOptions, resolvedValue, expected, ...extraArgs);
                    };
                } else {
                    return (...args: any[]) => {
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                        const expected = args[0];
                        const extraArgs = args.slice(1);
                        (matcher as any)(internalOptions, received, expected, ...extraArgs);
                    };
                }
            },
        },
    ) as ExpectReturnType;
    return functions;
}

/**
 * Negated versions of asymmetric matchers e.g. `expect.not.arrayContaining(...)`.
 * @see {@link expect}
 */
export interface ExpectNotAsymmetricMatchers {
    /**
     * `expect.arrayContaining()` matches an array that contains all of the elements in the expected array, in any order.
     * Note that received array may be a superset of the expected array and contain some extra elements.
     *
     * Use this method inside
     * [expect(value).toEqual(expected)](https://playwright.dev/docs/api/class-genericassertions#generic-assertions-to-equal)
     * to perform pattern matching.
     *
     * **Usage**
     *
     * ```js
     * expect([1, 2, 3]).toEqual(expect.arrayContaining([3, 1]));
     * expect([1, 2, 3]).not.toEqual(expect.arrayContaining([1, 4]));
     * ```
     *
     * @param expected Expected array that is a subset of the received value.
     */
    arrayContaining: typeof asymmetricMatchers.arrayNotContaining;

    /**
     * Compares floating point numbers for approximate equality. Use this method inside
     * [expect(value).toEqual(expected)](https://playwright.dev/docs/api/class-genericassertions#generic-assertions-to-equal)
     * to perform pattern matching. When just comparing two numbers, prefer
     * [expect(value).toBeCloseTo(expected[, numDigits])](https://playwright.dev/docs/api/class-genericassertions#generic-assertions-to-be-close-to).
     *
     * **Usage**
     *
     * ```js
     * expect({ prop: 0.1 + 0.2 }).not.toEqual({ prop: 0.3 });
     * expect({ prop: 0.1 + 0.2 }).toEqual({ prop: expect.closeTo(0.3, 5) });
     * ```
     *
     * @param expected Expected value.
     * @param numDigits The number of decimal digits after the decimal point that must be equal.
     */
    closeTo: typeof asymmetricMatchers.notCloseTo;

    /**
     * `expect.objectContaining()` matches an object that contains and matches all of the properties in the expected
     * object. Note that received object may be a superset of the expected object and contain some extra properties.
     *
     * Use this method inside
     * [expect(value).toEqual(expected)](https://playwright.dev/docs/api/class-genericassertions#generic-assertions-to-equal)
     * to perform pattern matching. Object properties can be matchers to further relax the expectation. See examples.
     *
     * **Usage**
     *
     * ```js
     * // Assert some of the properties.
     * expect({ foo: 1, bar: 2 }).toEqual(expect.objectContaining({ foo: 1 }));
     *
     * // Matchers can be used on the properties as well.
     * expect({ foo: 1, bar: 2 }).toEqual(expect.objectContaining({ bar: expect.any(Number) }));
     *
     * // Complex matching of sub-properties.
     * expect({
     *   list: [1, 2, 3],
     *   obj: { prop: 'Hello world!', another: 'some other value' },
     *   extra: 'extra',
     * }).toEqual(expect.objectContaining({
     *   list: expect.arrayContaining([2, 3]),
     *   obj: expect.objectContaining({ prop: expect.stringContaining('Hello') }),
     * }));
     * ```
     *
     * @param expected Expected object pattern that contains a subset of the properties.
     */
    objectContaining: typeof asymmetricMatchers.objectNotContaining;

    /**
     * `expect.stringContaining()` matches a string that contains the expected substring. Use this method inside
     * [expect(value).toEqual(expected)](https://playwright.dev/docs/api/class-genericassertions#generic-assertions-to-equal)
     * to perform pattern matching.
     *
     * **Usage**
     *
     * ```js
     * expect('Hello world!').toEqual(expect.stringContaining('Hello'));
     * ```
     *
     * @param expected Expected substring.
     */
    stringContaining: typeof asymmetricMatchers.stringNotContaining;

    /**
     * `expect.stringMatching()` matches a received string that in turn matches the expected pattern. Use this method
     * inside
     * [expect(value).toEqual(expected)](https://playwright.dev/docs/api/class-genericassertions#generic-assertions-to-equal)
     * to perform pattern matching.
     *
     * **Usage**
     *
     * ```js
     * expect('123ms').toEqual(expect.stringMatching(/\d+m?s/));
     *
     * // Inside another matcher.
     * expect({
     *   status: 'passed',
     *   time: '123ms',
     * }).toEqual({
     *   status: expect.stringMatching(/passed|failed/),
     *   time: expect.stringMatching(/\d+m?s/),
     * });
     * ```
     *
     * @param expected Pattern that expected string should match.
     */
    stringMatching: typeof asymmetricMatchers.stringNotMatching;
}

export declare namespace expect {
    /**
     * DO NOT USE
     * Internal function to override matchers in tests.
     * This is used for testing purposes only and should not be used in production code.
     * @internal
     */
    // eslint-disable-next-line @typescript-eslint/naming-convention
    export const __test_overrideMatchers: (newMatchers: Partial<MatchersFunctions>) => void;

    /**
     * `expect.any()` matches any object instance created from the
     * [`constructor`](https://playwright.dev/docs/api/class-genericassertions#generic-assertions-any-option-constructor)
     * or a corresponding primitive type. Use it inside
     * [expect(value).toEqual(expected)](https://playwright.dev/docs/api/class-genericassertions#generic-assertions-to-equal)
     * to perform pattern matching.
     *
     * **Usage**
     *
     * ```js
     * // Match instance of a class.
     * class Example {}
     * expect(new Example()).toEqual(expect.any(Example));
     *
     * // Match any number.
     * expect({ prop: 1 }).toEqual({ prop: expect.any(Number) });
     *
     * // Match any string.
     * expect('abc').toEqual(expect.any(String));
     * ```
     *
     * @param constructor Constructor of the expected object like `ExampleClass`, or a primitive boxed type like `Number`.
     */
    export const any: typeof asymmetricMatchers.any;

    /**
     * `expect.anything()` matches everything except `null` and `undefined`. Use it inside
     * [expect(value).toEqual(expected)](https://playwright.dev/docs/api/class-genericassertions#generic-assertions-to-equal)
     * to perform pattern matching.
     *
     * **Usage**
     *
     * ```js
     * const value = { prop: 1 };
     * expect(value).toEqual({ prop: expect.anything() });
     * expect(value).not.toEqual({ otherProp: expect.anything() });
     * ```
     */
    export const anything: typeof asymmetricMatchers.anything;

    /**
     * `expect.arrayContaining()` matches an array that contains all of the elements in the expected array, in any order.
     * Note that received array may be a superset of the expected array and contain some extra elements.
     *
     * Use this method inside
     * [expect(value).toEqual(expected)](https://playwright.dev/docs/api/class-genericassertions#generic-assertions-to-equal)
     * to perform pattern matching.
     *
     * **Usage**
     *
     * ```js
     * expect([1, 2, 3]).toEqual(expect.arrayContaining([3, 1]));
     * expect([1, 2, 3]).not.toEqual(expect.arrayContaining([1, 4]));
     * ```
     *
     * @param expected Expected array that is a subset of the received value.
     */
    export const arrayContaining: typeof asymmetricMatchers.arrayContaining;

    /**
     * Compares floating point numbers for approximate equality. Use this method inside
     * [expect(value).toEqual(expected)](https://playwright.dev/docs/api/class-genericassertions#generic-assertions-to-equal)
     * to perform pattern matching. When just comparing two numbers, prefer
     * [expect(value).toBeCloseTo(expected[, numDigits])](https://playwright.dev/docs/api/class-genericassertions#generic-assertions-to-be-close-to).
     *
     * **Usage**
     *
     * ```js
     * expect({ prop: 0.1 + 0.2 }).not.toEqual({ prop: 0.3 });
     * expect({ prop: 0.1 + 0.2 }).toEqual({ prop: expect.closeTo(0.3, 5) });
     * ```
     *
     * @param expected Expected value.
     * @param numDigits The number of decimal digits after the decimal point that must be equal.
     */
    export const closeTo: typeof asymmetricMatchers.closeTo;

    /**
     * `expect.objectContaining()` matches an object that contains and matches all of the properties in the expected
     * object. Note that received object may be a superset of the expected object and contain some extra properties.
     *
     * Use this method inside
     * [expect(value).toEqual(expected)](https://playwright.dev/docs/api/class-genericassertions#generic-assertions-to-equal)
     * to perform pattern matching. Object properties can be matchers to further relax the expectation. See examples.
     *
     * **Usage**
     *
     * ```js
     * // Assert some of the properties.
     * expect({ foo: 1, bar: 2 }).toEqual(expect.objectContaining({ foo: 1 }));
     *
     * // Matchers can be used on the properties as well.
     * expect({ foo: 1, bar: 2 }).toEqual(expect.objectContaining({ bar: expect.any(Number) }));
     *
     * // Complex matching of sub-properties.
     * expect({
     *   list: [1, 2, 3],
     *   obj: { prop: 'Hello world!', another: 'some other value' },
     *   extra: 'extra',
     * }).toEqual(expect.objectContaining({
     *   list: expect.arrayContaining([2, 3]),
     *   obj: expect.objectContaining({ prop: expect.stringContaining('Hello') }),
     * }));
     * ```
     *
     * @param expected Expected object pattern that contains a subset of the properties.
     */
    export const objectContaining: typeof asymmetricMatchers.objectContaining;

    /**
     * `expect.stringContaining()` matches a string that contains the expected substring. Use this method inside
     * [expect(value).toEqual(expected)](https://playwright.dev/docs/api/class-genericassertions#generic-assertions-to-equal)
     * to perform pattern matching.
     *
     * **Usage**
     *
     * ```js
     * expect('Hello world!').toEqual(expect.stringContaining('Hello'));
     * ```
     *
     * @param expected Expected substring.
     */
    export const stringContaining: typeof asymmetricMatchers.stringContaining;

    /**
     * `expect.stringMatching()` matches a received string that in turn matches the expected pattern. Use this method
     * inside
     * [expect(value).toEqual(expected)](https://playwright.dev/docs/api/class-genericassertions#generic-assertions-to-equal)
     * to perform pattern matching.
     *
     * **Usage**
     *
     * ```js
     * expect('123ms').toEqual(expect.stringMatching(/\d+m?s/));
     *
     * // Inside another matcher.
     * expect({
     *   status: 'passed',
     *   time: '123ms',
     * }).toEqual({
     *   status: expect.stringMatching(/passed|failed/),
     *   time: expect.stringMatching(/\d+m?s/),
     * });
     * ```
     *
     * @param expected Pattern that expected string should match.
     */
    export const stringMatching: typeof asymmetricMatchers.stringMatching;

    /**
     * Negated versions of asymmetric matchers e.g. `expect.not.arrayContaining(...)`.
     * @see {@link expect}
     */
    export const not: ExpectNotAsymmetricMatchers;
}

/* eslint-disable @typescript-eslint/no-unsafe-member-access */
(expect as any).__test_overrideMatchers = (newMatchers: Partial<MatchersFunctions>) => {
    Object.assign(matchersFunctions, newMatchers);
};
(expect as any).any = asymmetricMatchers.any;
(expect as any).anything = asymmetricMatchers.anything;
(expect as any).arrayContaining = asymmetricMatchers.arrayContaining;
(expect as any).closeTo = asymmetricMatchers.closeTo;
(expect as any).objectContaining = asymmetricMatchers.objectContaining;
(expect as any).stringContaining = asymmetricMatchers.stringContaining;
(expect as any).stringMatching = asymmetricMatchers.stringMatching;
(expect as any).not = {
    arrayContaining: asymmetricMatchers.arrayNotContaining,
    closeTo: asymmetricMatchers.notCloseTo,
    objectContaining: asymmetricMatchers.objectNotContaining,
    stringContaining: asymmetricMatchers.stringNotContaining,
    stringMatching: asymmetricMatchers.stringNotMatching,
} satisfies ExpectNotAsymmetricMatchers;
/* eslint-enable @typescript-eslint/no-unsafe-member-access */

/**
 * Checks if the provided matcher name is a valid matcher in the `expect` function.
 *
 * @param matcherName The name of the matcher to check.
 * @returns `true` if the matcher name is valid, `false` otherwise.
 */
function isMatcherName(matcherName: unknown): matcherName is MatcherName {
    if (typeof matcherName !== "string") {
        return false;
    }
    return matcherName in matchersFunctions;
}
