import { equals, iterableEquality } from "@jest/expect-utils";
import { getType } from "jest-get-type";
import { DIM_COLOR, type MatcherHintOptions, matcherHint, printDiffOrStringify, printExpected } from "jest-matcher-utils";
import type { MatcherInternalOptions } from "../expect.ts";
import { EXPECTED_LABEL, RECEIVED_LABEL, toStrictEqualTesters } from "./common.ts";
import { AssertionError } from "./errors/AssertionError.ts";

// For consistency, this matcher is largely based on Playwright's matcher: https://github.com/microsoft/playwright/blob/main/packages/playwright/bundles/expect/third_party/matchers.ts

/**
 * Compares value with
 * [`expected`](https://playwright.dev/docs/api/class-genericassertions#generic-assertions-to-be-option-expected) by
 * calling `Object.is`. This method compares objects by reference instead of their contents, similarly to the strict
 * equality operator `===`.
 *
 * **Usage**
 *
 * ```js
 * const value = { prop: 1 };
 * expect(value).toBe(value);
 * expect(value).not.toBe({});
 * expect(value.prop).toBe(1);
 * ```
 *
 * @param internalOptions Internal options that provide extra context for the matcher.
 * @param received Received value.
 * @param expected Expected value.
 */
export function toBeMatcher(internalOptions: MatcherInternalOptions, received: unknown, expected: unknown): void {
    const matcherName = "toBe";
    const options: MatcherHintOptions = {
        comment: "Object.is equality",
        isNot: internalOptions.isNot,
        promise: internalOptions.promiseExpectedState ?? "",
    };

    const didPass = Object.is(received, expected);

    if (didPass === internalOptions.isNot) {
        const expectedType = getType(expected);

        let deepEqualityName = null;
        if (expectedType !== "map" && expectedType !== "set") {
            if (equals(received, expected, [...toStrictEqualTesters], true)) {
                deepEqualityName = "toStrictEqual";
            } else if (equals(received, expected, [iterableEquality])) {
                deepEqualityName = "toEqual";
            }
        }
        const message = didPass
            ? `${matcherHint(matcherName, undefined, undefined, options)}\n\nExpected: not ${printExpected(expected)}`
            : `${matcherHint(matcherName, undefined, undefined, options)}\n\n${
                  deepEqualityName === null ? "" : `${DIM_COLOR(`If it should pass with deep equality, replace "${matcherName}" with "${deepEqualityName}"`)}\n\n`
              }${printDiffOrStringify(expected, received, EXPECTED_LABEL, RECEIVED_LABEL, false)}`;

        throw new AssertionError(message, matcherName, internalOptions);
    }
}
