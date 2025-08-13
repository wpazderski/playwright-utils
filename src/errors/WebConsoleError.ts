import type { ConsoleMessage } from "@playwright/test";

/**
 * Represents an error that occurred in the web console.
 */
export class WebConsoleError extends Error {
    /**
     * The console message associated with this error.
     */
    readonly consoleMessage: ConsoleMessage;

    /**
     * Creates a new WebConsoleError instance.
     * @param consoleMessage The console message that triggered the error.
     */
    constructor(consoleMessage: ConsoleMessage) {
        super(`An error occurred in the web console: ${consoleMessage.text()}`);
        this.consoleMessage = consoleMessage;
    }
}
