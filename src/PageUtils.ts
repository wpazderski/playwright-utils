import type { ConsoleMessage, Page } from "@playwright/test";
import { WebConsoleError } from "./errors/WebConsoleError.ts";
import { WebConsoleWarning } from "./errors/WebConsoleWarning.ts";
import type { RequiredNonNullable } from "./types.ts";

/**
 * Options for the {@link PageUtils.pipeWebConsoleToStdout} method.
 */
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

    /**
     * Allowed console methods to process.
     * Defaults to `["log", "debug", "info", "warn", "error", "dir"]`.
     */
    allowedMethods?: string[] | undefined;
}

/**
 * Utility class for Playwright page operations.
 */
export class PageUtils {
    /**
     * Injects given script into the page via `<script>` tag.
     * Adds `.js` extension if not present.
     *
     * @param page - The Playwright page to inject the script into.
     * @param path - The path to the script file to inject.
     */
    static async injectScript(page: Page, path: string): Promise<void> {
        const pathWithExt = path.endsWith(".js") ? path : `${path}.js`;
        await page.evaluate(
            `const script = document.createElement("script"); script.setAttribute("type", "text/javascript"); script.setAttribute("src", "${pathWithExt}"); document.head.appendChild(script);`,
        );
    }

    /**
     * Pipes web console messages to stdout.
     * Handlers errors and warnings based on the provided options.
     *
     * @param page - The Playwright page to listen for console messages.
     * @param partialOptions - Partial options for handling console messages.
     * @throws {WebConsoleError} if an error message is received and `onError` is set to "throw".
     * @throws {WebConsoleWarning} if a warning message is received and `onWarning
     */
    static pipeWebConsoleToStdout(page: Page, partialOptions?: PipeWebConsoleToStdoutOptions): void {
        const options: RequiredNonNullable<PipeWebConsoleToStdoutOptions> = {
            includeKnownMessages: partialOptions?.includeKnownMessages ?? false,
            onError: partialOptions?.onError ?? "throw",
            onWarning: partialOptions?.onWarning ?? "continue",
            allowedMethods: partialOptions?.allowedMethods ?? ["log", "debug", "info", "warn", "error", "dir"],
        };
        page.on("console", async (msg) => {
            if (!options.includeKnownMessages) {
                const text = msg.text();
                if (text.includes("[webpack-dev-server] Server started")) {
                    return;
                }
                if (text.includes("[vite] connected.")) {
                    return;
                }
            }
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            const args = await Promise.all(msg.args().map(async (arg) => await arg.jsonValue()));
            let method = msg.type() as keyof typeof console | "warning";
            if (method === "warning") {
                method = "warn";
            }
            if (!options.allowedMethods.includes(method)) {
                return;
            }
            // eslint-disable-next-line no-console, @typescript-eslint/no-explicit-any
            const func = (typeof console[method] === "function" ? console[method] : console.log) as (...args: any[]) => void;
            if (method === "log" || method === "debug" || method === "info" || method === "warn" || method === "error") {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                func("[webConsole]", ...args);
            } else {
                // eslint-disable-next-line no-console
                console.log("[webConsole]:");
                // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                func(...args);
            }
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
