import { equals } from "@jest/expect-utils";
import { type MatcherHintOptions, matcherHint, printDiffOrStringify, printExpected, printReceived, stringify } from "jest-matcher-utils";
import type { MatcherInternalOptions } from "../expect.ts";
import { EXPECTED_LABEL, RECEIVED_LABEL, toStrictEqualTesters } from "./common.ts";
import { AssertionError } from "./errors/AssertionError.ts";

// For consistency, this matcher is largely based on Playwright's matcher: https://github.com/microsoft/playwright/blob/main/packages/playwright/bundles/expect/third_party/matchers.ts

/**
 * Compares contents of the value with contents of
 * [`expected`](https://playwright.dev/docs/api/class-genericassertions#generic-assertions-to-strict-equal-option-expected)
 * **and** their types.
 *
 * Differences from
 * [expect(value).toEqual(expected)](https://playwright.dev/docs/api/class-genericassertions#generic-assertions-to-equal):
 * - Keys with undefined properties are checked. For example, `{ a: undefined, b: 2 }` does not match `{ b: 2 }`.
 * - Array sparseness is checked. For example, `[, 1]` does not match `[undefined, 1]`.
 * - Object types are checked to be equal. For example, a class instance with fields `a` and `b` will not equal a
 *   literal object with fields `a` and `b`.
 *
 * **Usage**
 *
 * ```js
 * const value = { prop: 1 };
 * expect(value).toStrictEqual({ prop: 1 });
 * ```
 *
 * @param internalOptions Internal options that provide extra context for the matcher.
 * @param received Received value.
 * @param expected Expected value.
 */
export function toStrictEqualMatcher(internalOptions: MatcherInternalOptions, received: unknown, expected: unknown): void {
    const matcherName = "toStrictEqual";
    const options: MatcherHintOptions = {
        comment: "deep equality",
        isNot: internalOptions.isNot,
        promise: internalOptions.promiseExpectedState ?? "",
    };

    const didPass = equals(received, expected, toStrictEqualTesters, true);

    if (didPass === internalOptions.isNot) {
        const message = didPass
            ? `${matcherHint(matcherName, undefined, undefined, options)}\n\n` +
              `Expected: not ${printExpected(expected)}\n${stringify(expected) === stringify(received) ? "" : `Received:     ${printReceived(received)}`}`
            : `${matcherHint(matcherName, undefined, undefined, options)}\n\n${printDiffOrStringify(expected, received, EXPECTED_LABEL, RECEIVED_LABEL, false)}`;
        throw new AssertionError(message, matcherName, internalOptions);
    }
}
