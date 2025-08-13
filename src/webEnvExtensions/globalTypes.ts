import type { WindowPlaywrightUtils } from "./web.ts";

declare global {
    interface Window {
        /**
         * Collection of utilities and assertions for Playwright.
         */
        playwrightUtils: WindowPlaywrightUtils;
    }
}
