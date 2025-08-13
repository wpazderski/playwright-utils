import { isA } from "@jest/expect-utils";
import { AsymmetricMatcher } from "./AsymmetricMatcher.ts";

// For consistency, this code is largely based on Playwright's code: https://github.com/microsoft/playwright/tree/main/packages/playwright/bundles/expect/third_party

/**
 * Assymmetric matcher that matches a string that contains the expected substring. Use it inside
 * [expect(value).toEqual(expected)](https://playwright.dev/docs/api/class-genericassertions#generic-assertions-to-equal)
 * to perform pattern matching.
 *
 * **Usage**
 *
 * ```js
 * expect('Hello world!').toEqual(expect.stringContaining('Hello'));
 * ```
 */
export class StringContainingAsymmetricMatcher extends AsymmetricMatcher<string> {
    /**
     * Creates a new instance of `StringContaining` asymmetric matcher.
     *
     * @param sample Expected substring.
     * @param inverse If true, matches if the received string does not contain the expected substring.
     */
    constructor(sample: string, inverse = false) {
        if (!isA("String", sample)) throw new Error("Expected is not a string");
        super(sample, inverse);
    }

    asymmetricMatch(other: unknown): boolean {
        const doesMatch = isA<string>("String", other) && other.includes(this.sample);

        return this.inverse ? !doesMatch : doesMatch;
    }

    toString(): string {
        return `String${this.inverse ? "Not" : ""}Containing`;
    }

    override getExpectedType(): string {
        return "string";
    }
}

/**
 * `expect.stringContaining()` matches a string that contains the expected substring. Use this method inside
 * [expect(value).toEqual(expected)](https://playwright.dev/docs/api/class-genericassertions#generic-assertions-to-equal)
 * to perform pattern matching.
 *
 * **Usage**
 *
 * ```js
 * expect('Hello world!').toEqual(expect.stringContaining('Hello'));
 * ```
 *
 * @param expected Expected substring.
 */
export const stringContaining = (expected: string): StringContainingAsymmetricMatcher => new StringContainingAsymmetricMatcher(expected);

/**
 * `expect.stringContaining()` matches a string that contains the expected substring. Use this method inside
 * [expect(value).toEqual(expected)](https://playwright.dev/docs/api/class-genericassertions#generic-assertions-to-equal)
 * to perform pattern matching.
 *
 * **Usage**
 *
 * ```js
 * expect('Hello world!').toEqual(expect.stringContaining('Hello'));
 * ```
 *
 * @param expected Expected substring.
 */
export const stringNotContaining = (expected: string): StringContainingAsymmetricMatcher => new StringContainingAsymmetricMatcher(expected, true);
