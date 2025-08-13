/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unnecessary-condition */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { expect, test } from "@playwright/test";
import { PageUtils } from "../../../src/PageUtils.ts";
import { convertDataFromSerializable } from "../../../src/webEnvExtensions/serialization/convertDataFromSerializable.ts";
import { convertDataToSerializable } from "../../../src/webEnvExtensions/serialization/convertDataToSerializable.ts";
import { setupWebEnvExtensions } from "../../../src/webEnvExtensions/setupWebEnvExtensions.ts";

test.describe("Node.js and Web envs", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/");
        PageUtils.pipeWebConsoleToStdout(page);
        await setupWebEnvExtensions(page);
    });

    test.describe("convertDataFromSerializable() and convertDataToSerializable()", () => {
        test("should allow types supported by Playwright to be passed correctly", async ({ page }) => {
            const dataNode = {
                string: "test",
                numberInt: 123,
                numberFloat: 123.456,
                bigInt: 12345678901234567890123456789012345678901234567890n,
                booleanTrue: true,
                booleanFalse: false,
                null: null,
                undefined: undefined,
                array: [1, 2, 3],
                object: { key: "value" },
                deep: {
                    array: [
                        1,
                        2,
                        {
                            nested: "value",
                            arr: [4, 5, 6],
                        },
                    ],
                    object: {
                        nestedKey: "nestedValue",
                        anotherKey: { subKey: "subValue", array: [7, 8, 9] },
                    },
                },
            } as const;
            const data2NodeSerialized = await page.evaluate(
                ([dataWebSerialized]) => {
                    // eslint-disable-next-line playwright/no-unsafe-references
                    const dataWeb = window.playwrightUtils.convertDataFromSerializable(dataWebSerialized) as typeof dataNode;
                    if (dataWeb.bigInt !== 12345678901234567890123456789012345678901234567890n) {
                        throw new Error("Data was not converted correctly");
                    }
                    if (dataWeb.deep.array[2].arr[0] !== 4 || dataWeb.deep.array[2].arr[1] !== 5 || dataWeb.deep.array[2].arr[2] !== 6) {
                        throw new Error("Data was not converted correctly");
                    }
                    if (dataWeb.deep.object.anotherKey.subKey !== "subValue") {
                        throw new Error("Data was not converted correctly");
                    }
                    return window.playwrightUtils.convertDataToSerializable(dataWeb);
                },
                [convertDataToSerializable(dataNode)] as const,
            );
            const data2Node = convertDataFromSerializable(data2NodeSerialized);
            expect(data2Node).toStrictEqual(dataNode);
        });

        test("should allow functions to be passed correctly", async ({ page }) => {
            const fnNode = (...args: number[]): number => {
                return args.reduce((acc, val) => acc + val, 0);
            };
            const fnNodeSerialized = await page.evaluate(
                ([fnWebSerialized]) => {
                    // eslint-disable-next-line playwright/no-unsafe-references
                    const fnWeb = window.playwrightUtils.convertDataFromSerializable(fnWebSerialized) as typeof fnNode;
                    if (typeof fnWeb !== "function") {
                        throw new Error("Function was not converted correctly");
                    }
                    return window.playwrightUtils.convertDataToSerializable(fnWeb);
                },
                [convertDataToSerializable(fnNode)] as const,
            );
            const fnNodeConverted = convertDataFromSerializable(fnNodeSerialized) as typeof fnNode;
            expect(typeof fnNodeConverted).toBe("function");
            const args = [1, 2, 3, 4, 5];
            expect(fnNodeConverted(...args)).toBe(fnNode(...args));

            const objNode = { fn: fnNode };
            const objNodeSerialized = await page.evaluate(
                ([objWebSerialized]) => {
                    // eslint-disable-next-line playwright/no-unsafe-references
                    const objWeb = window.playwrightUtils.convertDataFromSerializable(objWebSerialized) as typeof objNode;
                    if (typeof objWeb.fn !== "function") {
                        throw new Error("Function in object was not converted correctly");
                    }
                    return window.playwrightUtils.convertDataToSerializable(objWeb);
                },
                [convertDataToSerializable(objNode)] as const,
            );
            const objNodeConverted = convertDataFromSerializable(objNodeSerialized) as typeof objNode;
            expect(typeof objNodeConverted.fn).toBe("function");
            expect(objNodeConverted.fn(...args)).toBe(fnNode(...args));
        });

        test("should allow symbols to be passed correctly", async ({ page }) => {
            const symNode = Symbol("testSymbol");
            const symNodeSerialized = await page.evaluate(
                ([symWebSerialized]) => {
                    // eslint-disable-next-line playwright/no-unsafe-references
                    const symWeb = window.playwrightUtils.convertDataFromSerializable(symWebSerialized) as typeof symNode;
                    if (typeof symWeb !== "symbol") {
                        throw new Error("Symbol was not converted correctly");
                    }
                    return window.playwrightUtils.convertDataToSerializable(symWeb);
                },
                [convertDataToSerializable(symNode)] as const,
            );
            const symNodeConverted = convertDataFromSerializable(symNodeSerialized) as typeof symNode;
            expect(typeof symNodeConverted).toBe("symbol");
            expect(symNodeConverted.description).toBe(symNode.description);

            const objNode = { sym: symNode };
            const objNodeSerialized = await page.evaluate(
                ([objWebSerialized]) => {
                    // eslint-disable-next-line playwright/no-unsafe-references
                    const objWeb = window.playwrightUtils.convertDataFromSerializable(objWebSerialized) as typeof objNode;
                    if (typeof objWeb.sym !== "symbol") {
                        throw new Error("Symbol in object was not converted correctly");
                    }
                    return window.playwrightUtils.convertDataToSerializable(objWeb);
                },
                [convertDataToSerializable(objNode)] as const,
            );
            const objNodeConverted = convertDataFromSerializable(objNodeSerialized) as typeof objNode;
            expect(typeof objNodeConverted.sym).toBe("symbol");
            expect(objNodeConverted.sym.description).toBe(symNode.description);
        });

        test("should handle circular references", async ({ page }) => {
            const circularNode: any = {};
            circularNode.self = circularNode;
            circularNode.array = [circularNode, circularNode];
            circularNode.object = { self: circularNode };

            const circularNodeSerialized = await page.evaluate(
                ([circularWebSerialized]) => {
                    // eslint-disable-next-line playwright/no-unsafe-references
                    const circularWeb = window.playwrightUtils.convertDataFromSerializable(circularWebSerialized) as typeof circularNode;
                    if (circularWeb.self !== circularWeb) {
                        throw new Error("Circular reference was not converted correctly");
                    }
                    if (circularWeb.array[0] !== circularWeb || circularWeb.array[1] !== circularWeb) {
                        throw new Error("Circular reference in array was not converted correctly");
                    }
                    if (circularWeb.object.self !== circularWeb) {
                        throw new Error("Circular reference in object was not converted correctly");
                    }
                    return window.playwrightUtils.convertDataToSerializable(circularWeb);
                },
                [convertDataToSerializable(circularNode)] as const,
            );
            const circularNodeConverted = convertDataFromSerializable(circularNodeSerialized) as typeof circularNode;
            expect(circularNodeConverted.self).toBe(circularNodeConverted);
            expect(circularNodeConverted.array[0]).toBe(circularNodeConverted);
            expect(circularNodeConverted.array[1]).toBe(circularNodeConverted);
            expect(circularNodeConverted.object.self).toBe(circularNodeConverted);
        });

        test("should keep references to the same objects, arrays, functions and symbols", async ({ page }) => {
            const obj1 = { key: "value" };
            const obj2 = { key: "value" };
            const arr1 = [1, 2, 3];
            const arr2 = [4, 5, 6];
            const fn1 = (x: number): number => x * 2;
            const fn2 = (x: number): number => x + 1;
            const sym1 = Symbol("sym1");
            const sym2 = Symbol("sym2");
            const objNode = {
                obj1a: obj1,
                obj1b: obj1,
                obj2: obj2,
                arr1a: arr1,
                arr1b: arr1,
                arr2: arr2,
                fn1a: fn1,
                fn1b: fn1,
                fn2: fn2,
                sym1a: sym1,
                sym1b: sym1,
                sym2: sym2,
            } as const;
            const objNodeSerialized = await page.evaluate(
                ([objWebSerialized]) => {
                    // eslint-disable-next-line playwright/no-unsafe-references
                    const objWeb = window.playwrightUtils.convertDataFromSerializable(objWebSerialized) as typeof objNode;
                    if (objWeb.obj1a !== objWeb.obj1b || objWeb.obj1a === objWeb.obj2) {
                        throw new Error("Objects were not converted correctly");
                    }
                    if (objWeb.arr1a !== objWeb.arr1b || objWeb.arr1a === objWeb.arr2) {
                        throw new Error("Arrays were not converted correctly");
                    }
                    if (objWeb.fn1a !== objWeb.fn1b || objWeb.fn1a === objWeb.fn2) {
                        throw new Error("Functions were not converted correctly");
                    }
                    if (objWeb.sym1a !== objWeb.sym1b || objWeb.sym1a === (objWeb.sym2 as any)) {
                        throw new Error("Symbols were not converted correctly");
                    }
                    return window.playwrightUtils.convertDataToSerializable(objWeb);
                },
                [convertDataToSerializable(objNode)] as const,
            );
            const objNodeConverted = convertDataFromSerializable(objNodeSerialized) as typeof objNode;
            expect(objNodeConverted.obj1a).toBe(objNodeConverted.obj1b);
            expect(objNodeConverted.obj1a).not.toBe(objNodeConverted.obj2);
            expect(objNodeConverted.arr1a).toBe(objNodeConverted.arr1b);
            expect(objNodeConverted.arr1a).not.toBe(objNodeConverted.arr2);
            expect(objNodeConverted.fn1a).toBe(objNodeConverted.fn1b);
            expect(objNodeConverted.fn1a).not.toBe(objNodeConverted.fn2);
            expect(objNodeConverted.sym1a).toBe(objNodeConverted.sym1b);
            expect(objNodeConverted.sym1a).not.toBe(objNodeConverted.sym2);
            expect(objNodeConverted.obj1a).toStrictEqual(obj1);
            expect(objNodeConverted.obj2).toStrictEqual(obj2);
            expect(objNodeConverted.arr1a).toStrictEqual(arr1);
            expect(objNodeConverted.arr2).toStrictEqual(arr2);
            expect(objNodeConverted.fn1a(2)).toBe(fn1(2));
            expect(objNodeConverted.fn2(2)).toBe(fn2(2));
            expect(objNodeConverted.sym1a.description).toBe(sym1.description);
            expect(objNodeConverted.sym2.description).toBe(sym2.description);
        });
    });
});
