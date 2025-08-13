import { createMatcher } from "./toThrow.ts";

// For consistency, this matcher is largely based on Playwright's matcher: https://github.com/microsoft/playwright/blob/main/packages/playwright/bundles/expect/third_party/toThrowMatchers.ts

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
// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
export const toThrowErrorMatcher = createMatcher("toThrowError") as ReturnType<typeof createMatcher>;

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
// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
export const toThrowErrorFromPromiseMatcher = createMatcher("toThrowError", true) as ReturnType<typeof createMatcher>;
