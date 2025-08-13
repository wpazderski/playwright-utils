import { equals, getObjectKeys } from "@jest/expect-utils";
import { hasProperty } from "../common.ts";
import { AsymmetricMatcher } from "./AsymmetricMatcher.ts";

// For consistency, this code is largely based on Playwright's code: https://github.com/microsoft/playwright/tree/main/packages/playwright/bundles/expect/third_party

/**
 * Assymmetric matcher that matches an object that contains and matches all of the properties in the expected
 * object. Note that received object may be a superset of the expected object and contain some extra properties.
 *
 * Use this method inside
 * [expect(value).toEqual(expected)](https://playwright.dev/docs/api/class-genericassertions#generic-assertions-to-equal)
 * to perform pattern matching. Object properties can be matchers to further relax the expectation. See examples.
 *
 * **Usage**
 *
 * ```js
 * // Assert some of the properties.
 * expect({ foo: 1, bar: 2 }).toEqual(expect.objectContaining({ foo: 1 }));
 *
 * // Matchers can be used on the properties as well.
 * expect({ foo: 1, bar: 2 }).toEqual(expect.objectContaining({ bar: expect.any(Number) }));
 *
 * // Complex matching of sub-properties.
 * expect({
 *   list: [1, 2, 3],
 *   obj: { prop: 'Hello world!', another: 'some other value' },
 *   extra: 'extra',
 * }).toEqual(expect.objectContaining({
 *   list: expect.arrayContaining([2, 3]),
 *   obj: expect.objectContaining({ prop: expect.stringContaining('Hello') }),
 * }));
 * ```
 */
export class ObjectContainingAsymmetricMatcher extends AsymmetricMatcher<Record<string | symbol, unknown>> {
    /**
     * Creates a new instance of `ObjectContaining` asymmetric matcher.
     *
     * @param sample Expected object pattern that contains a subset of the properties.
     * @param inverse If true, matches if the received object does not contain the expected properties or if the properties do not match.
     */
    constructor(sample: Record<string | symbol, unknown>, inverse = false) {
        super(sample, inverse);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
    asymmetricMatch(other: any): boolean {
        if (typeof this.sample !== "object") {
            throw new Error(`You must provide an object to ${this.toString()}, not '${typeof this.sample}'.`);
        }

        let doesMatch = true;
        const objectKeys = getObjectKeys(this.sample);

        for (const key of objectKeys) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument
            if (!hasProperty(other, key) || !equals(this.sample[key], other[key], [])) {
                doesMatch = false;
                break;
            }
        }

        return this.inverse ? !doesMatch : doesMatch;
    }

    toString(): string {
        return `Object${this.inverse ? "Not" : ""}Containing`;
    }

    override getExpectedType(): string {
        return "object";
    }
}

/**
 * `expect.objectContaining()` matches an object that contains and matches all of the properties in the expected
 * object. Note that received object may be a superset of the expected object and contain some extra properties.
 *
 * Use this method inside
 * [expect(value).toEqual(expected)](https://playwright.dev/docs/api/class-genericassertions#generic-assertions-to-equal)
 * to perform pattern matching. Object properties can be matchers to further relax the expectation. See examples.
 *
 * **Usage**
 *
 * ```js
 * // Assert some of the properties.
 * expect({ foo: 1, bar: 2 }).toEqual(expect.objectContaining({ foo: 1 }));
 *
 * // Matchers can be used on the properties as well.
 * expect({ foo: 1, bar: 2 }).toEqual(expect.objectContaining({ bar: expect.any(Number) }));
 *
 * // Complex matching of sub-properties.
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
 * @param expected Expected object pattern that contains a subset of the properties.
 */
export const objectContaining = (expected: Record<string, unknown>): ObjectContainingAsymmetricMatcher => new ObjectContainingAsymmetricMatcher(expected);

/**
 * `expect.objectContaining()` matches an object that contains and matches all of the properties in the expected
 * object. Note that received object may be a superset of the expected object and contain some extra properties.
 *
 * Use this method inside
 * [expect(value).toEqual(expected)](https://playwright.dev/docs/api/class-genericassertions#generic-assertions-to-equal)
 * to perform pattern matching. Object properties can be matchers to further relax the expectation. See examples.
 *
 * **Usage**
 *
 * ```js
 * // Assert some of the properties.
 * expect({ foo: 1, bar: 2 }).toEqual(expect.objectContaining({ foo: 1 }));
 *
 * // Matchers can be used on the properties as well.
 * expect({ foo: 1, bar: 2 }).toEqual(expect.objectContaining({ bar: expect.any(Number) }));
 *
 * // Complex matching of sub-properties.
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
 * @param expected Expected object pattern that contains a subset of the properties.
 */
export const objectNotContaining = (expected: Record<string, unknown>): ObjectContainingAsymmetricMatcher => new ObjectContainingAsymmetricMatcher(expected, true);
