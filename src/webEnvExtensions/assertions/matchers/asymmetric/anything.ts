import { AsymmetricMatcher } from "./AsymmetricMatcher.ts";

// For consistency, this code is largely based on Playwright's code: https://github.com/microsoft/playwright/tree/main/packages/playwright/bundles/expect/third_party

/**
 * Assymmetric matcher that matches everything except `null` and `undefined`. Use it inside
 * [expect(value).toEqual(expected)](https://playwright.dev/docs/api/class-genericassertions#generic-assertions-to-equal)
 * to perform pattern matching.
 *
 * **Usage**
 *
 * ```js
 * const value = { prop: 1 };
 * expect(value).toEqual({ prop: expect.anything() });
 * expect(value).not.toEqual({ otherProp: expect.anything() });
 * ```
 */
export class AnythingAsymmetricMatcher extends AsymmetricMatcher<void> {
    asymmetricMatch(other: unknown): boolean {
        // eslint-disable-next-line eqeqeq
        return other != null;
    }

    toString(): string {
        return "Anything";
    }

    override toAsymmetricMatcher(): string {
        return "Anything";
    }
}

/**
 * `expect.anything()` matches everything except `null` and `undefined`. Use it inside
 * [expect(value).toEqual(expected)](https://playwright.dev/docs/api/class-genericassertions#generic-assertions-to-equal)
 * to perform pattern matching.
 *
 * **Usage**
 *
 * ```js
 * const value = { prop: 1 };
 * expect(value).toEqual({ prop: expect.anything() });
 * expect(value).not.toEqual({ otherProp: expect.anything() });
 * ```
 */
export const anything = (): AnythingAsymmetricMatcher => new AnythingAsymmetricMatcher();
