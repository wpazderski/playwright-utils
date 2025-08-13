/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import { type ConsoleMessage, expect, test } from "@playwright/test";
import { PageUtils } from "../src/PageUtils.ts";

test.describe("Node.js env", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/");
    });

    test.describe("PageUtils", () => {
        test.describe("static", () => {
            test.describe(".injectScript()", () => {
                test("should inject given script into the page", async ({ page }) => {
                    await expect(page.locator("body")).not.toHaveText("example-script.ts loaded");
                    await PageUtils.injectScript(page, "example-script.js");
                    await expect(page.locator("body")).toHaveText("example-script.ts loaded");
                });

                test("should add .js extension if not present", async ({ page }) => {
                    await expect(page.locator("body")).not.toHaveText("example-script.ts loaded");
                    await PageUtils.injectScript(page, "example-script");
                    await expect(page.locator("body")).toHaveText("example-script.ts loaded");
                });
            });

            test.describe(".pipeWebConsoleToStdout()", () => {
                test("should pipe web console messages to stdout", async ({ page }) => {
                    PageUtils.pipeWebConsoleToStdout(page, { onError: "continue", onWarning: "continue" });
                    const { messages } = fakeAndSpyConsole();
                    await page.evaluate(() => {
                        console.log("Test log message", "lorem ipsum");
                        console.warn("Test warn message", "dolor sit amet");
                        console.error("Test error message", { key: "value" });
                        console.dir(
                            {
                                a: {
                                    b: {
                                        c: {
                                            d: {
                                                e: "abcde",
                                                smb: Symbol("smb"),
                                            },
                                        },
                                    },
                                },
                            },
                            {
                                depth: undefined,
                                colors: true,
                            },
                        );
                    });
                    await new Promise((resolve) => {
                        setTimeout(resolve, 100);
                    });
                    expect(messages).toStrictEqual([
                        { type: "log", args: ["[webConsole]", "Test log message", "lorem ipsum"] },
                        { type: "warn", args: ["[webConsole]", "Test warn message", "dolor sit amet"] },
                        { type: "error", args: ["[webConsole]", "Test error message", { key: "value" }] },
                        { type: "log", args: ["[webConsole]:"] },
                        {
                            type: "dir",
                            args: [
                                {
                                    a: {
                                        b: {
                                            c: {
                                                d: {
                                                    e: "abcde",
                                                    smb: undefined,
                                                },
                                            },
                                        },
                                    },
                                },
                                {
                                    depth: undefined,
                                    colors: true,
                                },
                            ],
                        },
                    ]);
                });

                test("should not pipe web console messages to stdout if allowedMethods does not include these methods", async ({ page }) => {
                    PageUtils.pipeWebConsoleToStdout(page, {
                        onError: "continue",
                        onWarning: "continue",
                        allowedMethods: ["log", "debug", "info", "dir"],
                    });
                    const { messages } = fakeAndSpyConsole();
                    await page.evaluate(() => {
                        console.log("Test log message", "lorem ipsum");
                        console.debug("Test debug message", "lorem ipsum123");
                        console.warn("Test warn message", "dolor sit amet");
                        console.error("Test error message", { key: "value" });
                    });
                    await new Promise((resolve) => {
                        setTimeout(resolve, 100);
                    });
                    expect(messages).toStrictEqual([
                        { type: "log", args: ["[webConsole]", "Test log message", "lorem ipsum"] },
                        { type: "debug", args: ["[webConsole]", "Test debug message", "lorem ipsum123"] },
                    ]);
                });

                test("should exclude known messages if includeKnownMessages is false", async ({ page }) => {
                    PageUtils.pipeWebConsoleToStdout(page, { includeKnownMessages: false, onError: "continue", onWarning: "continue" });
                    const { messages } = fakeAndSpyConsole();
                    await page.evaluate(() => {
                        console.log("[webpack-dev-server] Server started");
                        console.log("[vite] connected.");
                    });
                    await new Promise((resolve) => {
                        setTimeout(resolve, 100);
                    });
                    expect(messages).toStrictEqual([]);
                });

                test("should include known messages if includeKnownMessages is true", async ({ page }) => {
                    PageUtils.pipeWebConsoleToStdout(page, { includeKnownMessages: true, onError: "continue", onWarning: "continue" });
                    const { messages } = fakeAndSpyConsole();
                    await page.evaluate(() => {
                        console.log("[webpack-dev-server] Server started");
                        console.log("[vite] connected.");
                    });
                    await new Promise((resolve) => {
                        setTimeout(resolve, 100);
                    });
                    expect(messages).toContainEqual({
                        type: "log",
                        args: ["[webConsole]", "[webpack-dev-server] Server started"],
                    });
                    expect(messages).toContainEqual({
                        type: "log",
                        args: ["[webConsole]", "[vite] connected."],
                    });
                });

                test("should call onError callback for error messages", async ({ page }) => {
                    const calls: ConsoleMessage[] = [];
                    PageUtils.pipeWebConsoleToStdout(page, {
                        onError: (msg) => {
                            calls.push(msg);
                        },
                        onWarning: "continue",
                    });
                    fakeAndSpyConsole();
                    await page.evaluate(() => {
                        console.error("Test error message");
                    });
                    await new Promise((resolve) => {
                        setTimeout(resolve, 100);
                    });
                    expect(calls).toHaveLength(1);
                    expect(calls[0]?.text()).toBe("Test error message");
                });

                test("should call onWarning callback for warning messages", async ({ page }) => {
                    const calls: ConsoleMessage[] = [];
                    PageUtils.pipeWebConsoleToStdout(page, {
                        onError: "continue",
                        onWarning: (msg) => {
                            calls.push(msg);
                        },
                    });
                    fakeAndSpyConsole();
                    await page.evaluate(() => {
                        console.warn("Test warning message");
                    });
                    await new Promise((resolve) => {
                        setTimeout(resolve, 100);
                    });
                    expect(calls).toHaveLength(1);
                    expect(calls[0]?.text()).toBe("Test warning message");
                });

                test("should not call onError callback for error messages if allowedMethods does not include 'error'", async ({ page }) => {
                    const calls: ConsoleMessage[] = [];
                    PageUtils.pipeWebConsoleToStdout(page, {
                        onError: (msg) => {
                            calls.push(msg);
                        },
                        onWarning: "continue",
                        allowedMethods: ["log", "debug", "info", "warn", "dir"],
                    });
                    fakeAndSpyConsole();
                    await page.evaluate(() => {
                        console.error("Test error message");
                    });
                    await new Promise((resolve) => {
                        setTimeout(resolve, 100);
                    });
                    expect(calls).toHaveLength(0);
                });
            });
        });
    });
});

type MessageType = "log" | "debug" | "info" | "warn" | "error" | "dir";

interface FakeAndSpyConsoleReturn {
    messages: Array<{ type: MessageType; args: any[] }>;
    restore: () => void;
}

function fakeAndSpyConsole(): FakeAndSpyConsoleReturn {
    const origConsoleLog = console.log;
    const origConsoleDebug = console.debug;
    const origConsoleInfo = console.info;
    const origConsoleWarn = console.warn;
    const origConsoleError = console.error;
    const origConsoleDir = console.dir;
    const messages: Array<{ type: MessageType; args: any[] }> = [];
    console.log = (...args: any[]) => {
        messages.push({ type: "log", args });
    };
    console.debug = (...args: any[]) => {
        messages.push({ type: "debug", args });
    };
    console.info = (...args: any[]) => {
        messages.push({ type: "info", args });
    };
    console.warn = (...args: any[]) => {
        messages.push({ type: "warn", args });
    };
    console.error = (...args: any[]) => {
        messages.push({ type: "error", args });
    };
    console.dir = (...args: any[]) => {
        messages.push({ type: "dir", args });
    };
    return {
        messages,
        restore: () => {
            console.log = origConsoleLog;
            console.debug = origConsoleDebug;
            console.info = origConsoleInfo;
            console.warn = origConsoleWarn;
            console.error = origConsoleError;
            console.dir = origConsoleDir;
        },
    };
}
