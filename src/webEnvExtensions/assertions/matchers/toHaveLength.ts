import { getType } from "jest-get-type";
import {
    type MatcherHintOptions,
    RECEIVED_COLOR,
    ensureExpectedIsNonNegativeInteger,
    getLabelPrinter,
    matcherErrorMessage,
    matcherHint,
    printExpected,
    printReceived,
    printWithType,
} from "jest-matcher-utils";
import type { MatcherInternalOptions } from "../expect.ts";
import { AssertionError } from "./errors/AssertionError.ts";

// For consistency, this matcher is largely based on Playwright's matcher: https://github.com/microsoft/playwright/blob/main/packages/playwright/bundles/expect/third_party/matchers.ts

/**
 * Ensures that value has a `.length` property equal to
 * [`expected`](https://playwright.dev/docs/api/class-genericassertions#generic-assertions-to-have-length-option-expected).
 * Useful for arrays and strings.
 *
 * **Usage**
 *
 * ```js
 * expect('Hello, World').toHaveLength(12);
 * expect([1, 2, 3]).toHaveLength(3);
 * ```
 *
 * @param internalOptions Internal options that provide extra context for the matcher.
 * @param received Received value.
 * @param expected Expected length.
 */
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
export function toHaveLengthMatcher(internalOptions: MatcherInternalOptions, received: any, expected: number): void {
    const matcherName = "toHaveLength";
    const options: MatcherHintOptions = {
        isNot: internalOptions.isNot,
        promise: internalOptions.promiseExpectedState ?? "",
    };

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (typeof received?.length !== "number") {
        throw new Error(
            matcherErrorMessage(
                matcherHint(matcherName, undefined, undefined, options),
                `${RECEIVED_COLOR("received")} value must have a length property whose value must be a number`,
                printWithType("Received", received, printReceived),
            ),
        );
    }

    ensureExpectedIsNonNegativeInteger(expected, matcherName, options);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const didPass = received.length === expected;

    if (didPass === internalOptions.isNot) {
        const labelExpected = "Expected length";
        const labelReceivedLength = "Received length";
        const labelReceivedValue = `Received ${getType(received)}`;
        const printLabel = getLabelPrinter(labelExpected, labelReceivedLength, labelReceivedValue);

        const message =
            `${matcherHint(matcherName, undefined, undefined, options)}\n\n` +
            `${printLabel(labelExpected)}${internalOptions.isNot ? "not " : ""}${printExpected(expected)}\n${
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                internalOptions.isNot ? "" : `${printLabel(labelReceivedLength)}${printReceived(received.length)}\n`
            }${printLabel(labelReceivedValue)}${internalOptions.isNot ? "    " : ""}${printReceived(received)}`;
        throw new AssertionError(message, matcherName, internalOptions);
    }
}
