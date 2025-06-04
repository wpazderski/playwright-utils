import type { ConsoleMessage } from "@playwright/test";

export class WebConsoleWarning extends Error {
    readonly consoleMessage: ConsoleMessage;

    constructor(consoleMessage: ConsoleMessage) {
        super(`A warning occurred in the web console: ${consoleMessage.text()}`);
        this.consoleMessage = consoleMessage;
    }
}
