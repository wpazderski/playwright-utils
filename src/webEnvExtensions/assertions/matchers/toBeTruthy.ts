import { type MatcherHintOptions, matcherHint, printReceived } from "jest-matcher-utils";
import type { MatcherInternalOptions } from "../expect.ts";
import { AssertionError } from "./errors/AssertionError.ts";

// For consistency, this matcher is largely based on Playwright's matcher: https://github.com/microsoft/playwright/blob/main/packages/playwright/bundles/expect/third_party/matchers.ts

/**
 * Ensures that value is true in a boolean context, **anything but** `false`, `0`, `''`, `null`, `undefined` or `NaN`.
 * Use this method when you don't care about the specific value.
 *
 * **Usage**
 *
 * ```js
 * const value = { example: 'value' };
 * expect(value).toBeTruthy();
 * ```
 *
 * @param internalOptions Internal options that provide extra context for the matcher.
 * @param received Received value.
 */
// eslint-disable-next-line @typescript-eslint/no-invalid-void-type
export function toBeTruthyMatcher(internalOptions: MatcherInternalOptions, received: unknown, _expected: void): void {
    const matcherName = "toBeTruthy";
    const options: MatcherHintOptions = {
        isNot: internalOptions.isNot,
        promise: internalOptions.promiseExpectedState ?? "",
    };

    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions, no-implicit-coercion
    const didPass = !!received;

    if (didPass === internalOptions.isNot) {
        const message = `${matcherHint(matcherName, undefined, "", options)}\n\nReceived: ${printReceived(received)}`;

        throw new AssertionError(message, matcherName, internalOptions);
    }
}
