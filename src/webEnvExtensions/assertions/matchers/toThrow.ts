/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/max-params */
/* eslint-disable @typescript-eslint/no-unsafe-function-type */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/prefer-optional-chain */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { isError } from "@jest/expect-utils";
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
} from "jest-matcher-utils";
import type { MatcherInternalOptions } from "../expect.ts";
import {
    printExpectedConstructorName,
    printExpectedConstructorNameNot,
    printReceivedConstructorName,
    printReceivedConstructorNameNot,
    printReceivedStringContainExpectedResult,
    printReceivedStringContainExpectedSubstring,
} from "./common.ts";
import { AssertionError } from "./errors/AssertionError.ts";
import type { MatcherName } from "./types.ts";

// For consistency, this matcher is largely based on Playwright's matcher: https://github.com/microsoft/playwright/blob/main/packages/playwright/bundles/expect/third_party/toThrowMatchers.ts

// eslint-disable-next-line @typescript-eslint/naming-convention
const DID_NOT_THROW = "Received function did not throw";

type Thrown =
    | {
          hasMessage: true;
          isError: true;
          message: string;
          value: Error;
      }
    | {
          hasMessage: boolean;
          isError: false;
          message: string;
          value: any;
      };

interface AsymmetricMatcher {
    asymmetricMatch: (received: unknown) => boolean;
}

const getThrown = (e: any): Thrown => {
    const hasMessage = e !== null && e !== undefined && typeof e.message === "string";

    if (hasMessage && typeof e.name === "string" && typeof e.stack === "string") {
        return {
            hasMessage,
            isError: true,
            message: e.message,
            value: e,
        };
    }

    return {
        hasMessage,
        isError: false,
        message: hasMessage ? e.message : String(e),
        value: e,
    };
};

/**
 * Creates a matcher function for `toThrow` or `toThrowError`.
 *
 * @param matcherName The name of the matcher, either "toThrow" or "toThrowError".
 * @param fromPromise If true, the matcher will handle promises and check for errors thrown from promises.
 * @returns A matcher function.
 */
export function createMatcher(
    matcherName: "toThrow" | "toThrowError",
    fromPromise?: boolean,
): (internalOptions: MatcherInternalOptions, received: unknown, expected?: unknown) => void {
    return function (internalOptions: MatcherInternalOptions, received: unknown, expected?: unknown): void {
        const options: MatcherHintOptions = {
            isNot: internalOptions.isNot,
            promise: internalOptions.promiseExpectedState ?? "",
        };

        let thrown = null;

        if (fromPromise === true && isError(received)) {
            thrown = getThrown(received);
        } else {
            if (typeof received === "function") {
                try {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
                    received();
                } catch (e) {
                    thrown = getThrown(e);
                }
            } else {
                if (fromPromise !== true) {
                    const placeholder = expected === undefined ? "" : "expected";
                    throw new Error(
                        matcherErrorMessage(
                            matcherHint(matcherName, undefined, placeholder, options),
                            `${RECEIVED_COLOR("received")} value must be a function`,
                            printWithType("Received", received, printReceived),
                        ),
                    );
                }
            }
        }

        if (expected === undefined) {
            checkExpectToThrow(matcherName, internalOptions, options, thrown);
        } else if (typeof expected === "function") {
            checkExpectToThrowExpectedClass(matcherName, internalOptions, options, thrown, expected);
        } else if (typeof expected === "string") {
            checkExpectToThrowExpectedString(matcherName, internalOptions, options, thrown, expected);
        } else if (expected !== null && typeof (expected as any).test === "function") {
            checkExpectToThrowExpectedRegExp(matcherName, internalOptions, options, thrown, expected as any);
        } else if (expected !== null && typeof (expected as any).asymmetricMatch === "function") {
            checkExpectToThrowExpectedAsymmetric(matcherName, internalOptions, options, thrown, expected as any);
        } else if (expected !== null && typeof expected === "object") {
            checkExpectToThrowExpectedObject(matcherName, internalOptions, options, thrown, expected as any);
        } else {
            throw new Error(
                matcherErrorMessage(
                    matcherHint(matcherName, undefined, undefined, options),
                    `${EXPECTED_COLOR("expected")} value must be a string or regular expression or class or error`,
                    printWithType("Expected", expected, printExpected),
                ),
            );
        }
    };
}

const checkExpectToThrowExpectedRegExp = (
    matcherName: MatcherName,
    internalOptions: MatcherInternalOptions,
    options: MatcherHintOptions,
    thrown: Thrown | null,
    expected: RegExp,
): void => {
    const didPass = thrown !== null && expected.test(thrown.message);

    if (didPass !== internalOptions.isNot) {
        return;
    }

    const message = didPass
        ? `${matcherHint(matcherName, undefined, undefined, options)}\n\n${formatExpected("Expected pattern: not ", expected)}${
              // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
              thrown !== null && thrown.hasMessage
                  ? formatReceived("Received message:     ", thrown, "message", expected) + formatStack(thrown)
                  : formatReceived("Received value:       ", thrown, "value")
          }`
        : `${matcherHint(matcherName, undefined, undefined, options)}\n\n${formatExpected("Expected pattern: ", expected)}${
              thrown === null
                  ? `\n${DID_NOT_THROW}`
                  : thrown.hasMessage
                    ? formatReceived("Received message: ", thrown, "message") + formatStack(thrown)
                    : formatReceived("Received value:   ", thrown, "value")
          }`;

    throw new AssertionError(message, matcherName, internalOptions);
};

const checkExpectToThrowExpectedAsymmetric = (
    matcherName: MatcherName,
    internalOptions: MatcherInternalOptions,
    options: MatcherHintOptions,
    thrown: Thrown | null,
    expected: AsymmetricMatcher,
): void => {
    const didPass = thrown !== null && expected.asymmetricMatch(thrown.value);

    if (didPass !== internalOptions.isNot) {
        return;
    }

    const message = didPass
        ? `${matcherHint(matcherName, undefined, undefined, options)}\n\n${formatExpected("Expected asymmetric matcher: not ", expected)}\n${
              // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
              thrown !== null && thrown.hasMessage
                  ? formatReceived("Received name:    ", thrown, "name") + formatReceived("Received message: ", thrown, "message") + formatStack(thrown)
                  : formatReceived("Thrown value: ", thrown, "value")
          }`
        : `${matcherHint(matcherName, undefined, undefined, options)}\n\n${formatExpected("Expected asymmetric matcher: ", expected)}\n${
              thrown === null
                  ? DID_NOT_THROW
                  : thrown.hasMessage
                    ? formatReceived("Received name:    ", thrown, "name") + formatReceived("Received message: ", thrown, "message") + formatStack(thrown)
                    : formatReceived("Thrown value: ", thrown, "value")
          }`;

    throw new AssertionError(message, matcherName, internalOptions);
};

const checkExpectToThrowExpectedObject = (
    matcherName: MatcherName,
    internalOptions: MatcherInternalOptions,
    options: MatcherHintOptions,
    thrown: Thrown | null,
    expected: Error,
): void => {
    const expectedMessageAndCause = createMessageAndCause(expected);
    // eslint-disable-next-line no-negated-condition
    const thrownMessageAndCause = thrown !== null ? createMessageAndCause(thrown.value) : null;
    const didPass = thrown !== null && thrown.message === expected.message && thrownMessageAndCause === expectedMessageAndCause;

    if (didPass !== internalOptions.isNot) {
        return;
    }

    const message = didPass
        ? `${matcherHint(matcherName, undefined, undefined, options)}\n\n${formatExpected(`Expected ${messageAndCause(expected)}: not `, expectedMessageAndCause)}${
              // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
              thrown !== null && thrown.hasMessage ? formatStack(thrown) : formatReceived("Received value:       ", thrown, "value")
          }`
        : `${matcherHint(matcherName, undefined, undefined, options)}\n\n${
              thrown === null
                  ? `${formatExpected(`Expected ${messageAndCause(expected)}: `, expectedMessageAndCause)}\n${DID_NOT_THROW}`
                  : thrown.hasMessage
                    ? `${printDiffOrStringify(
                          expectedMessageAndCause,
                          thrownMessageAndCause,
                          `Expected ${messageAndCause(expected)}`,
                          `Received ${messageAndCause(thrown.value)}`,
                          true,
                      )}\n${formatStack(thrown)}`
                    : formatExpected(`Expected ${messageAndCause(expected)}: `, expectedMessageAndCause) + formatReceived("Received value:   ", thrown, "value")
          }`;

    throw new AssertionError(message, matcherName, internalOptions);
};

const checkExpectToThrowExpectedClass = (
    matcherName: MatcherName,
    internalOptions: MatcherInternalOptions,
    options: MatcherHintOptions,
    thrown: Thrown | null,
    expected: Function,
): void => {
    const didPass = thrown !== null && thrown.value instanceof expected;

    if (didPass !== internalOptions.isNot) {
        return;
    }

    const message = didPass
        ? `${matcherHint(matcherName, undefined, undefined, options)}\n\n${printExpectedConstructorNameNot("Expected constructor", expected)}${
              // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition, eqeqeq
              thrown !== null && thrown.value != null && typeof thrown.value.constructor === "function" && thrown.value.constructor !== expected
                  ? printReceivedConstructorNameNot("Received constructor", thrown.value.constructor, expected)
                  : ""
          }\n${
              // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
              thrown !== null && thrown.hasMessage
                  ? formatReceived("Received message: ", thrown, "message") + formatStack(thrown)
                  : formatReceived("Received value: ", thrown, "value")
          }`
        : `${matcherHint(matcherName, undefined, undefined, options)}\n\n${printExpectedConstructorName("Expected constructor", expected)}${
              thrown === null
                  ? `\n${DID_NOT_THROW}`
                  : `${
                        // eslint-disable-next-line eqeqeq
                        thrown.value != null && typeof thrown.value.constructor === "function" ? printReceivedConstructorName("Received constructor", thrown.value.constructor) : ""
                    }\n${thrown.hasMessage ? formatReceived("Received message: ", thrown, "message") + formatStack(thrown) : formatReceived("Received value: ", thrown, "value")}`
          }`;

    throw new AssertionError(message, matcherName, internalOptions);
};

const checkExpectToThrowExpectedString = (
    matcherName: MatcherName,
    internalOptions: MatcherInternalOptions,
    options: MatcherHintOptions,
    thrown: Thrown | null,
    expected: string,
): void => {
    const didPass = thrown !== null && thrown.message.includes(expected);

    if (didPass !== internalOptions.isNot) {
        return;
    }

    const message = didPass
        ? `${matcherHint(matcherName, undefined, undefined, options)}\n\n${formatExpected("Expected substring: not ", expected)}${
              // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
              thrown !== null && thrown.hasMessage
                  ? formatReceived("Received message:       ", thrown, "message", expected) + formatStack(thrown)
                  : formatReceived("Received value:         ", thrown, "value")
          }`
        : `${matcherHint(matcherName, undefined, undefined, options)}\n\n${formatExpected("Expected substring: ", expected)}${
              thrown === null
                  ? `\n${DID_NOT_THROW}`
                  : thrown.hasMessage
                    ? formatReceived("Received message:   ", thrown, "message") + formatStack(thrown)
                    : formatReceived("Received value:     ", thrown, "value")
          }`;

    throw new AssertionError(message, matcherName, internalOptions);
};

const checkExpectToThrow = (matcherName: MatcherName, internalOptions: MatcherInternalOptions, options: MatcherHintOptions, thrown: Thrown | null): void => {
    const didPass = thrown !== null;

    if (didPass !== internalOptions.isNot) {
        return;
    }

    const message = didPass
        ? `${matcherHint(matcherName, undefined, "", options)}\n\n${
              // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
              thrown !== null && thrown.hasMessage
                  ? formatReceived("Error name:    ", thrown, "name") + formatReceived("Error message: ", thrown, "message") + formatStack(thrown)
                  : formatReceived("Thrown value: ", thrown, "value")
          }`
        : `${matcherHint(matcherName, undefined, "", options)}\n\n${DID_NOT_THROW}`;

    throw new AssertionError(message, matcherName, internalOptions);
};

const formatExpected = (label: string, expected: unknown): string => `${label + printExpected(expected)}\n`;

const formatReceived = (label: string, thrown: Thrown | null, key: string, expected?: string | RegExp): string => {
    if (thrown === null) return "";

    if (key === "message") {
        const message = thrown.message;

        if (typeof expected === "string") {
            const index = message.indexOf(expected);
            if (index !== -1) {
                return `${label + printReceivedStringContainExpectedSubstring(message, index, expected.length)}\n`;
            }
        } else if (expected instanceof RegExp) {
            return `${label + printReceivedStringContainExpectedResult(message, typeof expected.exec === "function" ? expected.exec(message) : null)}\n`;
        }

        return `${label + printReceived(message)}\n`;
    }

    if (key === "name") {
        return thrown.isError ? `${label + printReceived(thrown.value.name)}\n` : "";
    }

    if (key === "value") return thrown.isError ? "" : `${label + printReceived(thrown.value)}\n`;

    return "";
};

const formatStack = (thrown: Thrown | null): string => (thrown?.isError === true ? (thrown.value.stack ?? "") : "");

function createMessageAndCauseMessage(error: Error): string {
    if (error.cause instanceof Error) {
        return `{ message: ${error.message}, cause: ${createMessageAndCauseMessage(error.cause)}}`;
    }

    return `{ message: ${error.message} }`;
}

function createMessageAndCause(error: Error): string {
    if (error.cause instanceof Error) {
        return createMessageAndCauseMessage(error);
    }

    return error.message;
}

function messageAndCause(error: Error): string {
    return error.cause === undefined ? "message" : "message and cause";
}

/**
 * Calls the function and ensures it throws an error.
 *
 * Optionally compares the error with
 * [`expected`](https://playwright.dev/docs/api/class-genericassertions#generic-assertions-to-throw-option-expected).
 * Allowed expected values:
 * - Regular expression - error message should **match** the pattern.
 * - String - error message should **include** the substring.
 * - Error object - error message should be **equal to** the message property of the object.
 * - Error class - error object should be an **instance of** the class.
 *
 * **Usage**
 *
 * ```js
 * expect(() => {
 *   throw new Error('Something bad');
 * }).toThrow();
 *
 * expect(() => {
 *   throw new Error('Something bad');
 * }).toThrow(/something/);
 *
 * expect(() => {
 *   throw new Error('Something bad');
 * }).toThrow(Error);
 * ```
 *
 * @param internalOptions Internal options that provide extra context for the matcher.
 * @param received Received value.
 * @param expected Expected error message or error object.
 */
// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
export const toThrowMatcher = createMatcher("toThrow") as ReturnType<typeof createMatcher>;

/**
 * Calls the function and ensures it throws an error.
 *
 * Optionally compares the error with
 * [`expected`](https://playwright.dev/docs/api/class-genericassertions#generic-assertions-to-throw-option-expected).
 * Allowed expected values:
 * - Regular expression - error message should **match** the pattern.
 * - String - error message should **include** the substring.
 * - Error object - error message should be **equal to** the message property of the object.
 * - Error class - error object should be an **instance of** the class.
 *
 * **Usage**
 *
 * ```js
 * expect(() => {
 *   throw new Error('Something bad');
 * }).toThrow();
 *
 * expect(() => {
 *   throw new Error('Something bad');
 * }).toThrow(/something/);
 *
 * expect(() => {
 *   throw new Error('Something bad');
 * }).toThrow(Error);
 * ```
 *
 * @param internalOptions Internal options that provide extra context for the matcher.
 * @param received Received value.
 * @param expected Expected error message or error object.
 */
// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
export const toThrowFromPromiseMatcher = createMatcher("toThrow", true) as ReturnType<typeof createMatcher>;
