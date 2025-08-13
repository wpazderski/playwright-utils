import type { MatcherInternalOptions } from "../../expect.ts";
import type { MatcherName } from "../types.ts";

/**
 * Options for AssertionError based on selected properties from {@link MatcherInternalOptions}.
 */
export type AssertionErrorInternalOptions = Pick<MatcherInternalOptions, "promiseExpectedState" | "isNot">;

/**
 * Represents an error thrown when an assertion fails.
 */
export class AssertionError extends Error {
    /**
     * Formats the error message by combining the matcher message and user message.
     * If the user message is not provided or is empty, only the matcher message is used.
     *
     * @param matcherMessage The message from the matcher.
     * @param userMessage An optional user-provided message.
     * @returns A formatted error message.
     */
    private static formatMessage(matcherMessage: string, userMessage?: string): string {
        if (typeof userMessage !== "string" || userMessage.trim().length === 0) {
            return matcherMessage;
        }
        return `${userMessage}\n\n${matcherMessage}`;
    }

    /**
     * The name of the matcher that caused the error.
     */
    readonly matcherName: MatcherName;

    /**
     * Internal options related to the assertion.
     */
    readonly internalOptions: AssertionErrorInternalOptions;

    /**
     * Creates an instance of AssertionError.
     *
     * @param message The error message.
     * @param matcherName The name of the matcher that caused the error.
     * @param internalOptions Internal options related to the assertion.
     */
    constructor(message: string, matcherName: MatcherName, internalOptions: MatcherInternalOptions) {
        super(AssertionError.formatMessage(message, internalOptions.message));
        this.matcherName = matcherName;
        this.internalOptions = {
            promiseExpectedState: internalOptions.promiseExpectedState,
            isNot: internalOptions.isNot,
        };
    }
}
