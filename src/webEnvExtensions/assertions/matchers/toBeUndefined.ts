import { type MatcherHintOptions, matcherHint, printReceived } from "jest-matcher-utils";
import type { MatcherInternalOptions } from "../expect.ts";
import { AssertionError } from "./errors/AssertionError.ts";

// For consistency, this matcher is largely based on Playwright's matcher: https://github.com/microsoft/playwright/blob/main/packages/playwright/bundles/expect/third_party/matchers.ts

/**
 * Ensures that value is `undefined`.
 *
 * **Usage**
 *
 * ```js
 * const value = undefined;
 * expect(value).toBeUndefined();
 * ```
 *
 * @param internalOptions Internal options that provide extra context for the matcher.
 * @param received Received value.
 */
// eslint-disable-next-line @typescript-eslint/no-invalid-void-type
export function toBeUndefinedMatcher(internalOptions: MatcherInternalOptions, received: unknown, _expected: void): void {
    const matcherName = "toBeUndefined";
    const options: MatcherHintOptions = {
        isNot: internalOptions.isNot,
        promise: internalOptions.promiseExpectedState ?? "",
    };

    // eslint-disable-next-line no-void
    const didPass = received === void 0;

    if (didPass === internalOptions.isNot) {
        const message = `${matcherHint(matcherName, undefined, "", options)}\n\nReceived: ${printReceived(received)}`;

        throw new AssertionError(message, matcherName, internalOptions);
    }
}
