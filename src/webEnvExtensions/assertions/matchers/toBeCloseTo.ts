import { EXPECTED_COLOR, type MatcherHintOptions, RECEIVED_COLOR, matcherErrorMessage, matcherHint, printExpected, printReceived, printWithType } from "jest-matcher-utils";
import type { MatcherInternalOptions } from "../expect.ts";
import { printCloseTo } from "./common.ts";
import { AssertionError } from "./errors/AssertionError.ts";

// For consistency, this matcher is largely based on Playwright's matcher: https://github.com/microsoft/playwright/blob/main/packages/playwright/bundles/expect/third_party/matchers.ts

/**
 * Compares floating point numbers for approximate equality. Use this method instead of
 * [expect(value).toBe(expected)](https://playwright.dev/docs/api/class-genericassertions#generic-assertions-to-be)
 * when comparing floating point numbers.
 *
 * **Usage**
 *
 * ```js
 * expect(0.1 + 0.2).not.toBe(0.3);
 * expect(0.1 + 0.2).toBeCloseTo(0.3, 5);
 * ```
 *
 * @param internalOptions Internal options that provide extra context for the matcher.
 * @param received Received value.
 * @param expected Expected value.
 * @param numDigits The number of decimal digits after the decimal point that must be equal.
 */
// eslint-disable-next-line @typescript-eslint/max-params
export function toBeCloseToMatcher(internalOptions: MatcherInternalOptions, received: number, expected: number, numDigits = 2): void {
    const matcherName = "toBeCloseTo";
    const secondArgument = arguments.length === 4 ? "precision" : undefined;
    const options: MatcherHintOptions = {
        isNot: internalOptions.isNot,
        promise: internalOptions.promiseExpectedState ?? "",
        ...(secondArgument ? { secondArgument } : {}),
        secondArgumentColor: (arg: string) => arg,
    };

    if (typeof expected !== "number") {
        throw new Error(
            matcherErrorMessage(
                matcherHint(matcherName, undefined, undefined, options),
                `${EXPECTED_COLOR("expected")} value must be a number`,
                printWithType("Expected", expected, printExpected),
            ),
        );
    }

    if (typeof received !== "number") {
        throw new Error(
            matcherErrorMessage(
                matcherHint(matcherName, undefined, undefined, options),
                `${RECEIVED_COLOR("received")} value must be a number`,
                printWithType("Received", received, printReceived),
            ),
        );
    }

    let didPass;
    let expectedDiff = 0;
    let receivedDiff = 0;

    if (received === Infinity && expected === Infinity) {
        didPass = true;
    } else if (received === -Infinity && expected === -Infinity) {
        didPass = true;
    } else {
        expectedDiff = 10 ** -numDigits / 2;
        receivedDiff = Math.abs(expected - received);
        didPass = receivedDiff < expectedDiff;
    }

    if (didPass === internalOptions.isNot) {
        const message = didPass
            ? `${matcherHint(matcherName, undefined, undefined, options)}\n\n` +
              `Expected: not ${printExpected(expected)}\n${
                  receivedDiff === 0 ? "" : `Received:     ${printReceived(received)}\n\n${printCloseTo(receivedDiff, expectedDiff, numDigits, internalOptions.isNot)}`
              }`
            : `${matcherHint(matcherName, undefined, undefined, options)}\n\n` +
              `Expected: ${printExpected(expected)}\n` +
              `Received: ${printReceived(received)}\n` +
              `\n${printCloseTo(receivedDiff, expectedDiff, numDigits, internalOptions.isNot)}`;
        throw new AssertionError(message, matcherName, internalOptions);
    }
}
