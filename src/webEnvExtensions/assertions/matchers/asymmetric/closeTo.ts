import { isA } from "@jest/expect-utils";
import { pluralize } from "jest-matcher-utils";
import { AsymmetricMatcher } from "./AsymmetricMatcher.ts";

// For consistency, this code is largely based on Playwright's code: https://github.com/microsoft/playwright/tree/main/packages/playwright/bundles/expect/third_party

/**
 * Assymmetric matcher that compares floating point numbers for approximate equality. Use it inside
 * [expect(value).toEqual(expected)](https://playwright.dev/docs/api/class-genericassertions#generic-assertions-to-equal)
 * to perform pattern matching. When just comparing two numbers, prefer
 * [expect(value).toBeCloseTo(expected[, numDigits])](https://playwright.dev/docs/api/class-genericassertions#generic-assertions-to-be-close-to).
 *
 * **Usage**
 *
 * ```js
 * expect({ prop: 0.1 + 0.2 }).not.toEqual({ prop: 0.3 });
 * expect({ prop: 0.1 + 0.2 }).toEqual({ prop: expect.closeTo(0.3, 5) });
 * ```
 */
export class CloseToAsymmetricMatcher extends AsymmetricMatcher<number> {
    /**
     * The number of decimal digits after the decimal point that must be equal.
     * Defaults to 2.
     */
    private readonly precision: number;

    /**
     * Creates a new instance of `CloseTo` asymmetric matcher.
     *
     * @param sample Expected value.
     * @param precision The number of decimal digits after the decimal point that must be equal.
     * @param inverse If true, matches if the received value is not close to the expected value.
     */
    constructor(sample: number, precision = 2, inverse = false) {
        if (!isA("Number", sample)) throw new Error("Expected is not a Number");

        if (!isA("Number", precision)) throw new Error("Precision is not a Number");

        super(sample);
        this.inverse = inverse;
        this.precision = precision;
    }

    asymmetricMatch(other: unknown): boolean {
        if (!isA<number>("Number", other)) return false;
        let doesMatch: boolean;
        if (other === Infinity && this.sample === Infinity) {
            doesMatch = true; // Infinity - Infinity is NaN
        } else if (other === -Infinity && this.sample === -Infinity) {
            doesMatch = true; // -Infinity - -Infinity is NaN
        } else {
            doesMatch = Math.abs(this.sample - other) < 10 ** -this.precision / 2;
        }
        return this.inverse ? !doesMatch : doesMatch;
    }

    toString(): string {
        return `Number${this.inverse ? "Not" : ""}CloseTo`;
    }

    override getExpectedType(): string {
        return "number";
    }

    override toAsymmetricMatcher(): string {
        return [this.toString(), this.sample, `(${pluralize("digit", this.precision)})`].join(" ");
    }
}

/**
 * Compares floating point numbers for approximate equality. Use this method inside
 * [expect(value).toEqual(expected)](https://playwright.dev/docs/api/class-genericassertions#generic-assertions-to-equal)
 * to perform pattern matching. When just comparing two numbers, prefer
 * [expect(value).toBeCloseTo(expected[, numDigits])](https://playwright.dev/docs/api/class-genericassertions#generic-assertions-to-be-close-to).
 *
 * **Usage**
 *
 * ```js
 * expect({ prop: 0.1 + 0.2 }).not.toEqual({ prop: 0.3 });
 * expect({ prop: 0.1 + 0.2 }).toEqual({ prop: expect.closeTo(0.3, 5) });
 * ```
 *
 * @param expected Expected value.
 * @param numDigits The number of decimal digits after the decimal point that must be equal.
 */
export const closeTo = (expected: number, numDigits?: number): CloseToAsymmetricMatcher => new CloseToAsymmetricMatcher(expected, numDigits);

/**
 * Compares floating point numbers for approximate equality. Use this method inside
 * [expect(value).toEqual(expected)](https://playwright.dev/docs/api/class-genericassertions#generic-assertions-to-equal)
 * to perform pattern matching. When just comparing two numbers, prefer
 * [expect(value).toBeCloseTo(expected[, numDigits])](https://playwright.dev/docs/api/class-genericassertions#generic-assertions-to-be-close-to).
 *
 * **Usage**
 *
 * ```js
 * expect({ prop: 0.1 + 0.2 }).not.toEqual({ prop: 0.3 });
 * expect({ prop: 0.1 + 0.2 }).toEqual({ prop: expect.closeTo(0.3, 5) });
 * ```
 *
 * @param expected Expected value.
 * @param numDigits The number of decimal digits after the decimal point that must be equal.
 */
export const notCloseTo = (expected: number, numDigits?: number): CloseToAsymmetricMatcher => new CloseToAsymmetricMatcher(expected, numDigits, true);
