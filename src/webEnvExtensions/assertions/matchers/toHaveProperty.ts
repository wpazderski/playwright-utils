import { equals, getPath, iterableEquality, pathAsArray } from "@jest/expect-utils";
import { getType } from "jest-get-type";
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
import { EXPECTED_VALUE_LABEL, RECEIVED_VALUE_LABEL } from "./common.ts";
import { AssertionError } from "./errors/AssertionError.ts";

// For consistency, this matcher is largely based on Playwright's matcher: https://github.com/microsoft/playwright/blob/main/packages/playwright/bundles/expect/third_party/matchers.ts

/**
 * Ensures that property at provided `keyPath` exists on the object and optionally checks that property is equal to
 * the
 * [`expected`](https://playwright.dev/docs/api/class-genericassertions#generic-assertions-to-have-property-option-expected).
 * Equality is checked recursively, similarly to
 * [expect(value).toEqual(expected)](https://playwright.dev/docs/api/class-genericassertions#generic-assertions-to-equal).
 *
 * **Usage**
 *
 * ```js
 * const value = {
 *   a: {
 *     b: [42],
 *   },
 *   c: true,
 * };
 * expect(value).toHaveProperty('a.b');
 * expect(value).toHaveProperty('a.b', [42]);
 * expect(value).toHaveProperty('a.b[0]', 42);
 * expect(value).toHaveProperty('c');
 * expect(value).toHaveProperty('c', true);
 * ```
 *
 * @param internalOptions Internal options that provide extra context for the matcher.
 * @param received Received value.
 * @param expectedPath Path to the property. Use dot notation `a.b` to check nested properties and indexed `a[2]` notation to check nested array items.
 * @param expectedValue Optional expected value to compare the property to.
 */
// eslint-disable-next-line @typescript-eslint/max-params
export function toHavePropertyMatcher(internalOptions: MatcherInternalOptions, received: object, expectedPath: string | string[], expectedValue?: unknown): void {
    const matcherName = "toHaveProperty";
    const expectedArgument = "path";
    const hasValue = arguments.length === 4;
    const options: MatcherHintOptions = {
        isNot: internalOptions.isNot,
        promise: internalOptions.promiseExpectedState ?? "",
        secondArgument: hasValue ? "value" : "",
    };

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (received === null || received === undefined) {
        throw new Error(
            matcherErrorMessage(
                matcherHint(matcherName, undefined, expectedArgument, options),
                `${RECEIVED_COLOR("received")} value must not be null nor undefined`,
                printWithType("Received", received, printReceived),
            ),
        );
    }

    const expectedPathType = getType(expectedPath);

    if (expectedPathType !== "string" && expectedPathType !== "array") {
        throw new Error(
            matcherErrorMessage(
                matcherHint(matcherName, undefined, expectedArgument, options),
                `${EXPECTED_COLOR("expected")} path must be a string or array`,
                printWithType("Expected", expectedPath, printExpected),
            ),
        );
    }

    const expectedPathLength = typeof expectedPath === "string" ? pathAsArray(expectedPath).length : expectedPath.length;

    if (expectedPathType === "array" && expectedPathLength === 0) {
        throw new Error(
            matcherErrorMessage(
                matcherHint(matcherName, undefined, expectedArgument, options),
                `${EXPECTED_COLOR("expected")} path must not be an empty array`,
                printWithType("Expected", expectedPath, printExpected),
            ),
        );
    }

    const result = getPath(received, expectedPath);
    const { lastTraversedObject, endPropIsDefined: isEndPropIsDefined, hasEndProp, value } = result;
    const receivedPath = result.traversedPath;
    const hasCompletePath = receivedPath.length === expectedPathLength;
    const receivedValue = hasCompletePath ? result.value : lastTraversedObject;

    const didPass = hasValue && isEndPropIsDefined === true ? equals(value, expectedValue, [iterableEquality]) : Boolean(hasEndProp);

    if (didPass === internalOptions.isNot) {
        const message = didPass
            ? `${matcherHint(matcherName, undefined, expectedArgument, options)}\n\n${
                  hasValue
                      ? `Expected path: ${printExpected(expectedPath)}\n\n` +
                        `Expected value: not ${printExpected(expectedValue)}${
                            stringify(expectedValue) === stringify(receivedValue) ? "" : `\nReceived value:     ${printReceived(receivedValue)}`
                        }`
                      : `Expected path: not ${printExpected(expectedPath)}\n\nReceived value: ${printReceived(receivedValue)}`
              }`
            : `${matcherHint(matcherName, undefined, expectedArgument, options)}\n\n` +
              `Expected path: ${printExpected(expectedPath)}\n${
                  hasCompletePath
                      ? `\n${printDiffOrStringify(expectedValue, receivedValue, EXPECTED_VALUE_LABEL, RECEIVED_VALUE_LABEL, false)}`
                      : `Received path: ${printReceived(expectedPathType === "array" || receivedPath.length === 0 ? receivedPath : receivedPath.join("."))}\n\n${
                            hasValue ? `Expected value: ${printExpected(expectedValue)}\n` : ""
                        }Received value: ${printReceived(receivedValue)}`
              }`;

        throw new AssertionError(message, matcherName, internalOptions);
    }
}
