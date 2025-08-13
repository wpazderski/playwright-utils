# @wpazderski/playwright-utils

Common [Playwright](https://playwright.dev/) utils

Docs: [https://wpazderski.github.io/playwright-utils/](https://wpazderski.github.io/playwright-utils/)

## Installation and usage

Start by installing this package, for example with `pnpm`:

```sh
pnpm i -D @wpazderski/playwright-utils
```

Then import and use utils, for example:

```ts
import { expect, test } from "@playwright/test";
import { PageUtils } from "@wpazderski/playwright-utils/PageUtils.js";

test.describe("example", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/");
        PageUtils.pipeWebConsoleToStdout(page);
    });

    test("testing works", async ({ page }) => {
        const pElement = page.locator("p.read-the-docs");
        await expect(pElement).toHaveText(/Click on the Vite and React logos to learn more/u);
    });
});
```

### `PageUtils`

#### `injectScript(page: Page, path: string): Promise<void>`

Injects script script (path) into the page.

#### `pipeWebConsoleToStdout(page: Page, partialOptions?: PipeWebConsoleToStdoutOptions): void`

Adds page `console` event listener and prints received messages into Playwright's console (Node.js).

### WebEnvExtensions

#### Setup

To start using WebEnvExtensions you have to import `@wpazderski/playwright-utils/webEnvExtensions/web.js` inside web environment (it'll add `playwrightUtils` to `window`). It can be done conditionally e.g.:

```ts
if (import.meta.env["isTestEnv"] === true) {
    await import("@wpazderski/playwright-utils/webEnvExtensions/web.js");
}
```

Then call `setupWebEnvExtensions(page)` in your tests:

```ts
import { setupWebEnvExtensions } from "@wpazderski/playwright-utils/webEnvExtensions/setupWebEnvExtensions.js";

test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await setupWebEnvExtensions(page);
});
```

#### Assertions

This module provides a capability of running assertions in web-env (`page.evaluate`). Usage:

```ts
test("example", async ({ page }) => {
    const isOk = await page.evaluate(() => {
        const example = new Example();
        window.playwrightUtils.expect(example.getPromise()).toBeInstanceOf(Promise);
        window.playwrightUtils.expect(deferred.getPromise()).resolves.toBe(142);
        return true;
    });
    expect(isOk).toBe(true);
});
```

This feature is intended to provide basic assertions in web environment - it's not intended to replicate the full functionality of Playwright.

Available assertions (e.g. `expect(...).toBe(...)`):

- `toBe`,
- `toBeCloseTo`,
- `toBeDefined`,
- `toBeFalsy`,
- `toBeGreaterThan`,
- `toBeGreaterThanOrEqual`,
- `toBeInstanceOf`,
- `toBeLessThan`,
- `toBeLessThanOrEqual`,
- `toBeNaN`,
- `toBeNull`,
- `toBeTruthy`,
- `toBeUndefined`,
- `toContain`,
- `toContainEqual`,
- `toEqual`,
- `toHaveLength`,
- `toHaveProperty`,
- `toMatch`,
- `toMatchObject`,
- `toStrictEqual`,
- `toThrow`,
- `toThrowError`.

Available modifiers:

- `not` e.g. `expect(3).not.toBe(4)`,
- `resolves` e.g. `expect(Promise.resolve(3)).resolves.toBe(3)`,
- `rejects` e.g. `expect(Promise.reject(3)).rejects.toBe(3)`,
- `not` + `resolves` e.g. `expect(Promise.resolve(3)).resolves.not.toBe(4)`,
- `not` + `rejects` e.g. `expect(Promise.reject(3)).rejects.not.toBe(4)`.

Available asymmetric matchers (e.g. `expect({ foo: 1, bar: 2 }).toEqual(expect.objectContaining({ bar: expect.any(Number) }));`):

- `any`,
- `anything`,
- `arrayContaining` and `not.arrayContaining`,
- `closeTo` and `not.closeTo`,
- `objectContaining` and `not.objectContaining`,
- `stringContaining` and `not.stringContaining`,
- `stringMatching` and `not.stringMatching`.

See [Playwright Docs](https://playwright.dev/docs/api/class-genericassertions) for more information about these assertions, modifiers and matchers.

#### Comparators

This module provides comparators that can be used in web-env (`page.evaluate`). Usage:

```ts
test("example", async ({ page }) => {
    const result = await page.evaluate(() => {
        const haystack = [{ id: 3 }, { id: 7 }, { id: 3 }, { id: 19 }];
        const needle = { id: 3 };
        const comparator = window.playwrightUtils.comparators.objectId;
        const count = haystack.filter((obj) => comparator(obj, needle));
        return count;
    });
    expect(result).toStrictEqual(2);
});
```

It's also possible to use comparators in Node environment:

```ts
import { comparators } from "@wpazderski/playwright-utils/webEnvExtensions/comparators/comparators.js";

test("example", ({ page }) => {
    const haystack = [{ id: 3 }, { id: 7 }, { id: 3 }, { id: 19 }];
    const needle = { id: 3 };
    const comparator = comparators.objectId;
    const count = haystack.filter((obj) => comparator(obj, needle));
    expect(count).toStrictEqual(2);
});
```

Currently following comparators are available:

- `objectId(a, b) => a.id === b.id`
- `strictlyEqual(a, b) => a === b`
- `looselyEqual(a, b) => a == b`

#### Serialization

This module makes it possible to serialize more types of data that can be passed between Node and Web environments e.g. when using `page.evaluate()`:

- functions,
- symbols,
- references (objects (inc. arrays), functions, symbols) - see the following example.

```ts
import { convertDataToSerializable } from "@wpazderski/playwright-utils/webEnvExtensions/serialization/convertDataToSerializable.js";

test.only("example", async ({ page }) => {
    const obj1 = { a: 123 };
    const obj2 = { a: 123 };
    const smb1 = Symbol("test123");
    const smb2 = Symbol("test123");
    const fn = (a: number, b: number): number => a + b;
    class Cls {
        a: number;
        constructor(a: number) {
            this.a = a;
        }
        fn(b: number): number {
            return this.a + b;
        }
    }
    const date = new Date();
    const dataNode = {
        obj1a: obj1,
        obj1b: obj1,
        obj2: obj2,
        smb1a: smb1,
        smb1b: smb1,
        smb2a: smb2,
        fn: fn,
        Cls: Cls,
        date: date,
    };
    await page.evaluate(
        ([serializable]) => {
            // eslint-disable-next-line playwright/no-unsafe-references
            const dataWeb = window.playwrightUtils.convertDataFromSerializable(serializable) as typeof dataNode;
            console.log(dataWeb);
            console.log("obj1a === obj1b:", dataWeb.obj1a === dataWeb.obj1b); // true - same reference
            console.log("obj1a === obj2:", dataWeb.obj1a === dataWeb.obj2); // false - different references
            console.log("smb1a === smb1b:", dataWeb.smb1a === dataWeb.smb1b); // true - same symbol
            console.log("smb1a === smb2a:", dataWeb.smb1a === dataWeb.smb2a); // false - different symbols
            console.log("fn(1, 2):", dataWeb.fn(1, 2)); // 3
            const cls = new dataWeb.Cls(100);
            console.log("cls.fn(5):", cls.fn(5)); // 105
            console.log("date:", dataWeb.date, dataWeb.date instanceof Date); // true
        },
        [convertDataToSerializable(dataNode)] as const,
    );
});
```

Both `convertDataFromSerializable` and `convertDataToSerializable` are available in both Node and Web environments:

```ts
// Node
import { convertDataFromSerializable } from "@wpazderski/playwright-utils/webEnvExtensions/serialization/convertDataFromSerializable.js";
import { convertDataToSerializable } from "@wpazderski/playwright-utils/webEnvExtensions/serialization/convertDataToSerializable.js";

// Web
window.playwrightUtils.convertDataFromSerializable(...);
window.playwrightUtils.convertDataToSerializable(...);
```

## Related projects

See [https://pazderski.dev/projects/](https://pazderski.dev/projects/) for other projects that provide various configs, utils, tools and examples.
