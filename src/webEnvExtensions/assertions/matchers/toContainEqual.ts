import { equals, iterableEquality } from "@jest/expect-utils";
import { getType } from "jest-get-type";
import { type MatcherHintOptions, RECEIVED_COLOR, getLabelPrinter, matcherErrorMessage, matcherHint, printExpected, printReceived, printWithType } from "jest-matcher-utils";
import type { MatcherInternalOptions } from "../expect.ts";
import { printReceivedArrayContainExpectedItem } from "./common.ts";
import { AssertionError } from "./errors/AssertionError.ts";
import type { ContainIterable } from "./types.ts";

// For consistency, this matcher is largely based on Playwright's matcher: https://github.com/microsoft/playwright/blob/main/packages/playwright/bundles/expect/third_party/matchers.ts

/**
 * Ensures that value is an `Array` or `Set` and contains an item equal to the expected.
 *
 * For objects, this method recursively checks equality of all fields, rather than comparing objects by reference as
 * performed by
 * [expect(value).toContain(expected)](https://playwright.dev/docs/api/class-genericassertions#generic-assertions-to-contain-2).
 *
 * For primitive values, this method is equivalent to
 * [expect(value).toContain(expected)](https://playwright.dev/docs/api/class-genericassertions#generic-assertions-to-contain-2).
 *
 * **Usage**
 *
 * ```js
 * const value = [
 *   { example: 1 },
 *   { another: 2 },
 *   { more: 3 },
 * ];
 * expect(value).toContainEqual({ another: 2 });
 * expect(new Set(value)).toContainEqual({ another: 2 });
 * ```
 *
 * @param internalOptions Internal options that provide extra context for the matcher.
 * @param received Received value.
 * @param expected Expected value in the collection.
 */
export function toContainEqualMatcher(internalOptions: MatcherInternalOptions, received: ContainIterable, expected: unknown): void {
    const matcherName = "toContainEqual";
    const options: MatcherHintOptions = {
        comment: "deep equality",
        isNot: internalOptions.isNot,
        promise: internalOptions.promiseExpectedState ?? "",
    };

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition, eqeqeq
    if (received == null) {
        throw new Error(
            matcherErrorMessage(
                matcherHint(matcherName, undefined, undefined, options),
                `${RECEIVED_COLOR("received")} value must not be null nor undefined`,
                printWithType("Received", received, printReceived),
            ),
        );
    }

    const index = Array.from(received).findIndex((item) => equals(item, expected, [iterableEquality]));
    const didPass = index !== -1;

    if (didPass === internalOptions.isNot) {
        const labelExpected = "Expected value";
        const labelReceived = `Received ${getType(received)}`;
        const printLabel = getLabelPrinter(labelExpected, labelReceived);

        const message =
            `${matcherHint(matcherName, undefined, undefined, options)}\n\n` +
            `${printLabel(labelExpected)}${internalOptions.isNot ? "not " : ""}${printExpected(expected)}\n` +
            `${printLabel(labelReceived)}${internalOptions.isNot ? "    " : ""}${
                internalOptions.isNot && Array.isArray(received) ? printReceivedArrayContainExpectedItem(received, index) : printReceived(received)
            }`;

        throw new AssertionError(message, matcherName, internalOptions);
    }
}
