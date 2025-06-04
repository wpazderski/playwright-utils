import type { ConsoleMessage } from "@playwright/test";

export class WebConsoleError extends Error {
    readonly consoleMessage: ConsoleMessage;

    constructor(consoleMessage: ConsoleMessage) {
        super(`An error occurred in the web console: ${consoleMessage.text()}`);
        this.consoleMessage = consoleMessage;
    }
}
