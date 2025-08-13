import { type WindowEx, testMatcher } from "../testMatcher.testUtils.ts";

// eslint-disable-next-line playwright/require-hook
testMatcher("objectContaining", {
    beforeEach: async (page) => {
        await page.evaluate(() => {
            (window as unknown as WindowEx).testCases = {
                pass: [
                    {
                        name: "object; matcher=objectContaining; matches=yes",
                        value: { test: "test123" },
                        matcherArgs: [window.playwrightUtils.expect.objectContaining({ test: "test123" })],
                    },
                    {
                        name: "array; matcher=objectContaining; matches=yes",
                        value: ["test123"],
                        matcherArgs: [window.playwrightUtils.expect.objectContaining({ 0: "test123" })],
                    },
                    {
                        name: "object; matcher=not.objectContaining; matches=no",
                        value: { test: "test123" },
                        matcherArgs: [window.playwrightUtils.expect.not.objectContaining({ test: "test456" })],
                    },
                    {
                        name: "array; matcher=not.objectContaining; matches=no",
                        value: ["test123"],
                        matcherArgs: [window.playwrightUtils.expect.not.objectContaining({ 0: "test456" })],
                    },
                    {
                        name: "object-superset; matcher=objectContaining; matches=yes",
                        value: { test: "test123", extra: "extraValue" },
                        matcherArgs: [window.playwrightUtils.expect.objectContaining({ test: "test123" })],
                    },
                    {
                        name: "array-superset; matcher=objectContaining; matches=yes",
                        value: ["test123", "extraValue"],
                        matcherArgs: [window.playwrightUtils.expect.objectContaining({ 0: "test123" })],
                    },
                ],
                fail: [
                    {
                        name: "object; matcher=objectContaining; matches=no",
                        value: { test: "test123" },
                        matcherArgs: [window.playwrightUtils.expect.objectContaining({ test: "test456" })],
                    },
                    {
                        name: "array; matcher=objectContaining; matches=no",
                        value: ["test123"],
                        matcherArgs: [window.playwrightUtils.expect.objectContaining({ 0: "test456" })],
                    },
                    {
                        name: "object; matcher=not.objectContaining; matches=yes",
                        value: { test: "test123" },
                        matcherArgs: [window.playwrightUtils.expect.not.objectContaining({ test: "test123" })],
                    },
                    {
                        name: "array; matcher=not.objectContaining; matches=yes",
                        value: ["test123"],
                        matcherArgs: [window.playwrightUtils.expect.not.objectContaining({ 0: "test123" })],
                    },
                ],
                alwaysFail: [
                    {
                        name: "string",
                        value: { test: "test123" },
                        matcherArgs: [window.playwrightUtils.expect.objectContaining("test123" as unknown as Record<string, unknown>)],
                    },
                    {
                        name: "number",
                        value: { test: "test123" },
                        matcherArgs: [window.playwrightUtils.expect.objectContaining(123456 as unknown as Record<string, unknown>)],
                    },
                    {
                        name: "bigint",
                        value: { test: "test123" },
                        matcherArgs: [window.playwrightUtils.expect.objectContaining(1234567890123456789012345678901234567890n as unknown as Record<string, unknown>)],
                    },
                    {
                        name: "boolean",
                        value: { test: "test123" },
                        matcherArgs: [window.playwrightUtils.expect.objectContaining(true as unknown as Record<string, unknown>)],
                    },
                    {
                        name: "null",
                        value: { test: "test123" },
                        matcherArgs: [window.playwrightUtils.expect.objectContaining(null as unknown as Record<string, unknown>)],
                    },
                    {
                        name: "undefined",
                        value: { test: "test123" },
                        matcherArgs: [window.playwrightUtils.expect.objectContaining(undefined as unknown as Record<string, unknown>)],
                    },
                    {
                        name: "function",
                        value: { test: "test123" },
                        matcherArgs: [window.playwrightUtils.expect.objectContaining((() => {}) as unknown as Record<string, unknown>)],
                    },
                    {
                        name: "symbol",
                        value: { test: "test123" },
                        matcherArgs: [window.playwrightUtils.expect.objectContaining(Symbol("test") as unknown as Record<string, unknown>)],
                    },
                ],
            };
        });
    },
});
