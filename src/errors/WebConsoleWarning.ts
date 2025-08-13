import type { ConsoleMessage } from "@playwright/test";

/**
 * Represents a warning that occurred in the web console.
 */
export class WebConsoleWarning extends Error {
    /**
     * The console message associated with this warning.
     */
    readonly consoleMessage: ConsoleMessage;

    /**
     * Creates a new WebConsoleWarning instance.
     * @param consoleMessage The console message that triggered the warning.
     */
    constructor(consoleMessage: ConsoleMessage) {
        super(`A warning occurred in the web console: ${consoleMessage.text()}`);
        this.consoleMessage = consoleMessage;
    }
}
