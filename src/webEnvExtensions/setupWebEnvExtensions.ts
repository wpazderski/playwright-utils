import type { Page } from "@playwright/test";
import { DIM_COLOR } from "jest-matcher-utils";
import "./globalTypes.ts";

/**
 * Sets up WebEnvExtensions for the given Playwright page.
 * E.g. waits for {@link window.playwrightUtils} to be available and sets color support level for Chalk library.
 *
 * @param page - The Playwright page to set up the WebEnvExtensions on.
 */
export async function setupWebEnvExtensions(page: Page): Promise<void> {
    await page.waitForFunction(() => {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        return typeof window.playwrightUtils === "object" && window.playwrightUtils !== null;
    });
    await page.evaluate(
        ([level]) => {
            window.playwrightUtils.setChalkColorSupportLevel(level);
        },
        [DIM_COLOR.level] as [typeof DIM_COLOR.level],
    );
}
