import { equals, iterableEquality } from "@jest/expect-utils";
import { getType } from "jest-get-type";
import {
    EXPECTED_COLOR,
    type MatcherHintOptions,
    RECEIVED_COLOR,
    SUGGEST_TO_CONTAIN_EQUAL,
    getLabelPrinter,
    matcherErrorMessage,
    matcherHint,
    printExpected,
    printReceived,
    printWithType,
} from "jest-matcher-utils";
import type { MatcherInternalOptions } from "../expect.ts";
import { printReceivedArrayContainExpectedItem, printReceivedStringContainExpectedSubstring } from "./common.ts";
import { AssertionError } from "./errors/AssertionError.ts";
import type { ContainIterable } from "./types.ts";

// For consistency, this matcher is largely based on Playwright's matcher: https://github.com/microsoft/playwright/blob/main/packages/playwright/bundles/expect/third_party/matchers.ts

/**
 * Ensures that value is an `Array` or `Set` and contains an expected item.
 *
 * **Usage**
 *
 * ```js
 * const value = [1, 2, 3];
 * expect(value).toContain(2);
 * expect(new Set(value)).toContain(2);
 * ```
 *
 * @param internalOptions Internal options that provide extra context for the matcher.
 * @param received Received value.
 * @param expected Expected value in the collection.
 */
export function toContainMatcher(internalOptions: MatcherInternalOptions, received: ContainIterable, expected: unknown): void;

/**
 * Ensures that string value contains an expected substring. Comparison is case-sensitive.
 *
 * **Usage**
 *
 * ```js
 * const value = 'Hello, World';
 * expect(value).toContain('World');
 * expect(value).toContain(',');
 * ```
 *
 * @param internalOptions Internal options that provide extra context for the matcher.
 * @param received Received value.
 * @param expected Expected substring.
 */
export function toContainMatcher(internalOptions: MatcherInternalOptions, received: string, expected: string): void;

export function toContainMatcher(internalOptions: MatcherInternalOptions, received: ContainIterable | string, expected: unknown): void {
    const matcherName = "toContain";
    const options: MatcherHintOptions = {
        comment: "indexOf",
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

    if (typeof received === "string") {
        const wrongTypeErrorMessage = `${EXPECTED_COLOR("expected")} value must be a string if ${RECEIVED_COLOR("received")} value is a string`;

        if (typeof expected !== "string") {
            throw new Error(
                matcherErrorMessage(
                    matcherHint(matcherName, received, String(expected), options),
                    wrongTypeErrorMessage,
                    `${printWithType("Expected", expected, printExpected)}\n${printWithType("Received", received, printReceived)}`,
                ),
            );
        }

        const index = received.indexOf(expected);
        const didPass = index !== -1;

        if (didPass === internalOptions.isNot) {
            const labelExpected = `Expected ${typeof expected === "string" ? "substring" : "value"}`;
            const labelReceived = "Received string";
            const printLabel = getLabelPrinter(labelExpected, labelReceived);

            const message =
                `${matcherHint(matcherName, undefined, undefined, options)}\n\n` +
                `${printLabel(labelExpected)}${internalOptions.isNot ? "not " : ""}${printExpected(expected)}\n` +
                `${printLabel(labelReceived)}${internalOptions.isNot ? "    " : ""}${
                    internalOptions.isNot ? printReceivedStringContainExpectedSubstring(received, index, expected.length) : printReceived(received)
                }`;

            throw new AssertionError(message, matcherName, internalOptions);
        }

        return;
    }

    const indexable = Array.from(received);
    const index = indexable.indexOf(expected);
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
            }${!internalOptions.isNot && indexable.findIndex((item) => equals(item, expected, [iterableEquality])) !== -1 ? `\n\n${SUGGEST_TO_CONTAIN_EQUAL}` : ""}`;

        throw new AssertionError(message, matcherName, internalOptions);
    }
}
