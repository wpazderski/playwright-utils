/**
 * Collection of comparators that can be used to compare values in tests.
 * These comparators have the same signature to be used interchangeably.
 */
export const comparators = {
    /**
     * Compares two values by checking if they have the same `id` property (===).
     *
     * @param a - The first value to compare.
     * @param b - The second value to compare.
     * @returns True if both values have the same `id`, false otherwise.
     */
    objectId: (a: unknown, b: unknown): boolean => {
        if (typeof a === "object" && a !== null && "id" in a && typeof b === "object" && b !== null && "id" in b) {
            return a.id === b.id;
        }
        return false;
    },

    /**
     * Compares two values for strict equality (===).
     *
     * @param a - The first value to compare.
     * @param b - The second value to compare.
     * @returns True if both values are strictly equal, false otherwise.
     */
    strictlyEqual: (a: unknown, b: unknown): boolean => {
        return a === b;
    },

    /**
     * Compares two values for loose equality (==).
     *
     * @param a - The first value to compare.
     * @param b - The second value to compare.
     * @returns True if both values are loosely equal, false otherwise.
     */
    looselyEqual: (a: unknown, b: unknown): boolean => {
        // eslint-disable-next-line eqeqeq
        return a == b;
    },
};

/**
 * Collection of comparators that can be used to compare values in tests.
 * These comparators have the same signature to be used interchangeably.
 * @see {@link comparators}
 */
export type Comparators = typeof comparators;

/**
 * Name of a comparator.
 * @see {@link comparators}
 */
export type ComparatorName = keyof Comparators;
