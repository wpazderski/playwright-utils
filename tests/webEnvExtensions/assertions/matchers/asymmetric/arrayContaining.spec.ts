import { type WindowEx, testMatcher } from "../testMatcher.testUtils.ts";

// eslint-disable-next-line playwright/require-hook
testMatcher("arrayContaining", {
    beforeEach: async (page) => {
        await page.evaluate(() => {
            (window as unknown as WindowEx).testCases = {
                pass: [
                    {
                        name: "array; matcher=arrayContaining; matches=yes",
                        value: ["test123"],
                        matcherArgs: [window.playwrightUtils.expect.arrayContaining(["test123"])],
                    },
                    {
                        name: "array; matcher=not.arrayContaining; matches=no",
                        value: ["test123"],
                        matcherArgs: [window.playwrightUtils.expect.not.arrayContaining(["test456"])],
                    },
                    {
                        name: "array-superset; matcher=arrayContaining; matches=yes",
                        value: ["test123", "extraValue"],
                        matcherArgs: [window.playwrightUtils.expect.arrayContaining(["test123"])],
                    },
                    {
                        name: "array-anyOrder; matcher=arrayContaining; matches=yes",
                        value: ["a", "b", "c"],
                        matcherArgs: [window.playwrightUtils.expect.arrayContaining(["c", "a", "b"])],
                    },
                    {
                        name: "array-superset-anyOrder; matcher=arrayContaining; matches=yes",
                        value: ["a", "b", "c", "d", "e", "f"],
                        matcherArgs: [window.playwrightUtils.expect.arrayContaining(["f", "a", "b"])],
                    },
                    {
                        name: "array-superset-anyOrder; matcher=not.arrayContaining; matches=no",
                        value: ["a", "b", "c", "d", "e", "f"],
                        matcherArgs: [window.playwrightUtils.expect.not.arrayContaining(["f", "z", "b"])],
                    },
                ],
                fail: [
                    {
                        name: "array; matcher=arrayContaining; matches=no",
                        value: ["test123"],
                        matcherArgs: [window.playwrightUtils.expect.arrayContaining(["test456"])],
                    },
                    {
                        name: "array; matcher=not.arrayContaining; matches=yes",
                        value: ["test123"],
                        matcherArgs: [window.playwrightUtils.expect.not.arrayContaining(["test123"])],
                    },
                    {
                        name: "array-superset-anyOrder; matcher=arrayContaining; matches=no",
                        value: ["a", "b", "c", "d", "e", "f"],
                        matcherArgs: [window.playwrightUtils.expect.arrayContaining(["f", "z", "b"])],
                    },
                ],
                alwaysFail: [
                    {
                        name: "string",
                        value: ["test123"],
                        matcherArgs: [window.playwrightUtils.expect.arrayContaining("test123" as unknown as unknown[])],
                    },
                    {
                        name: "number",
                        value: ["test123"],
                        matcherArgs: [window.playwrightUtils.expect.arrayContaining(123456 as unknown as unknown[])],
                    },
                    {
                        name: "bigint",
                        value: ["test123"],
                        matcherArgs: [window.playwrightUtils.expect.arrayContaining(1234567890123456789012345678901234567890n as unknown as unknown[])],
                    },
                    {
                        name: "boolean",
                        value: ["test123"],
                        matcherArgs: [window.playwrightUtils.expect.arrayContaining(true as unknown as unknown[])],
                    },
                    {
                        name: "null",
                        value: ["test123"],
                        matcherArgs: [window.playwrightUtils.expect.arrayContaining(null as unknown as unknown[])],
                    },
                    {
                        name: "undefined",
                        value: ["test123"],
                        matcherArgs: [window.playwrightUtils.expect.arrayContaining(undefined as unknown as unknown[])],
                    },
                    {
                        name: "function",
                        value: ["test123"],
                        matcherArgs: [window.playwrightUtils.expect.arrayContaining((() => {}) as unknown as unknown[])],
                    },
                    {
                        name: "symbol",
                        value: ["test123"],
                        matcherArgs: [window.playwrightUtils.expect.arrayContaining(Symbol("test") as unknown as unknown[])],
                    },
                    {
                        name: "object",
                        value: ["test123"],
                        matcherArgs: [window.playwrightUtils.expect.arrayContaining(Symbol("test") as unknown as unknown[])],
                    },
                ],
            };
        });
    },
});
