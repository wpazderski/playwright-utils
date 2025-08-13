import {
    EXPECTED_COLOR,
    type MatcherHintOptions,
    RECEIVED_COLOR,
    getLabelPrinter,
    matcherErrorMessage,
    matcherHint,
    printExpected,
    printReceived,
    printWithType,
} from "jest-matcher-utils";
import type { MatcherInternalOptions } from "../expect.ts";
import { printReceivedStringContainExpectedResult, printReceivedStringContainExpectedSubstring } from "./common.ts";
import { AssertionError } from "./errors/AssertionError.ts";

// For consistency, this matcher is largely based on Playwright's matcher: https://github.com/microsoft/playwright/blob/main/packages/playwright/bundles/expect/third_party/matchers.ts

/**
 * Ensures that string value matches a regular expression.
 *
 * **Usage**
 *
 * ```js
 * const value = 'Is 42 enough?';
 * expect(value).toMatch(/Is \d+ enough/);
 * ```
 *
 * @param internalOptions Internal options that provide extra context for the matcher.
 * @param received Received value.
 * @param expected Regular expression to match against.
 */
export function toMatchMatcher(internalOptions: MatcherInternalOptions, received: string, expected: string | RegExp): void {
    const matcherName = "toMatch";
    const options: MatcherHintOptions = {
        isNot: internalOptions.isNot,
        promise: internalOptions.promiseExpectedState ?? "",
    };

    if (typeof received !== "string") {
        throw new Error(
            matcherErrorMessage(
                matcherHint(matcherName, undefined, undefined, options),
                `${RECEIVED_COLOR("received")} value must be a string`,
                printWithType("Received", received, printReceived),
            ),
        );
    }

    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions, @typescript-eslint/no-unnecessary-condition
    if (!(typeof expected === "string") && !(expected && typeof expected.test === "function")) {
        throw new Error(
            matcherErrorMessage(
                matcherHint(matcherName, undefined, undefined, options),
                `${EXPECTED_COLOR("expected")} value must be a string or regular expression`,
                printWithType("Expected", expected, printExpected),
            ),
        );
    }

    // eslint-disable-next-line require-unicode-regexp
    const didPass = typeof expected === "string" ? received.includes(expected) : new RegExp(expected).test(received);

    if (didPass === internalOptions.isNot) {
        const labelExpected = `Expected ${typeof expected === "string" ? "substring" : "pattern"}`;
        const labelReceived = "Received string";
        const printLabel = getLabelPrinter(labelExpected, labelReceived);

        const message = didPass
            ? typeof expected === "string"
                ? `${matcherHint(matcherName, undefined, undefined, options)}\n\n` +
                  `Expected substring: not ${printExpected(expected)}\n` +
                  `Received string:        ${printReceivedStringContainExpectedSubstring(received, received.indexOf(expected), expected.length)}`
                : `${matcherHint(matcherName, undefined, undefined, options)}\n\n` +
                  `Expected pattern: not ${printExpected(expected)}\n` +
                  `Received string:      ${printReceivedStringContainExpectedResult(received, typeof expected.exec === "function" ? expected.exec(received) : null)}`
            : `${matcherHint(matcherName, undefined, undefined, options)}\n\n` +
              `${printLabel(labelExpected)}${printExpected(expected)}\n` +
              `${printLabel(labelReceived)}${printReceived(received)}`;

        throw new AssertionError(message, matcherName, internalOptions);
    }
}
