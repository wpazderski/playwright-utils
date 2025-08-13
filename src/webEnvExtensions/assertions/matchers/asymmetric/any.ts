import { fnNameFor } from "../common.ts";
import { AsymmetricMatcher } from "./AsymmetricMatcher.ts";

// For consistency, this code is largely based on Playwright's code: https://github.com/microsoft/playwright/tree/main/packages/playwright/bundles/expect/third_party

/**
 * Assymmetric matcher that matches any object instance created from the
 * [`constructor`](https://playwright.dev/docs/api/class-genericassertions#generic-assertions-any-option-constructor)
 * or a corresponding primitive type. Use it inside
 * [expect(value).toEqual(expected)](https://playwright.dev/docs/api/class-genericassertions#generic-assertions-to-equal)
 * to perform pattern matching.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class AnyAsymmetricMatcher extends AsymmetricMatcher<any> {
    /**
     * Creates a new instance of `Any` asymmetric matcher.
     *
     * @param sample Constructor of the expected object like `ExampleClass`, or a primitive boxed type like `Number`.
     */
    constructor(sample: unknown) {
        if (typeof sample === "undefined") {
            throw new TypeError("any() expects to be passed a constructor function. Please pass one or use anything() to match any object.");
        }
        super(sample);
    }

    asymmetricMatch(other: unknown): boolean {
        if (this.sample === String) return typeof other === "string" || other instanceof String;

        if (this.sample === Number) return typeof other === "number" || other instanceof Number;

        if (this.sample === Function) return typeof other === "function" || other instanceof Function;

        if (this.sample === Boolean) return typeof other === "boolean" || other instanceof Boolean;

        if (this.sample === BigInt) return typeof other === "bigint" || other instanceof BigInt;

        if (this.sample === Symbol) return typeof other === "symbol" || other instanceof Symbol;

        if (this.sample === Object) return typeof other === "object";

        return other instanceof this.sample;
    }

    toString(): string {
        return "Any";
    }

    override getExpectedType(): string {
        if (this.sample === String) return "string";

        if (this.sample === Number) return "number";

        if (this.sample === Function) return "function";

        if (this.sample === Object) return "object";

        if (this.sample === Boolean) return "boolean";

        return fnNameFor(this.sample as () => unknown);
    }

    override toAsymmetricMatcher(): string {
        return `Any<${fnNameFor(this.sample as () => unknown)}>`;
    }
}

/**
 * `expect.any()` matches any object instance created from the
 * [`constructor`](https://playwright.dev/docs/api/class-genericassertions#generic-assertions-any-option-constructor)
 * or a corresponding primitive type. Use it inside
 * [expect(value).toEqual(expected)](https://playwright.dev/docs/api/class-genericassertions#generic-assertions-to-equal)
 * to perform pattern matching.
 *
 * **Usage**
 *
 * ```js
 * // Match instance of a class.
 * class Example {}
 * expect(new Example()).toEqual(expect.any(Example));
 *
 * // Match any number.
 * expect({ prop: 1 }).toEqual({ prop: expect.any(Number) });
 *
 * // Match any string.
 * expect('abc').toEqual(expect.any(String));
 * ```
 *
 * @param constructor Constructor of the expected object like `ExampleClass`, or a primitive boxed type like `Number`.
 */
export const any = (constructor: unknown): AnyAsymmetricMatcher => new AnyAsymmetricMatcher(constructor);
