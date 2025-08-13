import { type MatcherHintOptions, matcherHint, printReceived } from "jest-matcher-utils";
import type { MatcherInternalOptions } from "../expect.ts";
import { AssertionError } from "./errors/AssertionError.ts";

// For consistency, this matcher is largely based on Playwright's matcher: https://github.com/microsoft/playwright/blob/main/packages/playwright/bundles/expect/third_party/matchers.ts

/**
 * Ensures that value is `null`.
 *
 * **Usage**
 *
 * ```js
 * const value = null;
 * expect(value).toBeNull();
 * ```
 *
 * @param internalOptions Internal options that provide extra context for the matcher.
 * @param received Received value.
 */
// eslint-disable-next-line @typescript-eslint/no-invalid-void-type
export function toBeNullMatcher(internalOptions: MatcherInternalOptions, received: unknown, _expected: void): void {
    const matcherName = "toBeNull";
    const options: MatcherHintOptions = {
        isNot: internalOptions.isNot,
        promise: internalOptions.promiseExpectedState ?? "",
    };

    const didPass = received === null;

    if (didPass === internalOptions.isNot) {
        const message = `${matcherHint(matcherName, undefined, "", options)}\n\nReceived: ${printReceived(received)}`;

        throw new AssertionError(message, matcherName, internalOptions);
    }
}
