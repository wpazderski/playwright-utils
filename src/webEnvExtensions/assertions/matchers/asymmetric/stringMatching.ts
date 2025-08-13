import { isA } from "@jest/expect-utils";
import { AsymmetricMatcher } from "./AsymmetricMatcher.ts";

// For consistency, this code is largely based on Playwright's code: https://github.com/microsoft/playwright/tree/main/packages/playwright/bundles/expect/third_party

/**
 * Assymmetric matcher that matches a received string that in turn matches the expected pattern. Use it
 * inside
 * [expect(value).toEqual(expected)](https://playwright.dev/docs/api/class-genericassertions#generic-assertions-to-equal)
 * to perform pattern matching.
 *
 * **Usage**
 *
 * ```js
 * expect('123ms').toEqual(expect.stringMatching(/\d+m?s/));
 *
 * // Inside another matcher.
 * expect({
 *   status: 'passed',
 *   time: '123ms',
 * }).toEqual({
 *   status: expect.stringMatching(/passed|failed/),
 *   time: expect.stringMatching(/\d+m?s/),
 * });
 * ```
 */
export class StringMatchingAsymmetricMatcher extends AsymmetricMatcher<RegExp> {
    /**
     * Creates a new instance of `StringMatching` asymmetric matcher.
     *
     * @param sample Pattern that expected string should match.
     * @param inverse If true, matches if the received string does not match the expected pattern.
     */
    constructor(sample: string | RegExp, inverse = false) {
        if (!isA("String", sample) && !isA("RegExp", sample)) throw new Error("Expected is not a String or a RegExp");
        // eslint-disable-next-line require-unicode-regexp
        super(new RegExp(sample), inverse);
    }

    asymmetricMatch(other: unknown): boolean {
        const doesMatch = isA<string>("String", other) && this.sample.test(other);

        return this.inverse ? !doesMatch : doesMatch;
    }

    toString(): string {
        return `String${this.inverse ? "Not" : ""}Matching`;
    }

    override getExpectedType(): string {
        return "string";
    }
}

/**
 * `expect.stringMatching()` matches a received string that in turn matches the expected pattern. Use this method
 * inside
 * [expect(value).toEqual(expected)](https://playwright.dev/docs/api/class-genericassertions#generic-assertions-to-equal)
 * to perform pattern matching.
 *
 * **Usage**
 *
 * ```js
 * expect('123ms').toEqual(expect.stringMatching(/\d+m?s/));
 *
 * // Inside another matcher.
 * expect({
 *   status: 'passed',
 *   time: '123ms',
 * }).toEqual({
 *   status: expect.stringMatching(/passed|failed/),
 *   time: expect.stringMatching(/\d+m?s/),
 * });
 * ```
 *
 * @param expected Pattern that expected string should match.
 */
export const stringMatching = (expected: string | RegExp): StringMatchingAsymmetricMatcher => new StringMatchingAsymmetricMatcher(expected);

/**
 * `expect.stringMatching()` matches a received string that in turn matches the expected pattern. Use this method
 * inside
 * [expect(value).toEqual(expected)](https://playwright.dev/docs/api/class-genericassertions#generic-assertions-to-equal)
 * to perform pattern matching.
 *
 * **Usage**
 *
 * ```js
 * expect('123ms').toEqual(expect.stringMatching(/\d+m?s/));
 *
 * // Inside another matcher.
 * expect({
 *   status: 'passed',
 *   time: '123ms',
 * }).toEqual({
 *   status: expect.stringMatching(/passed|failed/),
 *   time: expect.stringMatching(/\d+m?s/),
 * });
 * ```
 *
 * @param expected Pattern that expected string should match.
 */
export const stringNotMatching = (expected: string | RegExp): StringMatchingAsymmetricMatcher => new StringMatchingAsymmetricMatcher(expected, true);
