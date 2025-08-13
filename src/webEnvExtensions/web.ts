/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/// <reference lib="dom" />

import { DIM_COLOR } from "jest-matcher-utils";
import { expect } from "./assertions/expect.ts";
import * as assertions from "./assertions/index.ts";
import { comparators } from "./comparators/comparators.ts";
import { convertDataFromSerializable } from "./serialization/convertDataFromSerializable.ts";
import { convertDataToSerializable } from "./serialization/convertDataToSerializable.ts";

/**
 * Collection of utilities and assertions for Playwright.
 */
export const playwrightUtils = {
    /**
     * Sets the color support level for Chalk library.
     * @param level - The color support level (0, 1, 2, or 3).
     */
    setChalkColorSupportLevel: (level: 0 | 1 | 2 | 3): void => {
        DIM_COLOR.level = level;
    },

    /**
     * Returns the current color support level for Chalk library.
     * @returns The current color support level (0, 1, 2, or 3).
     */
    getChalkColorSupportLevel: (): 0 | 1 | 2 | 3 => {
        return DIM_COLOR.level;
    },

    /**
     * Utility functions that can be used to make Playwright-like assertions in Web environment.
     */
    assertions: assertions as typeof assertions,

    /**
     * The main `expect` function for making Playwright-like assertions in Web environment.
     */
    expect: expect as typeof expect,

    /**
     * Comparators that can be used to compare values in Web environment.
     */
    comparators: comparators as typeof comparators,

    /**
     * Converts data that has been serialized with {@link playwrightUtils.convertDataToSerializable} or {@link convertDataToSerializable} to the original format.
     * @see {@link convertDataFromSerializable} - for Node.js environment
     * @see {@link convertDataToSerializable} - for Node.js environment
     * @see {@link playwrightUtils.convertDataToSerializable|window.playwrightUtils.convertDataToSerializable} - for Web environment
     */
    convertDataFromSerializable: convertDataFromSerializable as typeof convertDataFromSerializable,

    /**
     * Converts data to a serializable format that can be pass between Node.js and Web environments (and vice versa) through e.g. `page.evaluate`
     * @see {@link convertDataFromSerializable} - for Node.js environment
     * @see {@link convertDataToSerializable} - for Node.js environment
     * @see {@link playwrightUtils.convertDataFromSerializable|window.playwrightUtils.convertDataFromSerializable} - for Web environment
     */
    convertDataToSerializable: convertDataToSerializable as typeof convertDataToSerializable,
};

/**
 * Collection of utilities and assertions for Playwright.
 */
export type WindowPlaywrightUtils = typeof playwrightUtils;

window.playwrightUtils = playwrightUtils;
