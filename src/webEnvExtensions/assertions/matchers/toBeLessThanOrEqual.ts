import { type MatcherHintOptions, ensureNumbers, matcherHint, printExpected, printReceived } from "jest-matcher-utils";
import type { MatcherInternalOptions } from "../expect.ts";
import { AssertionError } from "./errors/AssertionError.ts";

// For consistency, this matcher is largely based on Playwright's matcher: https://github.com/microsoft/playwright/blob/main/packages/playwright/bundles/expect/third_party/matchers.ts

/**
 * Ensures that `value <= expected` for number or big integer values.
 *
 * **Usage**
 *
 * ```js
 * const value = 42;
 * expect(value).toBeLessThanOrEqual(42);
 * ```
 *
 * @param internalOptions Internal options that provide extra context for the matcher.
 * @param received Received value.
 * @param expected The value to compare to.
 */
export function toBeLessThanOrEqualMatcher(internalOptions: MatcherInternalOptions, received: number | bigint, expected: number | bigint): void {
    const matcherName = "toBeLessThanOrEqual";
    const options: MatcherHintOptions = {
        isNot: internalOptions.isNot,
        promise: internalOptions.promiseExpectedState ?? "",
    };

    ensureNumbers(received, expected, matcherName, options);

    const didPass = received <= expected;

    if (didPass === internalOptions.isNot) {
        const message =
            `${matcherHint(matcherName, undefined, undefined, options)}\n\n` +
            `Expected:${internalOptions.isNot ? " not" : ""} <= ${printExpected(expected)}\n` +
            `Received:${internalOptions.isNot ? "    " : ""}    ${printReceived(received)}`;
        throw new AssertionError(message, matcherName, internalOptions);
    }
}
