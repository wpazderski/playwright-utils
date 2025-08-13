import { equals, getObjectSubset, iterableEquality, subsetEquality } from "@jest/expect-utils";
import {
    EXPECTED_COLOR,
    type MatcherHintOptions,
    RECEIVED_COLOR,
    matcherErrorMessage,
    matcherHint,
    printDiffOrStringify,
    printExpected,
    printReceived,
    printWithType,
    stringify,
} from "jest-matcher-utils";
import type { MatcherInternalOptions } from "../expect.ts";
import { EXPECTED_LABEL, RECEIVED_LABEL } from "./common.ts";
import { AssertionError } from "./errors/AssertionError.ts";

// For consistency, this matcher is largely based on Playwright's matcher: https://github.com/microsoft/playwright/blob/main/packages/playwright/bundles/expect/third_party/matchers.ts

/**
 * Compares contents of the value with contents of
 * [`expected`](https://playwright.dev/docs/api/class-genericassertions#generic-assertions-to-match-object-option-expected),
 * performing "deep equality" check. Allows extra properties to be present in the value, unlike
 * [expect(value).toEqual(expected)](https://playwright.dev/docs/api/class-genericassertions#generic-assertions-to-equal),
 * so you can check just a subset of object properties.
 *
 * When comparing arrays, the number of items must match, and each item is checked recursively.
 *
 * **Usage**
 *
 * ```js
 * const value = {
 *   a: 1,
 *   b: 2,
 *   c: true,
 * };
 * expect(value).toMatchObject({ a: 1, c: true });
 * expect(value).toMatchObject({ b: 2, c: true });
 *
 * expect([{ a: 1, b: 2 }]).toMatchObject([{ a: 1 }]);
 * ```
 *
 * @param internalOptions Internal options that provide extra context for the matcher.
 * @param received Received value.
 * @param expected The expected object value to match against.
 */
export function toMatchObjectMatcher(internalOptions: MatcherInternalOptions, received: object, expected: object): void {
    const matcherName = "toMatchObject";
    const options: MatcherHintOptions = {
        isNot: internalOptions.isNot,
        promise: internalOptions.promiseExpectedState ?? "",
    };

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (typeof received !== "object" || received === null) {
        throw new Error(
            matcherErrorMessage(
                matcherHint(matcherName, undefined, undefined, options),
                `${RECEIVED_COLOR("received")} value must be a non-null object`,
                printWithType("Received", received, printReceived),
            ),
        );
    }

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (typeof expected !== "object" || expected === null) {
        throw new Error(
            matcherErrorMessage(
                matcherHint(matcherName, undefined, undefined, options),
                `${EXPECTED_COLOR("expected")} value must be a non-null object`,
                printWithType("Expected", expected, printExpected),
            ),
        );
    }

    const didPass = equals(received, expected, [iterableEquality, subsetEquality]);

    if (didPass === internalOptions.isNot) {
        const message = didPass
            ? `${matcherHint(matcherName, undefined, undefined, options)}\n\n` +
              `Expected: not ${printExpected(expected)}${stringify(expected) === stringify(received) ? "" : `\nReceived:     ${printReceived(received)}`}`
            : `${matcherHint(matcherName, undefined, undefined, options)}\n\n${printDiffOrStringify(
                  expected,
                  getObjectSubset(received, expected, []),
                  EXPECTED_LABEL,
                  RECEIVED_LABEL,
                  false,
              )}`;

        throw new AssertionError(message, matcherName, internalOptions);
    }
}
