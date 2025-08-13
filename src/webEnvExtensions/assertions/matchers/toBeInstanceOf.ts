import { isPrimitive } from "jest-get-type";
import { EXPECTED_COLOR, type MatcherHintOptions, matcherErrorMessage, matcherHint, printExpected, printReceived, printWithType } from "jest-matcher-utils";
import type { MatcherInternalOptions } from "../expect.ts";
import { printExpectedConstructorName, printExpectedConstructorNameNot, printReceivedConstructorName, printReceivedConstructorNameNot } from "./common.ts";
import { AssertionError } from "./errors/AssertionError.ts";

// For consistency, this matcher is largely based on Playwright's matcher: https://github.com/microsoft/playwright/blob/main/packages/playwright/bundles/expect/third_party/matchers.ts

/**
 * Ensures that value is an instance of a class. Uses `instanceof` operator.
 *
 * **Usage**
 *
 * ```js
 * expect(page).toBeInstanceOf(Page);
 *
 * class Example {}
 * expect(new Example()).toBeInstanceOf(Example);
 * ```
 *
 * @param internalOptions Internal options that provide extra context for the matcher.
 * @param received Received value.
 * @param expected The class or constructor function.
 */
// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type, @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
export function toBeInstanceOfMatcher(internalOptions: MatcherInternalOptions, received: any, expected: Function): void {
    const matcherName = "toBeInstanceOf";
    const options: MatcherHintOptions = {
        isNot: internalOptions.isNot,
        promise: internalOptions.promiseExpectedState ?? "",
    };

    if (typeof expected !== "function") {
        throw new Error(
            matcherErrorMessage(
                matcherHint(matcherName, undefined, undefined, options),
                `${EXPECTED_COLOR("expected")} value must be a function`,
                printWithType("Expected", expected, printExpected),
            ),
        );
    }

    const didPass = received instanceof expected;

    if (didPass === internalOptions.isNot) {
        const message = didPass
            ? `${matcherHint(matcherName, undefined, undefined, options)}\n\n${printExpectedConstructorNameNot("Expected constructor", expected)}${
                  typeof received.constructor === "function" && received.constructor !== expected
                      ? printReceivedConstructorNameNot("Received constructor", received.constructor, expected)
                      : ""
              }`
            : `${matcherHint(matcherName, undefined, undefined, options)}\n\n${printExpectedConstructorName("Expected constructor", expected)}${
                  isPrimitive(received) || Object.getPrototypeOf(received) === null
                      ? `\nReceived value has no prototype\nReceived value: ${printReceived(received)}`
                      : // eslint-disable-next-line no-negated-condition, @typescript-eslint/no-unsafe-member-access
                        typeof received.constructor !== "function"
                        ? `\nReceived value: ${printReceived(received)}`
                        : printReceivedConstructorName(
                              "Received constructor",
                              // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
                              received.constructor,
                          )
              }`;

        throw new AssertionError(message, matcherName, internalOptions);
    }
}
