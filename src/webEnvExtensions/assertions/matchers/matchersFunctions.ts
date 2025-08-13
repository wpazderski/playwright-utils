import type { MatcherInternalOptions, expect as _expect } from "../expect.ts";
import { toBeMatcher } from "./toBe.ts";
import { toBeCloseToMatcher } from "./toBeCloseTo.ts";
import { toBeDefinedMatcher } from "./toBeDefined.ts";
import { toBeFalsyMatcher } from "./toBeFalsy.ts";
import { toBeGreaterThanMatcher } from "./toBeGreaterThan.ts";
import { toBeGreaterThanOrEqualMatcher } from "./toBeGreaterThanOrEqual.ts";
import { toBeInstanceOfMatcher } from "./toBeInstanceOf.ts";
import { toBeLessThanMatcher } from "./toBeLessThan.ts";
import { toBeLessThanOrEqualMatcher } from "./toBeLessThanOrEqual.ts";
import { toBeNaNMatcher } from "./toBeNaN.ts";
import { toBeNullMatcher } from "./toBeNull.ts";
import { toBeTruthyMatcher } from "./toBeTruthy.ts";
import { toBeUndefinedMatcher } from "./toBeUndefined.ts";
import { toContainMatcher } from "./toContain.ts";
import { toContainEqualMatcher } from "./toContainEqual.ts";
import { toEqualMatcher } from "./toEqual.ts";
import { toHaveLengthMatcher } from "./toHaveLength.ts";
import { toHavePropertyMatcher } from "./toHaveProperty.ts";
import { toMatchMatcher } from "./toMatch.ts";
import { toMatchObjectMatcher } from "./toMatchObject.ts";
import { toStrictEqualMatcher } from "./toStrictEqual.ts";
import { toThrowMatcher } from "./toThrow.ts";
import { toThrowErrorMatcher } from "./toThrowErrorMatcher.ts";
import type { ContainIterable } from "./types.ts";

/**
 * All matcher functions.
 */
export const matchersFunctions: MatchersFunctions = {
    toBe: toBeMatcher,
    toBeCloseTo: toBeCloseToMatcher,
    toBeDefined: toBeDefinedMatcher,
    toBeFalsy: toBeFalsyMatcher,
    toBeGreaterThan: toBeGreaterThanMatcher,
    toBeGreaterThanOrEqual: toBeGreaterThanOrEqualMatcher,
    toBeInstanceOf: toBeInstanceOfMatcher,
    toBeLessThan: toBeLessThanMatcher,
    toBeLessThanOrEqual: toBeLessThanOrEqualMatcher,
    toBeNaN: toBeNaNMatcher,
    toBeNull: toBeNullMatcher,
    toBeTruthy: toBeTruthyMatcher,
    toBeUndefined: toBeUndefinedMatcher,
    toContain: toContainMatcher,
    toContainEqual: toContainEqualMatcher,
    toEqual: toEqualMatcher,
    toHaveLength: toHaveLengthMatcher,
    toHaveProperty: toHavePropertyMatcher,
    toMatch: toMatchMatcher,
    toMatchObject: toMatchObjectMatcher,
    toStrictEqual: toStrictEqualMatcher,
    toThrow: toThrowMatcher,
    toThrowError: toThrowErrorMatcher,
};

/**
 * All matcher functions.
 */
export interface MatchersFunctions {
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
    toBe: (internalOptions: MatcherInternalOptions, received: unknown, expected: unknown) => void;

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
    toBeCloseTo: (internalOptions: MatcherInternalOptions, received: number, expected: number, numDigits?: number) => void;

    /**
     * Ensures that value is not `undefined`.
     *
     * **Usage**
     *
     * ```js
     * const value = null;
     * expect(value).toBeDefined();
     * ```
     *
     * @param internalOptions Internal options that provide extra context for the matcher.
     * @param received Received value.
     */
    // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
    toBeDefined: (internalOptions: MatcherInternalOptions, received: unknown, _expected: void) => void;

    /**
     * Ensures that value is false in a boolean context, one of `false`, `0`, `''`, `null`, `undefined` or `NaN`. Use this
     * method when you don't care about the specific value.
     *
     * **Usage**
     *
     * ```js
     * const value = null;
     * expect(value).toBeFalsy();
     * ```
     *
     * @param internalOptions Internal options that provide extra context for the matcher.
     * @param received Received value.
     */
    // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
    toBeFalsy: (internalOptions: MatcherInternalOptions, received: unknown, _expected: void) => void;

    /**
     * Ensures that `value > expected` for number or big integer values.
     *
     * **Usage**
     *
     * ```js
     * const value = 42;
     * expect(value).toBeGreaterThan(1);
     * ```
     *
     * @param internalOptions Internal options that provide extra context for the matcher.
     * @param received Received value.
     * @param expected The value to compare to.
     */
    toBeGreaterThan: (internalOptions: MatcherInternalOptions, received: number | bigint, expected: number | bigint) => void;

    /**
     * Ensures that `value >= expected` for number or big integer values.
     *
     * **Usage**
     *
     * ```js
     * const value = 42;
     * expect(value).toBeGreaterThanOrEqual(42);
     * ```
     *
     * @param internalOptions Internal options that provide extra context for the matcher.
     * @param received Received value.
     * @param expected The value to compare to.
     */
    toBeGreaterThanOrEqual: (internalOptions: MatcherInternalOptions, received: number | bigint, expected: number | bigint) => void;

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
    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type, @typescript-eslint/no-explicit-any
    toBeInstanceOf: (internalOptions: MatcherInternalOptions, received: any, expected: Function) => void;

    /**
     * Ensures that `value < expected` for number or big integer values.
     *
     * **Usage**
     *
     * ```js
     * const value = 42;
     * expect(value).toBeLessThan(100);
     * ```
     *
     * @param internalOptions Internal options that provide extra context for the matcher.
     * @param received Received value.
     * @param expected The value to compare to.
     */
    toBeLessThan: (internalOptions: MatcherInternalOptions, received: number | bigint, expected: number | bigint) => void;

    /**
     * Ensures that `value <= expected` for number or big integer values.
     *
     * **Usage**
     *
     * ```js
     * const value = 42;
     * expect(value).toBeLessThanOrEqual(42);
     * ```
     *
     * @param internalOptions Internal options that provide extra context for the matcher.
     * @param received Received value.
     * @param expected The value to compare to.
     */
    toBeLessThanOrEqual: (internalOptions: MatcherInternalOptions, received: number | bigint, expected: number | bigint) => void;

    /**
     * Ensures that value is `NaN`.
     *
     * **Usage**
     *
     * ```js
     * const value = NaN;
     * expect(value).toBeNaN();
     * ```
     *
     * @param internalOptions Internal options that provide extra context for the matcher.
     * @param received Received value.
     */
    // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
    toBeNaN: (internalOptions: MatcherInternalOptions, received: unknown, _expected: void) => void;

    /**
     * Ensures that value is `null`.
     *
     * **Usage**
     *
     * ```js
     * const value = null;
     * expect(value).toBeNull();
     * ```
     *
     * @param internalOptions Internal options that provide extra context for the matcher.
     * @param received Received value.
     */
    // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
    toBeNull: (internalOptions: MatcherInternalOptions, received: unknown, _expected: void) => void;

    /**
     * Ensures that value is true in a boolean context, **anything but** `false`, `0`, `''`, `null`, `undefined` or `NaN`.
     * Use this method when you don't care about the specific value.
     *
     * **Usage**
     *
     * ```js
     * const value = { example: 'value' };
     * expect(value).toBeTruthy();
     * ```
     *
     * @param internalOptions Internal options that provide extra context for the matcher.
     * @param received Received value.
     */
    // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
    toBeTruthy: (internalOptions: MatcherInternalOptions, received: unknown, _expected: void) => void;

    /**
     * Ensures that value is `undefined`.
     *
     * **Usage**
     *
     * ```js
     * const value = undefined;
     * expect(value).toBeUndefined();
     * ```
     *
     * @param internalOptions Internal options that provide extra context for the matcher.
     * @param received Received value.
     */
    // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
    toBeUndefined: (internalOptions: MatcherInternalOptions, received: unknown, _expected: void) => void;

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
    // eslint-disable-next-line @typescript-eslint/method-signature-style
    toContain(internalOptions: MatcherInternalOptions, received: ContainIterable, expected: unknown): void;

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
    // eslint-disable-next-line @typescript-eslint/method-signature-style
    toContain(internalOptions: MatcherInternalOptions, received: string, expected: string): void;

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
    toContainEqual: (internalOptions: MatcherInternalOptions, received: ContainIterable, expected: unknown) => void;

    /**
     * Compares contents of the value with contents of
     * [`expected`](https://playwright.dev/docs/api/class-genericassertions#generic-assertions-to-equal-option-expected),
     * performing "deep equality" check.
     *
     * For objects, this method recursively checks equality of all fields, rather than comparing objects by reference as
     * performed by
     * [expect(value).toBe(expected)](https://playwright.dev/docs/api/class-genericassertions#generic-assertions-to-be).
     *
     * For primitive values, this method is equivalent to
     * [expect(value).toBe(expected)](https://playwright.dev/docs/api/class-genericassertions#generic-assertions-to-be).
     *
     * **Usage**
     *
     * ```js
     * const value = { prop: 1 };
     * expect(value).toEqual({ prop: 1 });
     * ```
     *
     * **Non-strict equality**
     *
     * [expect(value).toEqual(expected)](https://playwright.dev/docs/api/class-genericassertions#generic-assertions-to-equal)
     * performs deep equality check that compares contents of the received and expected values. To ensure two objects
     * reference the same instance, use
     * [expect(value).toBe(expected)](https://playwright.dev/docs/api/class-genericassertions#generic-assertions-to-be)
     * instead.
     *
     * [expect(value).toEqual(expected)](https://playwright.dev/docs/api/class-genericassertions#generic-assertions-to-equal)
     * ignores `undefined` properties and array items, and does not insist on object types being equal. For stricter
     * matching, use
     * [expect(value).toStrictEqual(expected)](https://playwright.dev/docs/api/class-genericassertions#generic-assertions-to-strict-equal).
     *
     * **Pattern matching**
     *
     * [expect(value).toEqual(expected)](https://playwright.dev/docs/api/class-genericassertions#generic-assertions-to-equal)
     * can be also used to perform pattern matching on objects, arrays and primitive types, with the help of the following
     * matchers:
     * - [expect(value).any(constructor)](https://playwright.dev/docs/api/class-genericassertions#generic-assertions-any)
     * - [expect(value).anything()](https://playwright.dev/docs/api/class-genericassertions#generic-assertions-anything)
     * - [expect(value).arrayContaining(expected)](https://playwright.dev/docs/api/class-genericassertions#generic-assertions-array-containing)
     * - [expect(value).closeTo(expected[, numDigits])](https://playwright.dev/docs/api/class-genericassertions#generic-assertions-close-to)
     * - [expect(value).objectContaining(expected)](https://playwright.dev/docs/api/class-genericassertions#generic-assertions-object-containing)
     * - [expect(value).stringContaining(expected)](https://playwright.dev/docs/api/class-genericassertions#generic-assertions-string-containing)
     * - [expect(value).stringMatching(expected)](https://playwright.dev/docs/api/class-genericassertions#generic-assertions-string-matching)
     *
     * Here is an example that asserts some of the values inside a complex object:
     *
     * ```js
     * expect({
     *   list: [1, 2, 3],
     *   obj: { prop: 'Hello world!', another: 'some other value' },
     *   extra: 'extra',
     * }).toEqual(expect.objectContaining({
     *   list: expect.arrayContaining([2, 3]),
     *   obj: expect.objectContaining({ prop: expect.stringContaining('Hello') }),
     * }));
     * ```
     *
     * @param internalOptions Internal options that provide extra context for the matcher.
     * @param received Received value.
     * @param expected Expected value.
     */
    toEqual: (internalOptions: MatcherInternalOptions, received: unknown, expected: unknown) => void;

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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    toHaveLength: (internalOptions: MatcherInternalOptions, received: any, expected: number) => void;

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
    toHaveProperty: (internalOptions: MatcherInternalOptions, received: object, expectedPath: string | string[], expectedValue?: unknown) => void;

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
    toMatch: (internalOptions: MatcherInternalOptions, received: string, expected: string | RegExp) => void;

    /**
     * Compares contents of the value with contents of
     * [`expected`](https://playwright.dev/docs/api/class-genericassertions#generic-assertions-to-match-object-option-expected),
     * performing "deep equality" check. Allows extra properties to be present in the value, unlike
     * [expect(value).toEqual(expected)](https://playwright.dev/docs/api/class-genericassertions#generic-assertions-to-equal),
     * so you can check just a subset of object properties.
     *
     * When comparing arrays, the number of items must match, and each item is checked recursively.
     *
     * **Usage**
     *
     * ```js
     * const value = {
     *   a: 1,
     *   b: 2,
     *   c: true,
     * };
     * expect(value).toMatchObject({ a: 1, c: true });
     * expect(value).toMatchObject({ b: 2, c: true });
     *
     * expect([{ a: 1, b: 2 }]).toMatchObject([{ a: 1 }]);
     * ```
     *
     * @param internalOptions Internal options that provide extra context for the matcher.
     * @param received Received value.
     * @param expected The expected object value to match against.
     */
    toMatchObject: (internalOptions: MatcherInternalOptions, received: object, expected: object) => void;

    /**
     * Compares contents of the value with contents of
     * [`expected`](https://playwright.dev/docs/api/class-genericassertions#generic-assertions-to-strict-equal-option-expected)
     * **and** their types.
     *
     * Differences from
     * [expect(value).toEqual(expected)](https://playwright.dev/docs/api/class-genericassertions#generic-assertions-to-equal):
     * - Keys with undefined properties are checked. For example, `{ a: undefined, b: 2 }` does not match `{ b: 2 }`.
     * - Array sparseness is checked. For example, `[, 1]` does not match `[undefined, 1]`.
     * - Object types are checked to be equal. For example, a class instance with fields `a` and `b` will not equal a
     *   literal object with fields `a` and `b`.
     *
     * **Usage**
     *
     * ```js
     * const value = { prop: 1 };
     * expect(value).toStrictEqual({ prop: 1 });
     * ```
     *
     * @param internalOptions Internal options that provide extra context for the matcher.
     * @param received Received value.
     * @param expected Expected value.
     */
    toStrictEqual: (internalOptions: MatcherInternalOptions, received: unknown, expected: unknown) => void;

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
    toThrow: (internalOptions: MatcherInternalOptions, received: unknown, expected?: unknown) => void;

    /**
     * An alias for
     * [expect(value).toThrow([expected])](https://playwright.dev/docs/api/class-genericassertions#generic-assertions-to-throw).
     *
     * **Usage**
     *
     * ```js
     * expect(() => {
     *   throw new Error('Something bad');
     * }).toThrowError();
     * ```
     *
     * @param internalOptions Internal options that provide extra context for the matcher.
     * @param received Received value.
     * @param expected Expected error message or error object.
     */
    toThrowError: (internalOptions: MatcherInternalOptions, received: unknown, expected?: unknown) => void;
}
