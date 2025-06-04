# playwright-utils

Common [Playwright](https://playwright.dev/) utils

## Installation and usage

Start by installing this package, for example with `pnpm`:

```sh
pnpm i -D @wpazderski/playwright-utils
```

Then import and use utils, for example:

```ts
import { expect, test } from "@playwright/test";
import { PageUtils } from "@wpazderski/playwright-utils/PageUtils.ts";

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

## Related projects

- [@wpazderski/eslint-config](https://github.com/wpazderski/eslint-config),
- [@wpazderski/typescript-config](https://github.com/wpazderski/typescript-config),
- [@wpazderski/playwright-config](https://github.com/wpazderski/playwright-config),
- [@wpazderski/configs-utils-example](https://github.com/wpazderski/configs-utils-example) - an example project that shows how to use all configs and utils.
