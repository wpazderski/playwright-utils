import { equals } from "@jest/expect-utils";
import { getCustomEqualityTesters, getState, utils } from "../common.ts";
import type { AsymmetricMatcher as AsymmetricMatcherInterface, MatcherContext, MatcherState } from "../types.ts";

// For consistency, this code is largely based on Playwright's code: https://github.com/microsoft/playwright/tree/main/packages/playwright/bundles/expect/third_party

/**
 * Base class for asymmetric matchers.
 *
 * @template T The type of the sample value to match against.
 */
export abstract class AsymmetricMatcher<T> implements AsymmetricMatcherInterface {
    /**
     * Symbol to identify asymmetric matcher.
     */
    $$typeof: symbol = Symbol.for("jest.asymmetricMatcher");

    /**
     * The sample value to match against.
     */
    protected sample: T;

    /**
     * If true, the matcher will check for non-matching values.
     */
    protected inverse: boolean;

    /**
     * Constructs an asymmetric matcher.
     *
     * @param sample The sample value to match against.
     * @param inverse If true, the matcher will check for non-matching values.
     */
    constructor(sample: T, inverse = false) {
        this.sample = sample;
        this.inverse = inverse;
    }

    abstract asymmetricMatch(other: unknown): boolean;

    abstract toString(): string;

    /**
     * Returns the context for the asymmetric matcher.
     *
     * @returns The context for the asymmetric matcher.
     */
    protected getMatcherContext(): MatcherContext {
        return {
            customTesters: getCustomEqualityTesters(),
            dontThrow: () => {},
            ...getState<MatcherState>(),
            equals: equals,
            isNot: this.inverse,
            utils: utils,
        };
    }

    getExpectedType?(): string;

    toAsymmetricMatcher?(): string;
}

/**
 * Names of asymmetric matchers.
 */
export const asymmetricMatcherNames = ["any", "anything", "arrayContaining", "closeTo", "objectContaining", "stringContaining", "stringMatching"] as const;

/**
 * Name of an asymmetric matcher.
 */
export type AsymmetricMatcherName = (typeof asymmetricMatcherNames)[number];

/**
 * Checks if the given name is an asymmetric matcher name.
 *
 * @param name The name to check.
 * @returns `true` if the name is an asymmetric matcher name, otherwise `false`.
 */
export function isAsymmetricMatcherName(name: string): name is AsymmetricMatcherName {
    return asymmetricMatcherNames.includes(name as AsymmetricMatcherName);
}
