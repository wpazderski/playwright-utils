import type { ConsoleMessage, Page } from "@playwright/test";
import { WebConsoleError } from "./errors/WebConsoleError.ts";
import { WebConsoleWarning } from "./errors/WebConsoleWarning.ts";
import type { RequiredNonNullable } from "./types.ts";

export interface PipeWebConsoleToStdoutOptions {
    /** Whether to include unimportant known messages. Defaults to **false** (unimportant known messages are ignored). */
    includeKnownMessages?: boolean | undefined;

    /**
     * Action to perform when an error message is received.
     * - **"continue"** - continue processing messages.
     * - **"throw"** - throw an instance of **WebConsoleError**.
     * - **(msg: ConsoleMessage) => void | Promise<void>** - call the function with the message.
     * Defaults to **"throw"**.
     */
    onError?: "continue" | "throw" | ((msg: ConsoleMessage) => void | Promise<void>) | undefined;

    /**
     * Action to perform when a warning message is received.
     * - **"continue"** - continue processing messages.
     * - **"throw"** - throw an instance of **WebConsoleWarning**.
     * - **(msg: ConsoleMessage) => void | Promise<void>** - call the function with the message.
     * Defaults to **"continue"**.
     */
    onWarning?: "continue" | "throw" | ((msg: ConsoleMessage) => void | Promise<void>) | undefined;
}

export class PageUtils {
    static async injectScript(page: Page, path: string): Promise<void> {
        const pathWithExt = path.endsWith(".js") ? path : `${path}.js`;
        await page.evaluate(
            `const script = document.createElement("script"); script.setAttribute("type", "text/javascript"); script.setAttribute("src", "${pathWithExt}"); document.head.appendChild(script);`,
        );
    }

    static pipeWebConsoleToStdout(page: Page, partialOptions?: PipeWebConsoleToStdoutOptions): void {
        const options: RequiredNonNullable<PipeWebConsoleToStdoutOptions> = {
            includeKnownMessages: partialOptions?.includeKnownMessages ?? false,
            onError: partialOptions?.onError ?? "throw",
            onWarning: partialOptions?.onWarning ?? "continue",
        };
        page.on("console", (msg) => {
            if (!options.includeKnownMessages) {
                if (msg.text().includes("[webpack-dev-server] Server started")) {
                    return;
                }
            }
            // eslint-disable-next-line no-console
            console.log("[webConsole]", msg);
            if (msg.type() === "error") {
                if (options.onError === "throw") {
                    throw new WebConsoleError(msg);
                } else if (typeof options.onError === "function") {
                    void options.onError(msg);
                }
            }
            if (msg.type() === "warning") {
                if (options.onWarning === "throw") {
                    throw new WebConsoleWarning(msg);
                } else if (typeof options.onWarning === "function") {
                    void options.onWarning(msg);
                }
            }
        });
    }
}
