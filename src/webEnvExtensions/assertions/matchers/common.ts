/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { type Tester, arrayBufferEquality, iterableEquality, sparseArrayEquality, subsetEquality, typeEquality } from "@jest/expect-utils";
import { EXPECTED_COLOR, INVERTED_COLOR, RECEIVED_COLOR, printReceived, stringify } from "jest-matcher-utils";
import * as matcherUtils from "jest-matcher-utils";
import type { MatcherState } from "./types.ts";
// For consistency, this code is largely based on Playwright's code: https://github.com/microsoft/playwright/tree/main/packages/playwright/bundles/expect/third_party

// eslint-disable-next-line @typescript-eslint/naming-convention
export const JEST_MATCHERS_OBJECT: symbol =
    Object.getOwnPropertySymbols(globalThis as any).find((key) => {
        if (typeof key === "symbol" && key.description === "$$jest-matchers-object") {
            return true;
        }
        return false;
    }) ?? Symbol.for("$$jest-matchers-object");
// eslint-disable-next-line prefer-object-has-own
if (!Object.prototype.hasOwnProperty.call(globalThis, JEST_MATCHERS_OBJECT)) {
    const defaultState: MatcherState = {
        assertionCalls: 0,
        expectedAssertionsNumber: null,
        isExpectingAssertions: false,
        numPassingAsserts: 0,
        suppressedErrors: [], // errors that are not thrown immediately.
    };
    Object.defineProperty(globalThis, JEST_MATCHERS_OBJECT, {
        value: {
            customEqualityTesters: [],
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            matchers: Object.create(null),
            state: defaultState,
        },
    });
}

// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
export const getState = <TState extends MatcherState = MatcherState>(): TState => (globalThis as any)[JEST_MATCHERS_OBJECT].state;

export const getCustomEqualityTesters = (): Tester[] => (globalThis as any)[JEST_MATCHERS_OBJECT].customEqualityTesters;

export const utils = Object.freeze({
    ...matcherUtils,
    iterableEquality,
    subsetEquality,
}) as typeof matcherUtils & {
    iterableEquality: typeof iterableEquality;
    subsetEquality: typeof subsetEquality;
};

export function getPrototype(obj: object): any {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition, @typescript-eslint/strict-boolean-expressions
    if (Object.getPrototypeOf) return Object.getPrototypeOf(obj);

    if (obj.constructor.prototype === obj) return null;

    return obj.constructor.prototype;
}

export function hasProperty(obj: object | null, property: string | symbol): boolean {
    if (!obj) return false;

    // eslint-disable-next-line prefer-object-has-own
    if (Object.prototype.hasOwnProperty.call(obj, property)) return true;

    return hasProperty(getPrototype(obj), property);
}

// eslint-disable-next-line @typescript-eslint/unbound-method
const functionToString = Function.prototype.toString;
export function fnNameFor(func: () => unknown): string {
    if (func.name) {
        return func.name;
    }

    // eslint-disable-next-line @typescript-eslint/prefer-regexp-exec, prefer-named-capture-group, require-unicode-regexp
    const matches = functionToString.call(func).match(/^(?:async)?\s*function\s*\*?\s*([\w$]+)\s*\(/);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return matches ? matches[1]! : "<anonymous>";
}

/* eslint-disable @typescript-eslint/naming-convention */
export const EXPECTED_LABEL = "Expected";
export const RECEIVED_LABEL = "Received";
export const EXPECTED_VALUE_LABEL = "Expected value";
export const RECEIVED_VALUE_LABEL = "Received value";
/* eslint-enable @typescript-eslint/naming-convention */

export const toStrictEqualTesters = [iterableEquality, typeEquality, sparseArrayEquality, arrayBufferEquality] as Tester[];

const printSubstring = (val: string): string => val.replace(/"|\\/gu, "\\$&");

export const printReceivedStringContainExpectedSubstring = (
    received: string,
    start: number,
    length: number, // not end
): string =>
    RECEIVED_COLOR(
        `"${printSubstring(received.slice(0, start))}${INVERTED_COLOR(printSubstring(received.slice(start, start + length)))}${printSubstring(received.slice(start + length))}"`,
    );

export const printReceivedStringContainExpectedResult = (received: string, result: RegExpExecArray | null): string =>
    result === null ? printReceived(received) : printReceivedStringContainExpectedSubstring(received, result.index, result[0].length);

// The serialized array is compatible with pretty-format package min option.
// However, items have default stringify depth (instead of depth - 1)
// so expected item looks consistent by itself and enclosed in the array.
export const printReceivedArrayContainExpectedItem = (received: unknown[], index: number): string =>
    RECEIVED_COLOR(
        `[${received
            .map((item, i) => {
                const stringified = stringify(item);
                return i === index ? INVERTED_COLOR(stringified) : stringified;
            })
            .join(", ")}]`,
    );

// eslint-disable-next-line @typescript-eslint/max-params
export const printCloseTo = (receivedDiff: number, expectedDiff: number, precision: number, isNot: boolean | undefined): string => {
    const receivedDiffString = stringify(receivedDiff);
    const expectedDiffString = receivedDiffString.includes("e")
        ? // toExponential arg is number of digits after the decimal point.
          expectedDiff.toExponential(0)
        : precision >= 0 && precision < 20
          ? // toFixed arg is number of digits after the decimal point.
            // It may be a value between 0 and 20 inclusive.
            // Implementations may optionally support a larger range of values.
            expectedDiff.toFixed(precision + 1)
          : stringify(expectedDiff);

    return (
        `Expected precision:  ${isNot === true ? "    " : ""}  ${stringify(precision)}\n` +
        `Expected difference: ${isNot === true ? "not " : ""}< ${EXPECTED_COLOR(expectedDiffString)}\n` +
        `Received difference: ${isNot === true ? "    " : ""}  ${RECEIVED_COLOR(receivedDiffString)}`
    );
};

export const printExpectedConstructorName = (
    label: string,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
    expected: Function,
): string => `${printConstructorName(label, expected, false, true)}\n`;

export const printExpectedConstructorNameNot = (
    label: string,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
    expected: Function,
): string => `${printConstructorName(label, expected, true, true)}\n`;

export const printReceivedConstructorName = (
    label: string,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
    received: Function,
): string => `${printConstructorName(label, received, false, false)}\n`;

// Do not call function if received is equal to expected.
export const printReceivedConstructorNameNot = (
    label: string,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
    received: Function,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
    expected: Function,
): string =>
    typeof expected.name === "string" && expected.name.length !== 0 && typeof received.name === "string" && received.name.length !== 0
        ? `${printConstructorName(label, received, true, false)} ${
              Object.getPrototypeOf(received) === expected ? "extends" : "extends … extends"
          } ${EXPECTED_COLOR(expected.name)}\n`
        : `${printConstructorName(label, received, false, false)}\n`;

const printConstructorName = (
    label: string,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
    constructor: Function,
    isNot: boolean,
    isExpected: boolean,
    // eslint-disable-next-line @typescript-eslint/max-params
): string =>
    // eslint-disable-next-line no-negated-condition
    typeof constructor.name !== "string"
        ? `${label} name is not a string`
        : constructor.name.length === 0
          ? `${label} name is an empty string`
          : // eslint-disable-next-line no-negated-condition
            `${label}: ${!isNot ? "" : isExpected ? "not " : "    "}${isExpected ? EXPECTED_COLOR(constructor.name) : RECEIVED_COLOR(constructor.name)}`;
