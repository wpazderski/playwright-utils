import { type MatcherHintOptions, matcherHint, printReceived } from "jest-matcher-utils";
import type { MatcherInternalOptions } from "../expect.ts";
import { AssertionError } from "./errors/AssertionError.ts";

// For consistency, this matcher is largely based on Playwright's matcher: https://github.com/microsoft/playwright/blob/main/packages/playwright/bundles/expect/third_party/matchers.ts

/**
 * Ensures that value is `NaN`.
 *
 * **Usage**
 *
 * ```js
 * const value = NaN;
 * expect(value).toBeNaN();
 * ```
 *
 * @param internalOptions Internal options that provide extra context for the matcher.
 * @param received Received value.
 */
// eslint-disable-next-line @typescript-eslint/no-invalid-void-type, @typescript-eslint/naming-convention
export function toBeNaNMatcher(internalOptions: MatcherInternalOptions, received: unknown, _expected: void): void {
    const matcherName = "toBeNaN";
    const options: MatcherHintOptions = {
        isNot: internalOptions.isNot,
        promise: internalOptions.promiseExpectedState ?? "",
    };

    const didPass = Number.isNaN(received);

    if (didPass === internalOptions.isNot) {
        const message = `${matcherHint(matcherName, undefined, "", options)}\n\nReceived: ${printReceived(received)}`;

        throw new AssertionError(message, matcherName, internalOptions);
    }
}
