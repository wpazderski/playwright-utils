import { equals, iterableEquality } from "@jest/expect-utils";
import { type MatcherHintOptions, matcherHint, printDiffOrStringify, printExpected, printReceived, stringify } from "jest-matcher-utils";
import type { MatcherInternalOptions } from "../expect.ts";
import { EXPECTED_LABEL, RECEIVED_LABEL } from "./common.ts";
import { AssertionError } from "./errors/AssertionError.ts";

// For consistency, this matcher is largely based on Playwright's matcher: https://github.com/microsoft/playwright/blob/main/packages/playwright/bundles/expect/third_party/matchers.ts

/**
 * Compares contents of the value with contents of
 * [`expected`](https://playwright.dev/docs/api/class-genericassertions#generic-assertions-to-equal-option-expected),
 * performing "deep equality" check.
 *
 * For objects, this method recursively checks equality of all fields, rather than comparing objects by reference as
 * performed by
 * [expect(value).toBe(expected)](https://playwright.dev/docs/api/class-genericassertions#generic-assertions-to-be).
 *
 * For primitive values, this method is equivalent to
 * [expect(value).toBe(expected)](https://playwright.dev/docs/api/class-genericassertions#generic-assertions-to-be).
 *
 * **Usage**
 *
 * ```js
 * const value = { prop: 1 };
 * expect(value).toEqual({ prop: 1 });
 * ```
 *
 * **Non-strict equality**
 *
 * [expect(value).toEqual(expected)](https://playwright.dev/docs/api/class-genericassertions#generic-assertions-to-equal)
 * performs deep equality check that compares contents of the received and expected values. To ensure two objects
 * reference the same instance, use
 * [expect(value).toBe(expected)](https://playwright.dev/docs/api/class-genericassertions#generic-assertions-to-be)
 * instead.
 *
 * [expect(value).toEqual(expected)](https://playwright.dev/docs/api/class-genericassertions#generic-assertions-to-equal)
 * ignores `undefined` properties and array items, and does not insist on object types being equal. For stricter
 * matching, use
 * [expect(value).toStrictEqual(expected)](https://playwright.dev/docs/api/class-genericassertions#generic-assertions-to-strict-equal).
 *
 * **Pattern matching**
 *
 * [expect(value).toEqual(expected)](https://playwright.dev/docs/api/class-genericassertions#generic-assertions-to-equal)
 * can be also used to perform pattern matching on objects, arrays and primitive types, with the help of the following
 * matchers:
 * - [expect(value).any(constructor)](https://playwright.dev/docs/api/class-genericassertions#generic-assertions-any)
 * - [expect(value).anything()](https://playwright.dev/docs/api/class-genericassertions#generic-assertions-anything)
 * - [expect(value).arrayContaining(expected)](https://playwright.dev/docs/api/class-genericassertions#generic-assertions-array-containing)
 * - [expect(value).closeTo(expected[, numDigits])](https://playwright.dev/docs/api/class-genericassertions#generic-assertions-close-to)
 * - [expect(value).objectContaining(expected)](https://playwright.dev/docs/api/class-genericassertions#generic-assertions-object-containing)
 * - [expect(value).stringContaining(expected)](https://playwright.dev/docs/api/class-genericassertions#generic-assertions-string-containing)
 * - [expect(value).stringMatching(expected)](https://playwright.dev/docs/api/class-genericassertions#generic-assertions-string-matching)
 *
 * Here is an example that asserts some of the values inside a complex object:
 *
 * ```js
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
 * @param internalOptions Internal options that provide extra context for the matcher.
 * @param received Received value.
 * @param expected Expected value.
 */
export function toEqualMatcher(internalOptions: MatcherInternalOptions, received: unknown, expected: unknown): void {
    const matcherName = "toEqual";
    const options: MatcherHintOptions = {
        comment: "deep equality",
        isNot: internalOptions.isNot,
        promise: internalOptions.promiseExpectedState ?? "",
    };

    const didPass = equals(received, expected, [iterableEquality]);

    if (didPass === internalOptions.isNot) {
        const message = didPass
            ? `${matcherHint(matcherName, undefined, undefined, options)}\n\n` +
              `Expected: not ${printExpected(expected)}\n${stringify(expected) === stringify(received) ? "" : `Received:     ${printReceived(received)}`}`
            : `${matcherHint(matcherName, undefined, undefined, options)}\n\n${printDiffOrStringify(expected, received, EXPECTED_LABEL, RECEIVED_LABEL, false)}`;
        throw new AssertionError(message, matcherName, internalOptions);
    }
}
