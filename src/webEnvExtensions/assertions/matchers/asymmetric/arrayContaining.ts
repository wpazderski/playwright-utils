import { equals } from "@jest/expect-utils";
import { AsymmetricMatcher } from "./AsymmetricMatcher.ts";

// For consistency, this code is largely based on Playwright's code: https://github.com/microsoft/playwright/tree/main/packages/playwright/bundles/expect/third_party

/**
 * Assymmetric matcher that matches an array that contains all of the elements in the expected array, in any order.
 * Note that received array may be a superset of the expected array and contain some extra elements.
 *
 * Use this method inside
 * [expect(value).toEqual(expected)](https://playwright.dev/docs/api/class-genericassertions#generic-assertions-to-equal)
 * to perform pattern matching.
 *
 * **Usage**
 *
 * ```js
 * expect([1, 2, 3]).toEqual(expect.arrayContaining([3, 1]));
 * expect([1, 2, 3]).not.toEqual(expect.arrayContaining([1, 4]));
 * ```
 */
export class ArrayContainingAsymmetricMatcher extends AsymmetricMatcher<unknown[]> {
    /**
     * Creates a new instance of `ArrayContaining` asymmetric matcher.
     *
     * @param sample Expected array that is a subset of the received value.
     * @param inverse If true, matches if the received array does not contain the expected elements.
     */
    constructor(sample: unknown[], inverse = false) {
        super(sample, inverse);
    }

    asymmetricMatch(other: unknown): boolean {
        if (!Array.isArray(this.sample)) {
            throw new Error(`You must provide an array to ${this.toString()}, not '${typeof this.sample}'.`);
        }

        const doesMatch = this.sample.length === 0 || (Array.isArray(other) && this.sample.every((item) => other.some((another) => equals(item, another, []))));

        return this.inverse ? !doesMatch : doesMatch;
    }

    toString(): string {
        return `Array${this.inverse ? "Not" : ""}Containing`;
    }

    override getExpectedType(): string {
        return "array";
    }
}

/**
 * `expect.arrayContaining()` matches an array that contains all of the elements in the expected array, in any order.
 * Note that received array may be a superset of the expected array and contain some extra elements.
 *
 * Use this method inside
 * [expect(value).toEqual(expected)](https://playwright.dev/docs/api/class-genericassertions#generic-assertions-to-equal)
 * to perform pattern matching.
 *
 * **Usage**
 *
 * ```js
 * expect([1, 2, 3]).toEqual(expect.arrayContaining([3, 1]));
 * expect([1, 2, 3]).not.toEqual(expect.arrayContaining([1, 4]));
 * ```
 *
 * @param expected Expected array that is a subset of the received value.
 */
export const arrayContaining = (expected: unknown[]): ArrayContainingAsymmetricMatcher => new ArrayContainingAsymmetricMatcher(expected);

/**
 * `expect.arrayContaining()` matches an array that contains all of the elements in the expected array, in any order.
 * Note that received array may be a superset of the expected array and contain some extra elements.
 *
 * Use this method inside
 * [expect(value).toEqual(expected)](https://playwright.dev/docs/api/class-genericassertions#generic-assertions-to-equal)
 * to perform pattern matching.
 *
 * **Usage**
 *
 * ```js
 * expect([1, 2, 3]).toEqual(expect.arrayContaining([3, 1]));
 * expect([1, 2, 3]).not.toEqual(expect.arrayContaining([1, 4]));
 * ```
 *
 * @param expected Expected array that is a subset of the received value.
 */
export const arrayNotContaining = (expected: unknown[]): ArrayContainingAsymmetricMatcher => new ArrayContainingAsymmetricMatcher(expected, true);
